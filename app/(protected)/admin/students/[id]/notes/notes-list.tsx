"use client";

import { useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

interface Note {
  id: string;
  content: string;
  createdAt: string;
  authorEmail: string | null;
}

export default function NotesList({
  studentId,
  initialNotes,
}: {
  studentId: string;
  initialNotes: Note[];
}) {
  const [notes, setNotes] = useState<Note[]>(initialNotes);
  const [content, setContent] = useState("");
  const [saving, setSaving] = useState(false);

  async function handleAdd() {
    if (!content.trim()) return;
    setSaving(true);

    const res = await fetch(`/api/admin/students/${studentId}/notes`, {
      method: "POST",
      body: JSON.stringify({ content }),
    });

    setSaving(false);

    if (!res.ok) return;

    const data = await res.json();
    setNotes((prev) => [data.note, ...prev]);
    setContent("");
  }

  return (
    <div className="space-y-4 text-sm">
      <div className="space-y-2">
        <Textarea
          placeholder="Add a note for internal use (admins only)..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
          rows={3}
        />
        <Button className="w-full md:w-auto" onClick={handleAdd} disabled={saving}>
          {saving ? "Saving..." : "Add Note"}
        </Button>
      </div>

      <div className="space-y-3">
        {notes.length === 0 && (
          <p className="text-xs text-muted-foreground">No notes yet.</p>
        )}

        {notes.map((n) => (
          <div
            key={n.id}
            className="border-b border-border pb-2 last:border-none"
          >
            <p>{n.content}</p>
            <p className="text-[10px] text-muted-foreground mt-1">
              {n.authorEmail ?? "Unknown"} •{" "}
              {new Date(n.createdAt).toLocaleString()}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
