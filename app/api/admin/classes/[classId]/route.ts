// import { NextResponse } from "next/server";
// import { db } from "@/config/db";
// import { classes } from "@/config/schema";
// import { eq, and, isNull } from "drizzle-orm";

// export async function GET(
//   _req: Request,
//   context: { params: Promise<{ classId: string }> }
// ) {
//     const {classId} =await context.params
//   try {
//     const [cls] = await db
//       .select()
//       .from(classes)
//       .where(
//         and(
//           eq(classes.id, classId),
//           isNull(classes.deletedAt)
//         )
//       )
//       .limit(1);

//     if (!cls) {
//       return NextResponse.json(
//         { error: "Class not found" },
//         { status: 404 }
//       );
//     }

//     return NextResponse.json(cls);
//   } catch (err) {
//     console.error(err);
//     return NextResponse.json(
//       { error: "Failed to fetch class" },
//       { status: 500 }
//     );
//   }
// }


import { NextResponse } from "next/server";
import { db } from "@/config/db";
import { classes, classFees, students } from "@/config/schema";
import { eq, and, isNull } from "drizzle-orm";

export async function GET(
  _req: Request,
  context: { params: Promise<{ classId: string }> }
) {
  const { classId } = await context.params;

  try {
    /* ---------------- CLASS ---------------- */
    const [cls] = await db
      .select()
      .from(classes)
      .where(
        and(
          eq(classes.id, classId),
          isNull(classes.deletedAt)
        )
      )
      .limit(1);

    if (!cls) {
      return NextResponse.json(
        { error: "Class not found" },
        { status: 404 }
      );
    }

    /* ---------------- FEES ---------------- */
    const fees = await db
      .select()
      .from(classFees)
      .where(
        and(
          eq(classFees.classId, classId),
          isNull(classFees.deletedAt)
        )
      );

    /* ---------------- STUDENTS ---------------- */
    const classStudents = await db
      .select({
        id: students.id,
        studentCode: students.studentCode,
        firstName: students.firstName,
        lastName: students.lastName,
        gender: students.gender,
        createdAt: students.createdAt,
      })
      .from(students)
      .where(
        and(
          eq(students.classId, classId),
          isNull(students.deletedAt)
        )
      );

    /* ---------------- RESPONSE ---------------- */
    return NextResponse.json({
      class: cls,
      fees,
      students: classStudents,
      stats: {
        totalStudents: classStudents.length,
        totalFees: fees.length,
      },
    });
  } catch (err) {
    console.error("CLASS DETAIL ERROR:", err);
    return NextResponse.json(
      { error: "Failed to fetch class details" },
      { status: 500 }
    );
  }
}
