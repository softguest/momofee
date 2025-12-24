// lib/validators/create-class-fee.ts
import { z } from "zod";

export const createClassFeeSchema = z.object({
  name: z.string().min(3),
  academicYear: z.string(),
  term: z.string(),
  totalAmount: z.number().int().positive(),

  paymentType: z.enum(["FULL", "INSTALLMENT"]),

  installments: z
    .array(
      z.object({
        name: z.string(),
        amount: z.number().int().positive(),
        dueDate: z.string().optional(),
      })
    )
    .optional(),
});
