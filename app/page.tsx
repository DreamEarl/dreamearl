import Navbar from "@/components/layout/Navbar";
import Hero from "@/components/home/Hero";
import Footer from "@/components/layout/Footer";

export default function Home() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <Hero />
      <Footer />
    </div>
  );
}
