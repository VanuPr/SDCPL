import Hero from '@/components/Hero';
import Packages from '@/components/Packages';
import Projects from '@/components/Projects';
import Testimonials from '@/components/Testimonials';
import Partners from '@/components/Partners';
import Newsletter from '@/components/Newsletter';

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
