"use client";

import { createStudentWithUser } from "@/actions/createStudentWithUser";
import { useTransition } from "react";

interface ClassRow {
  id: string;
  name: string;
  description: string | null;
  createdAt: Date | null;
}

interface NewStudentFormProps {
  classes: ClassRow[];
}

export default function NewStudentForm({ classes }: NewStudentFormProps) {
  const [isPending, startTransition] = useTransition();

  function handleSubmit(e: any) {
    e.preventDefault();

    const form = e.target;

    startTransition(async () => {
      await createStudentWithUser({
        clerkId: crypto.randomUUID(),
        name: form.name.value,
        email: form.email.value,
        phone: form.phone.value,
        firstName: form.firstName.value,
        lastName: form.lastName.value,
        classId: form.classId.value,
        adminId: "ADMIN-ID-HERE",
      });
    });
  }

  return (
    <div className="flex justify-center w-full p-4  rounded-md">
      <form onSubmit={handleSubmit}>
        <div className="space-y-4 mb-4">
          <div>
              <input name="name" placeholder="Full Name" />
          </div>
          <div>
              <input name="email" placeholder="Email" />
          </div>
          <div>
              <input name="phone" placeholder="Phone" />
          </div>
          <div>
              <input name="firstName" placeholder="First Name" />
          </div>
          <div>
              <input name="lastName" placeholder="Last Name" />
          </div>
          <select name="classId">
            {classes.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>
        <button disabled={isPending}>
          {isPending ? "Creating..." : "Create Student"}
        </button>
      </form>
    </div>
  );
}
