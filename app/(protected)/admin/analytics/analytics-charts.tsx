"use client";

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

interface AnalyticsChartsProps {
  dailyPayments: { day: string; total: number }[];
  classCompletion: { class: string; paid: number; total: number }[];
}

export default function AnalyticsCharts({
  dailyPayments,
  classCompletion,
}: AnalyticsChartsProps) {
  return (
    <>
      {/* Daily payments */}
      <Card>
        <CardHeader>
          <CardTitle>Daily Payments (Last 14 Days)</CardTitle>
        </CardHeader>
        <CardContent>
          <Line
            data={{
              labels: dailyPayments.map((r) => r.day),
              datasets: [
                {
                  label: "Payments (XAF)",
                  data: dailyPayments.map((r) => r.total),
                  tension: 0.3,
                },
              ],
            }}
            options={{ plugins: { legend: { display: false } } }}
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
              labels: classCompletion.map((r) => r.class),
              datasets: [
                {
                  label: "% Completed",
                  data: classCompletion.map((r) =>
                    r.total > 0 ? (r.paid / r.total) * 100 : 0
                  ),
                },
              ],
            }}
            options={{ scales: { y: { beginAtZero: true, max: 100 } } }}
          />
        </CardContent>
      </Card>
    </>
  );
}
