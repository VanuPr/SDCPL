import React from 'react';
import styles from './Testimonials.module.css';

export default function Testimonials() {
  const testimonials = [
    {
      id: 1,
      name: "Neelam & Ratan Okhandiar",
      year: "2024",
      crn: "CRN211861",
      image: "/testimonial1.png",
      quote: `"After a lifetime of service, we needed someone we could rely on-and we found it with STAVYA."`,
      rating: 4.5
    },
    {
      id: 2,
      name: "Rajasri Suresh",
      year: "2025",
      crn: "CRN299808",
      image: "/testimonial2.png",
      quote: `"Ajay and Rajasri's Dream Home"`,
      rating: 5
    },
    {
      id: 3,
      name: "Gajanan K Hegde",
      year: "2024",
      crn: "CRN162781",
      image: "/testimonial3.png",
      quote: `"We looked at so many apartments, but nothing felt like home."`,
      rating: 5
    }
  ];

  const filters = [
    "✓ All", "Basic Package", "Premium Package", "> 1000 sqft", "3+ BHK", "> 1 floor", "> ₹ 50 lakhs"
  ];

  return (
    <section className="section bg-secondary">
      <div className="container">
        <h2 className="section-title">10,000+ Homeowners. Real Experiences.</h2>
        <p className="section-subtitle">
          Watch real homeowners share their experience from planning to handover
        </p>

        <div className={styles.filtersWrapper}>
          {filters.map((filter, idx) => (
            <button key={idx} className={`${styles.filterBtn} ${idx === 0 ? styles.active : ''}`}>
              {filter}
            </button>
          ))}
        </div>

        <div className={styles.grid}>
          {testimonials.map(item => (
            <div key={item.id} className={styles.card}>
              <div className={styles.videoWrapper}>
                <img src={item.image} alt={item.name} className={styles.thumbnail} />
                <div className={styles.playBtn}>
                  <svg viewBox="0 0 24 24" fill="white" width="24" height="24">
                    <path d="M8 5v14l11-7z"/>
                  </svg>
                </div>
                <div className={styles.badge}>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="white"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/></svg>
                </div>
              </div>
              <div className={styles.content}>
                <div className={styles.headerRow}>
                  <h3 className={styles.name}>{item.name}</h3>
                  <span className={styles.year}>{item.year}</span>
                </div>
                <p className={styles.crn}>{item.crn}</p>
                <div className={styles.stars}>
                  ★★★★★
                </div>
                <p className={styles.quote}>{item.quote}</p>
                <button className={styles.readMore}>Read more ...</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
