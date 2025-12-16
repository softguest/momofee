import { db } from "@/config/db";
import { classFees, payments } from "@/config/schema";
import { eq, sql } from "drizzle-orm";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import AnalyticsCharts from "./analytics-charts";

export default async function AdminAnalyticsPage() {
  const totalFees = await db
    .select({ sum: sql<number>`COALESCE(SUM(${classFees.amount}),0)` })
    .from(classFees);

  const totalPaid = await db
    .select({ sum: sql<number>`COALESCE(SUM(${payments.amount}),0)` })
    .from(payments)
    .where(eq(payments.status, "success"));

  const dailyPayments = await db.execute(sql`
    SELECT
      TO_CHAR(created_at::date, 'YYYY-MM-DD') AS day,
      SUM(amount)::numeric AS total
    FROM payments
    WHERE status = 'success'
    GROUP BY day
    ORDER BY day
  `);

  const classCompletion = await db.execute(sql`
    SELECT
      c.name AS class,
      COALESCE(SUM(p.amount), 0)::numeric AS paid,
      COALESCE(SUM(f.total_amount), 0)::numeric AS total
    FROM fees f
    JOIN students s ON s.id = f.student_id
    JOIN classes c ON c.id = s.class_id
    LEFT JOIN payments p ON p.fee_id = f.id AND p.status = 'success'
    GROUP BY c.name
  `);

  return (
    <div className="max-w-6xl mx-auto py-10 space-y-10">
      <h1 className="text-2xl font-semibold">Admin Analytics</h1>

      <AnalyticsCharts
        dailyPayments={dailyPayments.rows.map((r: any) => ({
          day: r.day,
          total: Number(r.total),
        }))}
        classCompletion={classCompletion.rows.map((r: any) => ({
          class: r.class,
          paid: Number(r.paid),
          total: Number(r.total),
        }))}
      />
    </div>
  );
}
