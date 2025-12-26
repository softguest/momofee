import Link from "next/link";
import { FiUser, FiBook, FiCreditCard, FiClock } from "react-icons/fi";

const StudentPage = () => {
  const steps = [
  { link: "/student/classes", label: "Student's Class", icon: FiUser },
  { link: "/student/fees", label: "Fees to Pay", icon: FiCreditCard },
  { link: "/student/installments", label: "Fee Installments", icon: FiBook },
  { link: "/student/payments", label: "Payment History", icon: FiClock },
];

  return (
    <section className="py-8 bg-primary text-white flex items-center rounded-md">
      <div className="px-6">
        <h2 className="text-3xl md:text-4xl font-bold text-center">
          Student Dashboard
        </h2>
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((step, index) => {
            const Icon = step.icon;

            return (
              <Link key={index} href={step.link} className="group">
                <div className="rounded-xl bg-white/10 p-6 text-center transition hover:bg-white/20 cursor-pointer">
                  <div className="bg-primary/70 mb-4 mx-auto flex h-16 w-16 items-center justify-center rounded-full text-accent text-2xl">
                    <Icon size={28} />
                  </div>

                  <p className="font-medium">{step.label}</p>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default StudentPage;
