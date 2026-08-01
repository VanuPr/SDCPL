import React from 'react';
import styles from './Features.module.css';

// SEO Metadata optimized for construction features
export const metadata = {
  title: 'Key Features & Guarantees | STAVYA Design & Construction',
  description: 'Discover the premium features of building with STAVYA: Zero Hidden Costs, 120+ Quality Checks, Itemised BOQ, and On-Time Delivery. Build your dream home with trust in Deoghar, Ranchi, and Dhanbad.',
  keywords: [
    'Construction Features',
    'Itemised BOQ',
    'Zero Hidden Costs Construction',
    'House Building Quality Checks',
    'Best Construction Company Deoghar',
    'Best Interior Designer Ranchi',
    'Turnkey Construction Guarantees'
  ].join(', '),
  openGraph: {
    title: 'Key Features & Guarantees | STAVYA',
    description: 'Experience transparency and quality with STAVYA Design & Construction.',
    type: 'website',
  },
};

export default function FeaturesPage() {
  const features = [
    {
      id: 1,
      title: "Zero Hidden Costs",
      desc: "We provide complete financial transparency. The price we quote is the price you pay, with no unexpected surprises during construction.",
      icon: "₹"
    },
    {
      id: 2,
      title: "Itemised BOQ",
      desc: "Our Bill of Quantities is detailed down to the last nail. You will know exactly what materials are being used and their specific costs.",
      icon: "📋"
    },
    {
      id: 3,
      title: "120+ Quality Checks",
      desc: "Our dedicated site engineers perform over 120 rigorous quality checks throughout the build process to ensure structural integrity and flawless finishing.",
      icon: "✅"
    },
    {
      id: 4,
      title: "On-Time Delivery",
      desc: "We respect your time. With strict project management protocols, we guarantee that your dream home will be handed over on the promised date.",
      icon: "⏱️"
    },
    {
      id: 5,
      title: "In-House Architects",
      desc: "Work directly with our team of expert architects and interior designers to customize every inch of your floor plan and aesthetic.",
      icon: "📐"
    },
    {
      id: 6,
      title: "Premium Materials",
      desc: "We exclusively partner with top-tier brands for cement, steel, plumbing, and electricals to ensure your home stands the test of time.",
      icon: "🏗️"
    }
  ];

  return (
    <main className={styles.pageWrapper}>
      <div className="container">
        <div className={styles.header}>
          <h1 className={styles.title}>The STAVYA Advantage</h1>
          <p className={styles.subtitle}>
            We don't just build houses; we engineer dream homes with unparalleled transparency, quality, and precision. Explore the features that make STAVYA the most trusted construction partner in Jharkhand and Bihar.
          </p>
        </div>

        <div className={styles.featuresGrid}>
          {features.map((feature) => (
            <div key={feature.id} className={styles.featureCard}>
              <div className={styles.iconWrapper}>
                {feature.icon}
              </div>
              <h2 className={styles.featureTitle}>{feature.title}</h2>
              <p className={styles.featureDesc}>{feature.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
