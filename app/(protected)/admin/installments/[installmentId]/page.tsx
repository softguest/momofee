"use client";

import { useParams } from "next/navigation";
import InstallmentDetails from "./IntsallmentDetails";

export default function InstallmentDetailsPage() {
  const params = useParams<{
    classFeeId: string;
    studentId: string;
  }>();

  return (
    <InstallmentDetails
      classFeeId={params.classFeeId}
      studentId={params.studentId}
    />
  );
}
