import Hero from '@/components/Hero';
import Packages from '@/components/Packages';
import Projects from '@/components/Projects';
import Testimonials from '@/components/Testimonials';
import Partners from '@/components/Partners';
import Newsletter from '@/components/Newsletter';

export const metadata = {
  title: "STAVYA Design & Construction | #1 Builders in Deoghar & Dumka",
  description: "Ranked as the best construction company in Deoghar, Dumka, and Jharkhand. Get turnkey home construction with zero hidden costs, itemised BOQ, and premium architects.",
  keywords: "Best Construction Company Deoghar, Top Builders Dumka, Interior Designers Ranchi, Architects Jharkhand, Turnkey Contractors Santhal Pargana"
};

export default function Home() {
  return (
    <main>
      <Hero />
      <Packages />
      <Projects />
      <Testimonials />
      <Newsletter />
      <Partners />
    </main>
  );
}
