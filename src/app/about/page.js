import React from 'react';
import styles from './About.module.css';
import { Landmark, Mountain, TrainFront, Trees, Waves, Castle, Tractor, Home, Factory, Leaf, Store, CloudSun } from 'lucide-react';

export const metadata = {
  title: "About Stavya Design and Construction | Top Construction Company in Deoghar, Jharkhand",
  description: "Stavya Design and Construction is a government-approved civil engineering firm in Deoghar. We specialize in turnkey construction, architectural design, and interiors across Jharkhand.",
  keywords: [
    "About Stavya Design and Construction",
    "Best Construction Company in Deoghar",
    "Top Builders in Jharkhand",
    "Civil Engineers in Santhal Pargana",
    "Turnkey Home Builders",
    "House Construction Deoghar",
    "Government Approved Contractors"
  ].join(', '),
};

export default function AboutPage() {
  const milestones = [
    { number: "8+", text: "Years Experience" },
    { number: "120+", text: "Homes Built" },
    { number: "20+", text: "Expert Members" }
  ];

  const journey = [
    { year: "2017", title: "The Beginning", desc: "Started as a Planning Consultancy in Deoghar." },
    { year: "2019", title: "Government Approved", desc: "Achieved registration as a Govt-approved civil engineering firm." },
    { year: "2021", title: "Turnkey Solutions", desc: "Launched Turnkey Construction (Standard, Gold, and Platinum packages)." },
    { year: "2023", title: "Service Expansion", desc: "Expanded into interior designing and commercial fitouts." },
    { year: "2026", title: "Digital Transparency", desc: "Launched 'Live Client Dashboard' for daily progress tracking." }
  ];

  const features = [
    { icon: "🏛️", title: "Government Approved", desc: "Registered and approved civil engineering firm." },
    { icon: "📄", title: "Transparent Pricing", desc: "Itemised BOQ with zero hidden costs & milestone billing." },
    { icon: "📱", title: "Live Client Dashboard", desc: "Track daily photos, progress & payments from anywhere." },
    { icon: "✅", title: "Quality Audits", desc: "Multi-stage checks using verified ISI materials." },
    { icon: "🎯", title: "Single-Point Accountability", desc: "We take full responsibility from design to final handover." }
  ];

  const serviceAreas = [
    { name: "Deoghar", icon: <Landmark size={60} strokeWidth={1} /> },
    { name: "Dumka", icon: <Mountain size={60} strokeWidth={1} /> },
    { name: "Jasidih", icon: <TrainFront size={60} strokeWidth={1} /> },
    { name: "Madhupur", icon: <Trees size={60} strokeWidth={1} /> },
    { name: "Sarath", icon: <Waves size={60} strokeWidth={1} /> },
    { name: "Karon", icon: <Castle size={60} strokeWidth={1} /> },
    { name: "Mohanpur", icon: <Tractor size={60} strokeWidth={1} /> },
    { name: "Sarwan", icon: <Home size={60} strokeWidth={1} /> },
    { name: "Devipur", icon: <Factory size={60} strokeWidth={1} /> },
    { name: "Margomunda", icon: <Leaf size={60} strokeWidth={1} /> },
    { name: "Palojori", icon: <Store size={60} strokeWidth={1} /> },
    { name: "Sonaraithari", icon: <CloudSun size={60} strokeWidth={1} /> }
  ];

  return (
    <main>
      {/* Hero Section */}
      <section className={styles.hero}>
        <div className="container">
          <h1 className={styles.heroTitle}>About Stavya Design and Construction</h1>
          <p className={styles.heroSubtitle}>
            Turning ideas into <span className={styles.highlight}>concrete reality</span>.
          </p>
        </div>
      </section>

      {/* Who We Are & Leadership */}
      <section className="section bg-secondary">
        <div className={`container ${styles.overviewGrid}`}>
          <div className={styles.contentBlock}>
            <img 
              src="/about-engineers.png" 
              alt="Engineers at Stavya Design and Construction" 
              style={{ width: '100%', height: '300px', objectFit: 'cover', borderRadius: '12px', marginBottom: '30px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }} 
            />
            <h2 className="section-title">Who We Are</h2>
            <p className={styles.text}>
              Stavya Design and Construction is a Government-approved civil engineering firm headquartered in Deoghar, Jharkhand. We believe that homes are built with dreams, not just brick and stone. With an expert team of 20+ qualified architects, civil engineers, and interior designers, we execute residential and commercial projects across the Santhal Pargana region. Our biggest promise: <strong>"To complete every project on time, with absolute transparency and impeccable craftsmanship."</strong>
            </p>

            <h3 className={styles.subHeading} style={{marginTop: '30px'}}>Our Leadership</h3>
            <p className={styles.text}>
              Incorporated as a registered private limited company (CIN: U45209JH2022PTC019723) in December 2022, we are led by our experienced directors, <strong>Sumit Kumar Pandey</strong> and <strong>Anirudh Kumar</strong>. Being an engineer-led company, our qualified team takes personal responsibility for every drawing, every BOQ, and every site visit.
            </p>
          </div>
          
          <div className={styles.valuesCard}>
            <img 
              src="/about-hero.png" 
              alt="Premium Home Construction by Stavya" 
              style={{ width: '100%', height: '200px', objectFit: 'cover', borderRadius: '8px', marginBottom: '20px' }} 
            />
            <h3 className={styles.valuesTitle}>Our Mission</h3>
            <p className={styles.textSmall}>To provide every Indian family with a home that encompasses premium architectural design, robust engineering, and absolute price transparency.</p>
            
            <h3 className={styles.valuesTitle}>Our Vision</h3>
            <p className={styles.textSmall}>To be Eastern India's most trusted construction brand—known for on-time delivery, premium design, and digital transparency.</p>
            
            <h3 className={styles.valuesTitle}>Core Values</h3>
            <ul className={styles.valuesList}>
              <li><strong>Honesty in Pricing:</strong> No hidden costs.</li>
              <li><strong>Pride in Craft:</strong> Uncompromising quality.</li>
              <li><strong>Respect for Timelines:</strong> On-time handover.</li>
              <li><strong>Care for Every Client:</strong> Tailored attention.</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Stats Row */}
      <section className={styles.statsSection}>
        <div className="container">
          <div className={styles.statsGrid}>
            {milestones.map((stat, idx) => (
              <div key={idx} className={styles.statItem}>
                <h3 className={styles.statNumber}>{stat.number}</h3>
                <p className={styles.statText}>{stat.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Our Journey Timeline */}
      <section className="section">
        <div className="container">
          <h2 className="section-title text-center">Our Journey: Single Site Visit to 120+ Homes</h2>
          <div className={styles.timeline}>
            {journey.map((item, idx) => (
              <div key={idx} className={styles.timelineItem}>
                <div className={styles.timelineDot}></div>
                <div className={styles.timelineYear}>{item.year}</div>
                <div className={styles.timelineContent}>
                  <h4>{item.title}</h4>
                  <p>{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="section bg-secondary">
        <div className="container">
          <h2 className="section-title text-center">Why Choose Stavya?</h2>
          <div className={styles.featuresGrid}>
            {features.map((feature, idx) => (
              <div key={idx} className={styles.featureCard}>
                <div className={styles.featureIcon}>{feature.icon}</div>
                <h4 className={styles.featureTitle}>{feature.title}</h4>
                <p className={styles.featureDesc}>{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Service Areas */}
      <section id="service-areas" className="section">
        <div className="container">
          <h2 className="section-title text-center">Our Service Areas</h2>
          <p className="text-center" style={{maxWidth: '800px', margin: '0 auto 50px auto', fontSize: '18px', color: 'var(--text-secondary)', lineHeight: '1.8'}}>
            Our headquarters is in Deoghar, and our engineers personally visit sites across the entire Santhal Pargana region.
          </p>
          
          <div className={styles.serviceGrid}>
            {serviceAreas.map((area, idx) => (
              <div key={idx} className={styles.serviceCard}>
                <div className={styles.serviceIconContainer}>
                  {area.icon}
                </div>
                <h4 className={styles.serviceName}>{area.name}</h4>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
