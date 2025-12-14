// db/schema.ts
import {
  pgTable,
  text,
  varchar,
  uuid,
  timestamp,
  integer,
  boolean,
  numeric,
} from "drizzle-orm/pg-core";

export const users = pgTable("users", {
  id: uuid("id").defaultRandom().primaryKey(),
  clerkId: text("clerk_id").notNull().unique(), // map to Clerk user id
  role: varchar("role", { length: 20 }).notNull(), // "parent" | "student" | "admin"
  name: varchar({ length: 256 }).notNull(),
  email: text("email"),
  phone: text("phone"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const students = pgTable("students", {
  id: uuid("id").defaultRandom().primaryKey(),
  studentCode: varchar("student_code", { length: 32 }).notNull().unique(), // unique code for parent linking
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  className: text("class_name").notNull(), // e.g. "Form 3A"
  createdByAdminId: uuid("created_by_admin_id"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const parentsStudents = pgTable("parents_students", {
  id: uuid("id").defaultRandom().primaryKey(),
  parentUserId: uuid("parent_user_id").notNull(), // FK -> users.id
  studentId: uuid("student_id").notNull(),        // FK -> students.id
  createdAt: timestamp("created_at").defaultNow(),
});

export const fees = pgTable("fees", {
  id: uuid("id").defaultRandom().primaryKey(),
  studentId: uuid("student_id").notNull(),
  academicYear: text("academic_year").notNull(), // "2024/2025"
  term: text("term").notNull(), // "First Term"
  totalAmount: numeric("total_amount", { precision: 12, scale: 2 }).notNull(),
  description: text("description"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const installments = pgTable("installments", {
  id: uuid("id").defaultRandom().primaryKey(),
  feeId: uuid("fee_id").notNull(),
  name: text("name").notNull(), // "First Installment", "Exam Fee" etc.
  amount: numeric("amount", { precision: 12, scale: 2 }).notNull(),
  dueDate: timestamp("due_date"),
  isOverdueLocked: boolean("is_overdue_locked").default(false), // prevent pay after deadline
  createdAt: timestamp("created_at").defaultNow(),
});

export const payments = pgTable("payments", {
  id: uuid("id").defaultRandom().primaryKey(),
  studentId: uuid("student_id").notNull(),
  installmentId: uuid("installment_id"),
  feeId: uuid("fee_id"),
  amount: numeric("amount", { precision: 12, scale: 2 }).notNull(),
  status: varchar("status", { length: 20 }).notNull(), // "pending" | "success" | "failed"
  momoTransactionId: text("momo_transaction_id"),
  type: varchar("type", { length: 20 }).notNull(), // "full" | "partial" | "installment"
  createdAt: timestamp("created_at").defaultNow(),
});

export const studentNotes = pgTable("student_notes", {
  id: uuid("id").defaultRandom().primaryKey(),
  studentId: uuid("student_id").notNull(), // FK students.id
  authorUserId: uuid("author_user_id").notNull(), // FK users.id (admin)
  content: text("content").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const studentClassHistory = pgTable("student_class_history", {
  id: uuid("id").defaultRandom().primaryKey(),
  studentId: uuid("student_id").notNull(),
  className: text("class_name").notNull(),
  startDate: timestamp("start_date").defaultNow(),
  endDate: timestamp("end_date"),
});