// db/schema.ts
import {
  pgTable,
  text,
  varchar,
  uuid,
  timestamp,
  integer,
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

export const classes = pgTable("classes", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: text("name").notNull().unique(), // e.g. "Form 3A"
  description: text("description"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const students = pgTable("students", {
  id: uuid("id").defaultRandom().primaryKey(),

  userId: uuid("user_id")
    .notNull()
    .references(() => users.id), // student user account

  studentCode: varchar("student_code", { length: 32 }).notNull().unique(),

  classId: uuid("class_id")
    .notNull()
    .references(() => classes.id),
    
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),

  createdByAdminId: uuid("created_by_admin_id"),
  createdAt: timestamp("created_at").defaultNow(),
});


export const parentsStudents = pgTable("parents_students", {
  id: uuid("id").defaultRandom().primaryKey(),
  parentUserId: uuid("parent_user_id").notNull(), // FK -> users.id
  studentId: uuid("student_id").notNull(),        // FK -> students.id
  createdAt: timestamp("created_at").defaultNow(),
});

export const classFees = pgTable("class_fees", {
  id: uuid("id").defaultRandom().primaryKey(),
  classId: uuid("class_id")
    .notNull()
    .references(() => classes.id),
  firstName: varchar("first_name", { length: 50 }),
  lastName: varchar("last_name", { length: 50 }),
  academicYear: text("academic_year").notNull(),
  term: text("term").notNull(),
  name: text("name").notNull(), // e.g. "Tuition", "PTA", "Exam Fee"
  amount: integer("amount").notNull(),
  description: text("description"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const classFeeInstallments = pgTable("class_fee_installments", {
  id: uuid("id").defaultRandom().primaryKey(),

  classFeeId: uuid("class_fee_id")
    .notNull()
    .references(() => classFees.id),

  name: text("name").notNull(),
  amount: integer("amount").notNull(),
  dueDate: timestamp("due_date"),

  createdAt: timestamp("created_at").defaultNow(),
});

export const payments = pgTable("payments", {
  id: uuid("id").defaultRandom().primaryKey(),

  studentId: uuid("student_id")
    .notNull()
    .references(() => students.id),

  installmentId: uuid("installment_id")
    .notNull()
    .references(() => classFeeInstallments.id),

  amount: integer("amount").notNull(),
  status: text("status").notNull(), // pending | success | failed
  momoTransactionId: text("momo_transaction_id"),

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