import React from 'react';
import styles from './Packages.module.css';

export default function Packages() {
  const packages = [
    {
      name: "Standard Package",
      price: "₹1,650",
      description: "Basic and durable home construction",
      features: [
        "RCC structure with ISI steel",
        "Vitrified tiles flooring",
        "Standard sanitary fittings",
        "Acrylic distemper paint"
      ],
      isPopular: false
    },
    {
      name: "Gold Package",
      price: "₹1,950",
      description: "Premium finish with branded materials",
      features: [
        "Premium vitrified tiles",
        "Jaquar / Cera branded fittings",
        "Premium emulsion paint",
        "Modular kitchen base included"
      ],
      isPopular: true
    },
    {
      name: "Platinum Package",
      price: "₹2,350",
      description: "Luxury finish with smart features",
      features: [
        "Imported marble / wooden floors",
        "Designer modular kitchen with island",
        "Smart home automation",
        "Designer false ceiling with lighting"
      ],
      isPopular: false
    }
  ];

  return (
    <section className="section bg-secondary" id="packages">
      <div className="container">
        <h2 className="section-title text-center">
          Turnkey Construction Packages
        </h2>
        <p className="text-center" style={{color: 'var(--text-secondary)', marginBottom: '40px'}}>
          Transparent pricing based on square feet area
        </p>
        
        <div className={styles.grid}>
          {packages.map((pkg, idx) => (
            <div key={idx} className={`${styles.card} ${pkg.isPopular ? styles.popular : ''}`}>
              {pkg.isPopular && <div className={styles.badge}>Most Popular</div>}
              <h3 className={styles.name}>{pkg.name}</h3>
              <div className={styles.priceContainer}>
                <span className={styles.price}>{pkg.price}</span>
                <span className={styles.unit}>/ sqft</span>
              </div>
              <p className={styles.desc}>{pkg.description}</p>
              
              <ul className={styles.features}>
                {pkg.features.map((feature, fIdx) => (
                  <li key={fIdx}>
                    <span className={styles.check}>✓</span> {feature}
                  </li>
                ))}
              </ul>
              
              <button className={`btn-primary ${styles.btn}`}>Get Detailed Quote</button>
            </div>
          ))}
        </div>

        <div style={{
          marginTop: '50px',
          padding: '25px',
          background: 'white',
          borderRadius: 'var(--radius-md)',
          boxShadow: 'var(--shadow-sm)',
          borderLeft: '4px solid var(--primary-color)',
          textAlign: 'center'
        }}>
          <h4 style={{ fontSize: '18px', fontWeight: '700', marginBottom: '10px', color: 'var(--text-primary)' }}>
            ✓ Absolute Price Transparency (Itemised BOQ)
          </h4>
          <p style={{ color: 'var(--text-secondary)', margin: 0, fontSize: '15px', lineHeight: '1.6' }}>
            We provide a detailed <strong>Itemised BOQ (Bill of Quantities)</strong> before starting any project. 
            This means there are <strong>no hidden costs</strong>, and billing is strictly done based on work milestones achieved.
          </p>
        </div>
      </div>
    </section>
  );
}
