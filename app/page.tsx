import Link from "next/link";
import Hero from "@/components/Homepage/Hero";
import Problems from "@/components/Homepage/Problems";
import Solution from "@/components/Homepage/Solution";
import HowItWorks from "@/components/Homepage/HowItWorks";
import Impact from "@/components/Homepage/Impact";
import Beneficiaries from "@/components/Homepage/Beneficiaries";
import Implementation from "@/components/Homepage/Implementation";
import FundingCTA from "@/components/Homepage/FundingCTA";
import Footer from "@/components/Homepage/Footer";
// import Sustainability from "@/components/Homepage/Sustainability";


export default function HomePage() {
  return (
    <main className="bg-white text-primary">
      <Hero />
      <Problems />
      <Solution />
      <HowItWorks />
      <Impact />
      <Beneficiaries />
      <Implementation />
      {/* <Sustainability /> */}
      <FundingCTA />
      <Footer />
    </main>
  );
}
