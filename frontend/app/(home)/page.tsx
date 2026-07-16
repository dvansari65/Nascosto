import { Features } from "@/components/feature";
import { Footer } from "@/components/footer";
import { ForWho } from "@/components/for-who";
import { Hero } from "@/components/hero";
import { HowItWorks } from "@/components/how-it-works";
import { Outcomes } from "@/components/outcomes";


export default function Home() {
  return (
    <main className="min-h-screen bg-white ">
      <Hero />
      <Outcomes />
      <Features />
      <HowItWorks/>
      <ForWho/>
      <Footer/>
    </main>
  );
}
