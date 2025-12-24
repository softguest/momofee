import { NextResponse } from "next/server";
import { db } from "@/config/db";
import { parentsStudents, students, studentFees, classFeeInstallments, payments, users } from "@/config/schema";
import { auth } from "@clerk/nextjs/server";
import { eq } from "drizzle-orm";
import { assertAdmin } from "@/lib/auth";

export async function GET() {
  try {
    const session = await auth();
    const userId = session.userId;
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

        // Fetch user from DB
        const dbUser = await db.query.users.findFirst({
            where: eq(users.id, userId)
        });
        
        if (!dbUser) {
            return NextResponse.json({ error: "User not found" }, { status: 401 });
        }
    
        assertAdmin(dbUser.role); // ✅ check DB role

    // Get children linked to parent
    const childrenLinks = await db.query.parentsStudents.findMany({
      where: eq(parentsStudents.parentUserId, userId),
      with: {
        student: {
          with: {
            fees: {
              with: {
                classFee: true,
                installments: { with: { payments: true } },
                payments: true,
              },
            },
          },
        },
      },
    });

    const children = childrenLinks.map(link => link.student);
    return NextResponse.json({ children });
  } catch (error: any) {
    return NextResponse.json({ error: error.message ?? "Server error" }, { status: 500 });
  }
}
