import { db } from "@/config/db";
import { students, classFees, payments, classFeeInstallments } from "@/config/schema";
import { eq, sql } from "drizzle-orm";
import { notFound } from "next/navigation";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  LineElement,
  PointElement,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, LineElement, PointElement, Tooltip, Legend);

export default async function StudentAnalyticsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const studentId = id;

  const [student] = await db
    .select()
    .from(students)
    .where(eq(students.id, studentId))
    .limit(1);

  if (!student) return notFound();

  // ✅ Total fees
  const totalFees = await db.execute(sql`
    SELECT COALESCE(SUM(total_amount),0)::numeric AS total
    FROM fees
    WHERE student_id = ${studentId}
  `);

  // ✅ Total paid
  const totalPaid = await db.execute(sql`
    SELECT COALESCE(SUM(amount),0)::numeric AS total
    FROM payments
    WHERE student_id = ${studentId} AND status = 'success'
  `);

  const outstanding = Number(totalFees.rows[0].total) - Number(totalPaid.rows[0].total);

  // ✅ Installment status summary
  const installmentSummary = await db.execute(sql`
    SELECT
      i.name,
      i.amount,
      COALESCE(SUM(p.amount),0)::numeric AS paid_amount,
      CASE
        WHEN COALESCE(SUM(p.amount),0) >= i.amount THEN 'paid'
        WHEN i.due_date < NOW() THEN 'overdue'
        ELSE 'pending'
      END AS status
    FROM installments i
    LEFT JOIN payments p ON p.installment_id = i.id AND p.status = 'success'
    WHERE i.fee_id IN (SELECT id FROM fees WHERE student_id = ${studentId})
    GROUP BY i.id
    ORDER BY i.due_date ASC NULLS LAST
  `);

  // ✅ Payment trend (last 30 days)
  const paymentTrend = await db.execute(sql`
    SELECT
      TO_CHAR(created_at::date, 'YYYY-MM-DD') AS day,
      SUM(amount)::numeric AS total
    FROM payments
    WHERE student_id = ${studentId}
      AND status = 'success'
      AND created_at >= NOW() - INTERVAL '30 days'
    GROUP BY day
    ORDER BY day
  `);

  return (
    <div className="max-w-4xl mx-auto py-10 space-y-10">
      <h1 className="text-xl font-semibold">
        Analytics — {student.firstName} {student.lastName}
      </h1>

      {/* ✅ Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <SummaryCard title="Total Fees" value={`${Number(totalFees.rows[0].total).toLocaleString()} XAF`} />
        <SummaryCard title="Total Paid" value={`${Number(totalPaid.rows[0].total).toLocaleString()} XAF`} />
        <SummaryCard title="Outstanding" value={`${outstanding.toLocaleString()} XAF`} />
      </div>

      {/* ✅ Installment Summary */}
      <Card>
        <CardHeader>
          <CardTitle>Installment Status</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-sm">
          {installmentSummary.rows.map((inst: any) => (
            <div key={inst.name} className="border-b border-border pb-3 last:border-none">
              <p className="font-medium">{inst.name}</p>
              <p className="text-xs">
                {Number(inst.paid_amount).toLocaleString()} /{" "}
                {Number(inst.amount).toLocaleString()} XAF
              </p>
              <p
                className={
                  inst.status === "paid"
                    ? "text-[color:var(--color-success,#22C55E)] text-xs font-medium"
                    : inst.status === "overdue"
                    ? "text-destructive text-xs font-medium"
                    : "text-warning text-xs font-medium"
                }
              >
                {inst.status}
              </p>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* ✅ Payment Trend Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Payment Trend (Last 30 Days)</CardTitle>
        </CardHeader>
        <CardContent>
          <Line
            data={{
              labels: paymentTrend.rows.map((r: any) => r.day),
              datasets: [
                {
                  label: "Payments (XAF)",
                  data: paymentTrend.rows.map((r: any) => Number(r.total)),
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
    </div>
  );
}

function SummaryCard({ title, value }: { title: string; value: any }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm text-muted-foreground">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-xl font-semibold">{value}</p>
      </CardContent>
    </Card>
  );
}
