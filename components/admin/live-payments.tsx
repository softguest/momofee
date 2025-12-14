"use client";

import useSWR from "swr";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const fetcher = (url: string) => fetch(url).then((r) => r.json());

export function LivePayments() {
  const { data, isLoading } = useSWR("/api/admin/payments/recent", fetcher, {
    refreshInterval: 4000, // 4s
  });

  const payments = data?.payments ?? [];

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Recent Payments</CardTitle>
        <span className="text-[10px] text-muted-foreground">
          {isLoading ? "Updating…" : "Live"}
        </span>
      </CardHeader>
      <CardContent className="space-y-3 text-sm">
        {payments.length === 0 && (
          <p className="text-muted-foreground text-xs">
            No recent payments.
          </p>
        )}

        {payments.map((p: any) => (
          <div key={p.id} className="flex justify-between border-b border-border pb-2">
            <div>
              <p className="font-medium">
                {Number(p.amount).toLocaleString()} XAF
              </p>
              <p className="text-xs text-muted-foreground">
                {p.studentName} • {new Date(p.createdAt).toLocaleTimeString()}
              </p>
            </div>
            <div className="text-right">
              <p
                className={
                  p.status === "success"
                    ? "text-[color:var(--color-success,#22C55E)] text-xs font-medium"
                    : p.status === "pending"
                    ? "text-warning text-xs font-medium"
                    : "text-destructive text-xs font-medium"
                }
              >
                {p.status}
              </p>
              {p.momoTransactionId && (
                <p className="text-[10px] text-muted-foreground">
                  Tx: {p.momoTransactionId}
                </p>
              )}
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
