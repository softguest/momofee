"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface Link {
  linkId: string;
  parentId: string;
  email: string | null;
  phone: string | null;
}

export default function GuardianManager({
  studentId,
  initialLinks,
}: {
  studentId: string;
  initialLinks: Link[];
}) {
  const [links, setLinks] = useState<Link[]>(initialLinks);
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleAdd() {
    if (!email.trim()) return;
    setLoading(true);
    setStatus(null);

    const res = await fetch(`/api/admin/students/${studentId}/guardians`, {
      method: "POST",
      body: JSON.stringify({ email }),
    });

    setLoading(false);

    const data = await res.json();
    if (!res.ok) {
      setStatus(data.error || "Failed to add guardian.");
      return;
    }

    setLinks((prev) => [...prev, data.link]);
    setEmail("");
    setStatus("Guardian linked successfully.");
  }

  async function handleRemove(linkId: string) {
    setLoading(true);
    setStatus(null);

    const res = await fetch(`/api/admin/students/${studentId}/guardians`, {
      method: "DELETE",
      body: JSON.stringify({ linkId }),
    });

    setLoading(false);

    const data = await res.json();
    if (!res.ok) {
      setStatus(data.error || "Failed to remove guardian.");
      return;
    }

    setLinks((prev) => prev.filter((l) => l.linkId !== linkId));
  }

  return (
    <div className="space-y-4 text-sm">
      <div className="space-y-2">
        <Input
          placeholder="Parent email to link"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <Button onClick={handleAdd} disabled={loading}>
          {loading ? "Saving..." : "Add Parent"}
        </Button>
        {status && (
          <p className="text-xs text-muted-foreground mt-1">{status}</p>
        )}
      </div>

      <div className="space-y-3">
        {links.length === 0 && (
          <p className="text-xs text-muted-foreground">
            No parents linked to this student.
          </p>
        )}

        {links.map((l) => (
          <div
            key={l.linkId}
            className="flex items-center justify-between border-b border-border pb-2 last:border-none"
          >
            <div>
              <p className="font-medium">{l.email}</p>
              <p className="text-xs text-muted-foreground">{l.phone}</p>
            </div>
            <Button
              variant="default"
              size="sm"
              onClick={() => handleRemove(l.linkId)}
            >
              Remove
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}
