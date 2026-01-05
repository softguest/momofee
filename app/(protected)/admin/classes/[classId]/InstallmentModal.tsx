"use client"
import { Button } from "@/components/ui/button";
import { useState } from "react";

export default function InstallmentModal({
  feeId,
  onClose,
}: {
  feeId: string;
  onClose: () => void;
}) {
  const [form, setForm] = useState({
    name: "",
    amount: "",
    dueDate: "",
  });
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    const res = await fetch(
      `/api/admin/class-fees/${feeId}/installments`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          amount: Number(form.amount),
          dueDate: form.dueDate || null,
        }),
      }
    );

    setLoading(false);

    if (!res.ok) {
      const err = await res.json();
      alert(err.error || "Failed to create installment");
      return;
    }

    onClose();
  }

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-md p-6 space-y-4">
        <h2 className="text-lg font-semibold">Add Installment</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-sm font-medium">Installment Name</label>
            <input
              className="w-full border rounded px-3 py-2"
              placeholder="Installment 1"
              value={form.name}
              onChange={(e) =>
                setForm({ ...form, name: e.target.value })
              }
              required
            />
          </div>

          <div>
            <label className="text-sm font-medium">Amount (XAF)</label>
            <input
              type="number"
              className="w-full border rounded px-3 py-2"
              placeholder="50000"
              value={form.amount}
              onChange={(e) =>
                setForm({ ...form, amount: e.target.value })
              }
              required
            />
          </div>

          <div>
            <label className="text-sm font-medium">Due Date (optional)</label>
            <input
              type="date"
              className="w-full border rounded px-3 py-2"
              value={form.dueDate}
              onChange={(e) =>
                setForm({ ...form, dueDate: e.target.value })
              }
            />
          </div>

          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button disabled={loading}>
              {loading ? "Saving..." : "Create"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
