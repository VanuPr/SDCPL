import React from 'react';
import styles from './ServicesPage.module.css';

export const metadata = {
  title: "Premium Construction Services | Top Architects & Builders in Deoghar",
  description: "Explore our comprehensive range of services including House Planning, Architectural Design, Turnkey Construction, and Interior Design in Deoghar and Dumka.",
  keywords: "House Planning Deoghar, Architectural Design Jharkhand, Turnkey Construction Dumka, Interior Design Ranchi, Commercial Construction Santhal Pargana, Renovation Contractors"
};

export default function ServicesPage() {
  const services = [
    {
      title: "House Planning",
      subtitle: "Laying the perfect foundation for your dreams",
      desc: "A great house starts with a perfect plan. We provide highly optimised floor plans, Vastu-shastra compliant layouts, and meticulously detailed drawings that are guaranteed to pass government sanctions. Whether you are maximizing a small plot or designing a sprawling estate, our engineers ensure every inch of space is utilized effectively.",
      image: "https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=800&q=80",
      icon: "📐"
    },
    {
      title: "Architectural Design",
      subtitle: "Stunning exteriors that turn heads",
      desc: "Our architectural design service focuses on the aesthetics and structural integrity of your home's exterior. We create modern, classic, and climate-aware façades tailored to Jharkhand's unique weather. With our ultra-realistic 3D elevations, you can see exactly how your dream home will look before a single brick is laid.",
      image: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&q=80",
      icon: "🏛️"
    },
    {
      title: "New Construction",
      subtitle: "Building strong, building right",
      desc: "We execute the end-to-end physical construction of residential and commercial buildings. We pride ourselves on never cutting corners. Our construction process exclusively uses verified, ISI-marked materials (like Tata Steel and UltraTech Cement) and undergoes multi-stage quality audits to ensure your building stands strong for generations.",
      image: "https://images.unsplash.com/photo-1541888086925-eb349cb1f1c7?w=800&q=80",
      icon: "🏗️"
    },
    {
      title: "Turnkey Construction",
      subtitle: "From design to handover, we do it all",
      desc: "This is our flagship service. With Turnkey Construction, you enjoy 'Single-Point Accountability'. You won't have to hire separate contractors, plumbers, or electricians. From finalizing the 3D design to pouring the foundation, completing the interiors, and finally handing over the keys—we take 100% responsibility for the entire project.",
      image: "https://images.unsplash.com/photo-1505843513577-22bb7d21e455?w=800&q=80",
      icon: "🔑"
    },
    {
      title: "Interior Design",
      subtitle: "Beautiful spaces that feel like home",
      desc: "The inside of your home should be as spectacular as the outside. Our interior design service covers bespoke space planning, premium modular kitchens with island setups, custom wardrobes, elegant false ceilings, and smart lighting solutions. We blend aesthetics with functionality to create spaces you'll love living in.",
      image: "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=800&q=80",
      icon: "🛋️"
    },
    {
      title: "Renovation",
      subtitle: "Giving old homes a new lease on life",
      desc: "Transform your existing property with our comprehensive renovation services. Whether you need structural retrofits to strengthen an old building, or a complete interior and exterior modernization, our team can upgrade your space to meet contemporary standards without losing its original charm.",
      image: "https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=800&q=80",
      icon: "🔨"
    },
    {
      title: "Commercial Projects",
      subtitle: "Building the future of business",
      desc: "Beyond residential homes, Stavya Design and Construction excels in commercial developments. We construct modern showrooms, optimized office spaces, luxury hotels, and expansive retail spaces. We strictly adhere to commercial industry codes, fire safety regulations, and accessibility standards.",
      image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&q=80",
      icon: "🏢"
    }
  ];

  return (
    <main>
      {/* Hero Section */}
      <section className={styles.hero}>
        <div className="container">
          <h1 className={styles.heroTitle}>Our Comprehensive Services</h1>
          <p className={styles.heroSubtitle}>
            Expertise across every stage of construction, from the first blueprint to the final handover.
          </p>
        </div>
      </section>

      {/* Services List */}
      <div className={styles.servicesContainer}>
        {services.map((service, index) => {
          const isEven = index % 2 === 0;
          
          return (
            <section key={index} className={`${styles.serviceSection} ${isEven ? styles.bgWhite : styles.bgSecondary}`}>
              <div className={`container ${styles.serviceLayout} ${isEven ? styles.rowNormal : styles.rowReverse}`}>
                
                {/* Content Side */}
                <div className={styles.contentSide}>
                  <div className={styles.iconWrapper}>{service.icon}</div>
                  <h2 className={styles.title}>{service.title}</h2>
                  <h4 className={styles.subtitle}>{service.subtitle}</h4>
                  <p className={styles.description}>{service.desc}</p>
                  
                  <a href="https://wa.me/918825166415" target="_blank" rel="noopener noreferrer" className={styles.enquireBtn}>
                    Enquire Now
                  </a>
                </div>

                {/* Image Side */}
                <div className={styles.imageSide}>
                  <div className={styles.imageWrapper}>
                    <img src={service.image} alt={service.title} className={styles.image} />
                  </div>
                </div>

              </div>
            </section>
          );
        })}
      </div>

      {/* Final CTA */}
      <section className={styles.ctaSection}>
        <div className="container text-center">
          <h2 style={{color: 'white', marginBottom: '20px'}}>Ready to start your dream project?</h2>
          <p style={{color: 'rgba(255,255,255,0.9)', marginBottom: '30px', fontSize: '18px'}}>
            Contact us today for a free consultation and an itemised BOQ.
          </p>
          <a href="/#contact" className={styles.ctaBtn}>Contact Us</a>
        </div>
      </section>
    </main>
  );
}
