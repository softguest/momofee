import { NextRequest, NextResponse } from "next/server";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string; paymentId: string }> }
) {
  const { id: studentId, paymentId } = await params;

  const pdfBytes = Buffer.from(
    `Receipt for student ${studentId}, payment ${paymentId}`,
    "utf-8"
  );

  return new NextResponse(pdfBytes, {
    status: 200,
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="receipt-${paymentId}.pdf"`,
    },
  });
}
