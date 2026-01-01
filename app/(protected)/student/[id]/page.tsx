import { FiUser, FiBook, FiCreditCard, FiClock } from "react-icons/fi";

async function getStudent(id: string) {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_APP_URL}/api/admin/students/${id}`,
    { cache: "no-store" }
  );

  if (!res.ok) {
    throw new Error("Failed to load student");
  }

  return res.json();
}

export default async function StudentPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const student = await getStudent(id);

  return (
    <section className="max-w-5xl mx-auto px-4 py-12 bg-primary text-white rounded-md">
      <h2 className="text-3xl md:text-4xl font-bold text-center">
        Student Details
      </h2>

      <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">

        {/* STUDENT */}
        <InfoCard
          icon={<FiUser />}
          title="Student"
          value={`${student.firstName} ${student.lastName}`}
          sub={`${student.studentCode}`}
        />

        {/* CLASS */}
        <InfoCard
          icon={<FiBook />}
          title="Class"
          value={student.className}
          sub={student.academicYear}
        />

        {/* USER */}
        <InfoCard
          icon={<FiCreditCard />}
          title="Account"
          value={student.email || "No email"}
          sub={student.role}
        />

        {/* META */}
        <InfoCard
          icon={<FiClock />}
          title="Created"
          value={new Date(student.createdAt).toLocaleDateString()}
        />
      </div>
    </section>
  );
}

/* ---------- Reusable Card ---------- */
function InfoCard({
  icon,
  title,
  value,
  sub,
}: {
  icon: React.ReactNode;
  title: string;
  value: string;
  sub?: string;
}) {
  return (
    <div className="bg-white/10 rounded-lg p-6 flex flex-col gap-2">
      <div className="text-xl">{icon}</div>
      <p className="text-sm opacity-80">{title}</p>
      <p className="font-semibold">{value}</p>
      {sub && <p className="text-xs opacity-70">{sub}</p>}
    </div>
  );
}
