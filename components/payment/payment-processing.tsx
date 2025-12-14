"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface Props {
  paymentId: string;
}

export function PaymentProcessing({ paymentId }: Props) {
  const router = useRouter();
  const [status, setStatus] = useState<"pending" | "success" | "failed">(
    "pending"
  );

  useEffect(() => {
    if (!paymentId) return;

    const interval = setInterval(async () => {
      const res = await fetch(`/api/payment/status?paymentId=${paymentId}`);
      if (!res.ok) return;

      const data = await res.json();

      if (data.status === "success") {
        setStatus("success");
        clearInterval(interval);
        router.replace(`/payment/success?paymentId=${paymentId}`);
      }

      if (data.status === "failed") {
        setStatus("failed");
        clearInterval(interval);
        router.replace(`/payment/failed?paymentId=${paymentId}`);
      }
    }, 3000); // poll every 3 seconds

    return () => clearInterval(interval);
  }, [paymentId, router]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <Card className="w-full max-w-md text-center">
        <CardHeader>
          <CardTitle className="text-lg">
            Processing Payment
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Loader2 className="mx-auto h-8 w-8 animate-spin text-primary" />
          <p className="text-sm text-muted-foreground">
            Please approve the payment on your phone.
          </p>
          <p className="text-xs text-muted-foreground">
            Do not close this page.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
