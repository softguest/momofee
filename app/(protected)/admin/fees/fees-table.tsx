"use client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";

interface FeeRow {
  id: string;
  academic_year: string;
  term: string;
  total_amount: string;
  first_name: string;
  last_name: string;
  class_name: string;
}

interface Props {
  fees: FeeRow[];
  currentPage: number;
  totalPages: number;
  currentQuery: string;
  currentClass: string;
  classOptions: string[];
}

export default function FeesTable({
  fees,
  currentPage,
  totalPages,
  currentQuery,
  currentClass,
  classOptions,
}: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();

  function setParam(name: string, value?: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (value) params.set(name, value);
    else params.delete(name);
    if (name !== "page") params.set("page", "1");
    router.push(`/admin/fees?${params.toString()}`);
  }

  function handleSearchChange(value: string) {
    setParam("q", value || undefined);
  }

  function handleClassChange(value: string) {
    setParam("class", value || undefined);
  }

  function goToPage(page: number) {
    setParam("page", String(page));
  }

  return (
    <div className="space-y-4">
      {/* filters */}
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <Input
          placeholder="Search by student, year, term"
          defaultValue={currentQuery}
          className="w-full md:max-w-xs"
          onChange={(e) => handleSearchChange(e.target.value)}
        />

        <select
          className="border border-border rounded-md bg-background px-3 py-2 text-sm"
          value={currentClass}
          onChange={(e) => handleClassChange(e.target.value)}
        >
          <option value="">All Classes</option>
          {classOptions.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </div>

      {/* table */}
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="border-b border-border text-xs text-muted-foreground">
              <th className="py-2 text-left">Student</th>
              <th className="py-2 text-left">Class</th>
              <th className="py-2 text-left">Year</th>
              <th className="py-2 text-left">Term</th>
              <th className="py-2 text-left">Total</th>
              <th className="py-2 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {fees.length === 0 && (
              <tr>
                <td
                  colSpan={6}
                  className="py-6 text-center text-muted-foreground text-xs"
                >
                  No fees found.
                </td>
              </tr>
            )}

            {fees.map((f) => (
              <tr
                key={f.id}
                className="border-b border-border last:border-none"
              >
                <td className="py-2">
                  {f.first_name} {f.last_name}
                </td>
                <td className="py-2">{f.class_name}</td>
                <td className="py-2">{f.academic_year}</td>
                <td className="py-2">{f.term}</td>
                <td className="py-2">
                  {Number(f.total_amount).toLocaleString()} XAF
                </td>
                <td className="py-2 text-right space-x-2">
                  <Button
                    asChild
                    variant="secondary"
                    size="sm"
                  >
                    <Link href={`/admin/fees/${f.id}/edit`}>Edit</Link>
                  </Button>
                  <Button
                    asChild
                    variant="outline"
                    size="sm"
                  >
                    <Link href={`/admin/fees/${f.id}/installments`}>
                      Installments
                    </Link>
                  </Button>
                  <Button
                    asChild
                    variant="default"
                    size="sm"
                  >
                    <Link href={`/admin/fees/${f.id}/delete`}>
                      Delete
                    </Link>
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>
            Page {currentPage} of {totalPages}
          </span>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={currentPage <= 1}
              onClick={() => goToPage(currentPage - 1)}
            >
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              disabled={currentPage >= totalPages}
              onClick={() => goToPage(currentPage + 1)}
            >
              Next
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
