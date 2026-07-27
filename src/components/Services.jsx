import React from 'react';
import styles from './Services.module.css';

export default function Services() {
  const servicesList = [
    {
      title: "House Planning",
      desc: "Optimised floor plans, Vastu-shastra layouts, and government-sanctioned drawings.",
      icon: "📐"
    },
    {
      title: "Architectural Design",
      desc: "Modern and climate-aware façades and 3D elevations that make your home stand out.",
      icon: "🏛️"
    },
    {
      title: "New Construction",
      desc: "End-to-end construction of residential and commercial buildings using verified, high-quality materials.",
      icon: "🏗️"
    },
    {
      title: "Turnkey Construction",
      desc: "Single-point accountability. We take full responsibility from design to the final handover of keys.",
      icon: "🔑"
    },
    {
      title: "Interior Design",
      desc: "Bespoke interiors, modular kitchens, wardrobes, false ceilings, and custom lighting.",
      icon: "🛋️"
    },
    {
      title: "Renovation",
      desc: "Give old homes a new look with structural retrofits and modern interior upgrades.",
      icon: "🔨"
    },
    {
      title: "Commercial Projects",
      desc: "Construction of showrooms, offices, hotels, and retail spaces following strict industry codes.",
      icon: "🏢"
    }
  ];

  return (
    <section className="section" id="services">
      <div className="container">
        <h2 className="section-title text-center">Our Services</h2>
        
        <div className={styles.dashboardBanner}>
          <div className={styles.bannerContent}>
            <h3>Introducing Live Client Dashboard</h3>
            <p>Track your project's progress daily with photos, milestones, and payment updates—all transparently in one place.</p>
          </div>
          <div className={styles.bannerIcon}>📊</div>
        </div>

        <div className={styles.grid}>
          {servicesList.map((service, idx) => (
            <div key={idx} className={styles.card}>
              <div className={styles.icon}>{service.icon}</div>
              <h3 className={styles.title}>{service.title}</h3>
              <p className={styles.desc}>{service.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
