import { NextResponse } from "next/server";

// TODO: Implement real PDF receipt generation
export async function GET(
  _req: Request,
  { params }: { params: { studentId: string; paymentId: string } },
) {
  const pdfBytes = Buffer.from(
    `Receipt for student ${params.studentId}, payment ${params.paymentId}`,
    "utf-8",
  );

  return new NextResponse(pdfBytes, {
    status: 200,
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="receipt-${params.paymentId}.pdf"`,
    },
  });
}
