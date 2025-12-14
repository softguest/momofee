"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function ImportStudentsPage() {
  const [file, setFile] = useState<File | null>(null);
  const [status, setStatus] = useState<string | null>(null);

  async function handleUpload() {
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    setStatus("Uploading...");

    const res = await fetch("/api/admin/students/import", {
      method: "POST",
      body: formData,
    });

    if (res.ok) {
      const data = await res.json();
      setStatus(`Imported ${data.inserted} students.`);
    } else {
      const data = await res.json();
      setStatus(`Error: ${data.error || "Failed to import"}`);
    }
  }

  return (
    <div className="max-w-lg mx-auto py-10">
      <Card>
        <CardHeader>
          <CardTitle>Import Students (CSV)</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-sm">
          <p className="text-muted-foreground">
            Upload a CSV file with the following columns:
          </p>
          <pre className="rounded-md bg-muted p-3 text-xs">
            first_name,last_name,class_name,student_code
          </pre>

          <input
            type="file"
            accept=".csv"
            onChange={(e) => setFile(e.target.files?.[0] || null)}
            className="text-xs"
          />

          <Button className="w-full" onClick={handleUpload} disabled={!file}>
            Upload & Import
          </Button>

          {status && (
            <p className="text-xs text-muted-foreground mt-2">{status}</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
