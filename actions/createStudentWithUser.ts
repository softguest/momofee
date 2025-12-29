"use server";

import { db } from "@/config/db";
import { users, students } from "@/config/schema";
import { randomUUID } from "crypto";

function generateStudentCode() {
  return "STU-" + Math.random().toString(36).substring(2, 8).toUpperCase();
}

export async function createStudentWithUser(formData: {
  clerkId: string;
  name: string;
  email?: string;
  phone?: string;
  firstName: string;
  lastName: string;
  classId: string;
  adminId?: string;
}) {
  const {
    clerkId,
    name,
    email,
    phone,
    firstName,
    lastName,
    classId,
    adminId,
  } = formData;

  return await db.transaction(async (tx) => {
    // 1️⃣ Create user
    const [newUser] = await tx
  .insert(users)
    .values({
      id: clerkId,
      clerkId,
      role: "student",
      userName: name,          // <-- map to userName
      email,
      phone,
    })
    .returning();

    if (!newUser) {
      throw new Error("Failed to create user");
    }

    // 2️⃣ Create student linked to user
   const [newStudent] = await tx
      .insert(students)
      .values({
        userId: newUser.id,  // must match users.id type
        studentCode: generateStudentCode(),
        classId,
        createdByUserId: "",
      })
      .returning();

    if (!newStudent) {
      throw new Error("Failed to create student");
    }

    return {
      user: newUser,
      student: newStudent,
    };
  });
}
