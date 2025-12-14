"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { CheckCircle } from "lucide-react";

export default function PaymentSuccessPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <Card className="w-full max-w-md border-border bg-card shadow-lg">
        <CardContent className="flex flex-col items-center text-center py-10 px-6">
          
          {/* Gold Success Icon */}
          <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-accent/10">
            <CheckCircle className="h-14 w-14 text-accent" strokeWidth={1.5} />
          </div>

          {/* Title */}
          <h1 className="text-2xl font-semibold text-foreground mb-2">
            Payment Success
          </h1>

          {/* Description */}
          <p className="text-muted-foreground mb-8 max-w-xs">
            Your payment has been processed successfully. Thank you for using MOMO Fee.
          </p>

          {/* OK Button */}
          <Button
            variant="default"
            size="lg"
            className="w-full max-w-[200px] bg-accent text-accent-foreground hover:bg-accent/90"
            onClick={() => window.location.href = "/dashboard"}
          >
            OK
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
