"use client";

import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import WaterLoader from "@/components/loaders/WaterLoader";

type StudentStatus = {
  id: string;
  firstName: string;
  lastName: string;
  studentCode: string;
  status: "PAID" | "UNPAID" | "OVERDUE";
};

type Installment = {
  id: string;
  name: string;
  amount: number;
  dueDate: string | null;
  paidCount: number;
  totalStudents: number;
  students: StudentStatus[];
};

export default function InstallmentsStatusPage({
  feeId,
}: {
  feeId: string;
}) {
  const [installments, setInstallments] = useState<Installment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const res = await fetch(
        `/api/admin/class-fees/${feeId}/installments/status`
      );
      const data = await res.json();
      setInstallments(data);
      setLoading(false);
    }
    load();
  }, [feeId]);

  if (loading) return <WaterLoader label="Loading Analytics..." />;

  return (
    <div className="space-y-6 p-6">
      <h1 className="text-xl font-semibold">
        Installment Payment Status
      </h1>

      {installments.map(inst => (
        <Card key={inst.id} className="p-4 space-y-4">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="font-medium">{inst.name}</h2>
              <p className="text-sm text-muted-foreground">
                Amount: {inst.amount.toLocaleString()} FCFA
              </p>
              {inst.dueDate && (
                <p className="text-sm text-muted-foreground">
                  Due: {new Date(inst.dueDate).toLocaleDateString()}
                </p>
              )}
            </div>

            <Badge variant="warning">
              {inst.paidCount}/{inst.totalStudents} Paid
            </Badge>
          </div>

          <table className="w-full border">
            <thead className="bg-muted">
              <tr>
                <th className="p-2 text-left">Student</th>
                <th className="p-2">Code</th>
                <th className="p-2">Status</th>
              </tr>
            </thead>
            <tbody>
              {inst.students.map(st => (
                <tr key={st.id} className="border-t">
                  <td className="p-2">
                    {st.firstName} {st.lastName}
                  </td>
                  <td className="p-2">{st.studentCode}</td>
                  <td className="p-2">
                    <Badge
                      variant={
                        st.status === "PAID"
                          ? "default"
                          : st.status === "OVERDUE"
                          ? "error"
                          : "outline"
                      }
                    >
                      {st.status}
                    </Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      ))}
    </div>
  );
}
