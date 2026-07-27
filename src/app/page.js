import Hero from '@/components/Hero';
import Packages from '@/components/Packages';
import Projects from '@/components/Projects';
import Testimonials from '@/components/Testimonials';
import Partners from '@/components/Partners';

export default function Home() {
  return (
    <main>
      <Hero />
      <Packages />
      <Projects />
      <Testimonials />
      <Partners />
    </main>
  );
}
