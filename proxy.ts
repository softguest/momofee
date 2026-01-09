import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { db } from "@/config/db";
import { users, students } from "@/config/schema";
import { eq, and, isNull } from "drizzle-orm";

const isPublicRoute = createRouteMatcher([
  "/",
  "/sign-in(.*)",
  "/sign-up(.*)",
]);

const isStudentRoute = createRouteMatcher([
  "/student(.*)",
]);

export default clerkMiddleware(async (auth, req) => {
  // 🔐 Protect non-public routes
  if (!isPublicRoute(req)) {
    await auth.protect();
  }

  const { userId } =await auth();

  if (!userId) return;

  // 🎓 Only enforce logic on /student/*
  if (!isStudentRoute(req)) {
    return;
  }

  const pathname = req.nextUrl.pathname;

  // Allow access to profile creation page
  if (pathname === "/student/profile") {
    return;
  }

  // Fetch user
  const user = await db.query.users.findFirst({
    where: and(
      eq(users.clerkId, userId),
      isNull(users.deletedAt)
    ),
  });

  if (!user) {
    return NextResponse.redirect(new URL("/sign-in", req.url));
  }

  // Only students are checked here
  if (user.role !== "student") {
    return;
  }

  // Check if student profile exists
  const student = await db.query.students.findFirst({
    where: and(
      eq(students.userId, user.id),
      isNull(students.deletedAt)
    ),
  });

  if (!student) {
    return NextResponse.redirect(
      new URL("/dashboard", req.url)
    );
  }
});

export const config = {
  matcher: [
    // Skip Next.js internals & static files
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|mp4|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
};
