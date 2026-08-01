import React from 'react';
import Link from 'next/link';
import { locationsData } from '@/lib/locationsData';
import styles from './Location.module.css';

// Generate static params for all 22 locations at build time
export async function generateStaticParams() {
  return locationsData.map((loc) => ({
    slug: loc.slug,
  }));
}

// Generate dynamic metadata for SEO
export async function generateMetadata({ params }) {
  const resolvedParams = await params;
  const location = locationsData.find((l) => l.slug === resolvedParams.slug);
  
  if (!location) {
    return {
      title: 'Location Not Found | STAVYA Design & Construction',
    };
  }

  return {
    title: `${location.keyword} | STAVYA Design & Construction`,
    description: `Looking for the ${location.keyword.toLowerCase()}? STAVYA provides premium architectural, interior design, and turnkey house construction services in ${location.name}, Jharkhand.`,
    keywords: `${location.keyword}, construction in ${location.name}, interior designer ${location.name}, architects ${location.name}, house construction ${location.name}`,
    openGraph: {
      title: `${location.keyword} | STAVYA`,
      description: `Get a customized home building experience with STAVYA in ${location.name}. Reach out to the top civil contractor today.`,
      url: `https://stavyadesignconstruction.com/locations/${location.slug}`,
      siteName: 'STAVYA Design & Construction',
      images: [
        {
          url: '/hero-bg.png', // Assuming this is your hero image
          width: 1200,
          height: 630,
        },
      ],
      locale: 'en_IN',
      type: 'website',
    },
  };
}

export default async function LocationPage({ params }) {
  const resolvedParams = await params;
  const location = locationsData.find((l) => l.slug === resolvedParams.slug);

  if (!location) {
    return (
      <div className={styles.notFound}>
        <h1>Location Not Found</h1>
        <p>Sorry, we don't have a service page for this location yet.</p>
        <Link href="/" className="btn-primary">Return Home</Link>
      </div>
    );
  }

  const locationSchema = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "name": `STAVYA Design & Construction - ${location.name}`,
    "description": `Ranked #1 ${location.keyword}. The best architects and civil engineers in ${location.name}, Jharkhand.`,
    "address": {
      "@type": "PostalAddress",
      "addressLocality": location.name,
      "addressRegion": "Jharkhand",
      "addressCountry": "IN"
    }
  };

  return (
    <main className={styles.pageBackground}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(locationSchema) }}
      />
      {/* Hero Section */}
      <section className={styles.hero}>
        <div className="container text-center">
          <span className={styles.badge}>Serving {location.name}</span>
          <h1 className={styles.title}>{location.keyword}</h1>
          <p className={styles.subtitle}>
            Are you planning to build or renovate your dream home in {location.name}? 
            STAVYA Design & Construction brings premium architectural, interior design, and 
            turnkey construction services right to your doorstep.
          </p>
          <div className={styles.heroActions}>
            <Link href="/build" className="btn-primary">Calculate Cost Online</Link>
            <Link href="/contact" className="btn-secondary">Contact Us</Link>
          </div>
        </div>
      </section>

      {/* Services in Location */}
      <section className={styles.servicesSection}>
        <div className="container">
          <h2 className="section-title text-center">Our Services in {location.name}</h2>
          <div className={styles.servicesGrid}>
            <div className={styles.serviceCard}>
              <div className={styles.serviceIcon}>🏗️</div>
              <h3>Turnkey Construction</h3>
              <p>From foundation to handover, we manage the entire home building process in {location.name} so you can relax.</p>
            </div>
            <div className={styles.serviceCard}>
              <div className={styles.serviceIcon}>📐</div>
              <h3>Architecture & Planning</h3>
              <p>Custom floor plans and 3D elevations tailored to your specific plot size in {location.name}.</p>
            </div>
            <div className={styles.serviceCard}>
              <div className={styles.serviceIcon}>🛋️</div>
              <h3>Interior Design</h3>
              <p>Modern, aesthetic interior designs crafted specifically for the lifestyle in {location.name}.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className={styles.whyUsSection}>
        <div className="container">
          <div className={styles.whyUsLayout}>
            <div className={styles.whyUsContent}>
              <h2>Why STAVYA is the {location.keyword}</h2>
              <p>Building a home is a lifetime investment. Here is why residents in {location.name} trust STAVYA:</p>
              <ul className={styles.featureList}>
                <li>✅ <strong>Government Approved:</strong> Fully licensed civil engineers and contractors.</li>
                <li>✅ <strong>Transparent Pricing:</strong> No hidden costs. Check our <Link href="/build">Live Calculator</Link>.</li>
                <li>✅ <strong>Top Material Partners:</strong> We use only Tata Steel, UltraTech, and Jaquar.</li>
                <li>✅ <strong>On-Time Delivery:</strong> Strict schedules to ensure your home in {location.name} is ready on time.</li>
              </ul>
            </div>
            <div className={styles.whyUsImage}>
              <img src="/project1.png" alt={`Construction Project in ${location.name}`} className={styles.roundedImage} />
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
