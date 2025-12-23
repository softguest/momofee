"use client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";

interface StudentRow {
  id: string;
  firstName: string | null;
  lastName: string | null;
  classId: string | null;
  studentCode: string | null;
}


interface Props {
  students: StudentRow[];
  currentPage: number;
  totalPages: number;
  currentQuery: string;
  currentClass: string;       // ✅ added
  classOptions: string[];     // ✅ added
}

export default function StudentsTable({
  students,
  currentPage,
  totalPages,
  currentQuery,
  currentClass,
  classOptions,
}: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();

  function updateParams(updates: Record<string, string | null>) {
    const params = new URLSearchParams(searchParams.toString());

    Object.entries(updates).forEach(([key, value]) => {
      if (!value) params.delete(key);
      else params.set(key, value);
    });

    params.set("page", "1"); // reset page on filter/search
    router.push(`/admin/students?${params.toString()}`);
  }

  function goToPage(page: number) {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", String(page));
    router.push(`/admin/students?${params.toString()}`);
  }

  return (
    <div className="space-y-4">
      {/* Search & Filter */}
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <Input
          placeholder="Search by name, class, or code"
          defaultValue={currentQuery}
          className="w-full md:max-w-xs"
          onChange={(e) =>
            updateParams({ q: e.target.value || null })
          }
        />

        <Select
          value={currentClass || "all"}
          onValueChange={(value) =>
            updateParams({ class: value === "all" ? null : value })
          }
        >
          <SelectTrigger className="w-full md:w-48">
            <SelectValue placeholder="Filter by class" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Classes</SelectItem>
            {classOptions.map((cls) => (
              <SelectItem key={cls} value={cls}>
                {cls}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Table */}
      <div className="">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="border-b border-border text-xs text-muted-foreground">
              <th className="py-2 text-left">Name</th>
              <th className="py-2 text-left">Class</th>
              <th className="py-2 text-left">Student Code</th>
              <th className="py-2 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {students.length === 0 && (
              <tr>
                <td
                  colSpan={4}
                  className="py-6 text-center text-muted-foreground text-xs"
                >
                  No students found.
                </td>
              </tr>
            )}

            {students.map((s) => (
              <tr
                key={s.id}
                className="border-b border-border last:border-none"
              >
                <td className="py-2">
                  {s.firstName} {s.lastName}
                </td>
                <td className="py-2">{s.classId}</td>
                <td className="py-2">{s.studentCode}</td>
                <td className="py-2 text-right">
                  <Button
                    asChild
                    variant="secondary"
                    size="sm"
                    className="mr-2"
                  >
                    <Link href={`/admin/students/${s.id}/edit`}>
                      Edit
                    </Link>
                  </Button>
                  <Button
                    asChild
                    variant="default"
                    size="sm"
                  >
                    <Link href={`/admin/students/${s.id}/delete`}>
                      Delete
                    </Link>
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
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

