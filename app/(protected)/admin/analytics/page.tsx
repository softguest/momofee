import { db } from "@/config/db";
import { fees, installments, payments, students } from "@/config/schema";
import { eq, sql } from "drizzle-orm";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Bar, Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Tooltip,
  Legend
);

type PaymentCountRow = {
  status: string;
  count: number;
};


export default async function AdminAnalyticsPage() {
  // Total fees
  const totalFees = await db
    .select({ sum: sql<number>`COALESCE(SUM(${fees.totalAmount}),0)` })
    .from(fees);

  // Total paid (success)
  const totalPaid = await db
    .select({ sum: sql<number>`COALESCE(SUM(${payments.amount}),0)` })
    .from(payments)
    .where(eq(payments.status, "success"));

  const outstanding = (totalFees[0].sum ?? 0) - (totalPaid[0].sum ?? 0);

  // Overdue installments (with dueDate < now and not fully paid)
  const overdueInstallments = await db.execute(sql`
    SELECT i.id
    FROM installments i
    JOIN fees f ON f.id = i.fee_id
    LEFT JOIN payments p ON p.installment_id = i.id AND p.status = 'success'
    WHERE i.due_date < NOW()
    GROUP BY i.id, i.amount
    HAVING COALESCE(SUM(p.amount),0) < i.amount
  `);

  const overdueCount = overdueInstallments.rows.length;

  // Payment success rate
  const paymentCounts = await db.execute<PaymentCountRow>(sql`
    SELECT
      status,
      COUNT(*)::int AS count
    FROM payments
    GROUP BY status
  `);

  const successCount =
    paymentCounts.rows.find((r: any) => r.status === "success")?.count ?? 0;
  const failedCount =
    paymentCounts.rows.find((r: any) => r.status === "failed")?.count ?? 0;
  const totalAttempts = successCount + failedCount;
  const successRate =
    totalAttempts > 0 ? (successCount / totalAttempts) * 100 : 0;

  // Daily payments (last 14 days)
  const dailyPayments = await db.execute(sql`
    SELECT
      TO_CHAR(created_at::date, 'YYYY-MM-DD') AS day,
      SUM(amount)::numeric AS total
    FROM payments
    WHERE status = 'success'
      AND created_at >= NOW() - INTERVAL '14 days'
    GROUP BY day
    ORDER BY day
  `);

  // Fees completion by class (average % paid)
  const classCompletion = await db.execute(sql`
    SELECT
      s.class_name AS class,
      SUM(p.amount)::numeric AS paid,
      SUM(f.total_amount)::numeric AS total
    FROM fees f
    JOIN students s ON s.id = f.student_id
    LEFT JOIN payments p ON p.fee_id = f.id AND p.status = 'success'
    GROUP BY class
    HAVING SUM(f.total_amount) > 0
    ORDER BY class
  `);

  return (
    <div className="max-w-6xl mx-auto py-10 space-y-10">
      <h1 className="text-2xl font-semibold">Admin Analytics</h1>

      {/* Summary cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <SummaryCard
          title="Total Fees"
          value={`${(totalFees[0].sum ?? 0).toLocaleString()} XAF`}
        />
        <SummaryCard
          title="Total Paid"
          value={`${(totalPaid[0].sum ?? 0).toLocaleString()} XAF`}
        />
        <SummaryCard
          title="Outstanding"
          value={`${outstanding.toLocaleString()} XAF`}
        />
        <SummaryCard
          title="Overdue Installments"
          value={overdueCount}
        />
      </div>

      {/* Success rate */}
      <Card>
        <CardHeader>
          <CardTitle>Payment Success Rate</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-3xl font-semibold mb-2">
            {successRate.toFixed(1)}%
          </p>
          <p className="text-sm text-muted-foreground">
            Successful payments out of all attempts (success + failed).
          </p>
        </CardContent>
      </Card>

      {/* Daily payments (last 14 days) */}
      <Card>
        <CardHeader>
          <CardTitle>Daily Payments (Last 14 Days)</CardTitle>
        </CardHeader>
        <CardContent>
          <Line
            data={{
              labels: dailyPayments.rows.map((r: any) => r.day),
              datasets: [
                {
                  label: "Payments (XAF)",
                  data: dailyPayments.rows.map((r: any) =>
                    Number(r.total)
                  ),
                  borderColor: "var(--accent)",
                  backgroundColor: "var(--accent)",
                  tension: 0.3,
                },
              ],
            }}
            options={{
              plugins: { legend: { display: false } },
              scales: { y: { beginAtZero: true } },
            }}
          />
        </CardContent>
      </Card>

      {/* Class completion */}
      <Card>
        <CardHeader>
          <CardTitle>Fee Completion by Class</CardTitle>
        </CardHeader>
        <CardContent>
          <Bar
            data={{
              labels: classCompletion.rows.map((r: any) => r.class),
              datasets: [
                {
                  label: "% Completed",
                  data: classCompletion.rows.map((r: any) =>
                    Number(r.paid) > 0 && Number(r.total) > 0
                      ? (Number(r.paid) / Number(r.total)) * 100
                      : 0
                  ),
                  backgroundColor: "var(--primary)",
                },
              ],
            }}
            options={{
              scales: {
                y: { beginAtZero: true, max: 100 },
              },
            }}
          />
        </CardContent>
      </Card>
    </div>
  );
}

function SummaryCard({ title, value }: { title: string; value: any }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm text-muted-foreground">
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-xl font-semibold break-all">{value}</p>
      </CardContent>
    </Card>
  );
}
