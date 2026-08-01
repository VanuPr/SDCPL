import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata = {
  title: "STAVYA Design & Construction | Top Builders in Jharkhand",
  description: "Premium architectural, interior design, and turnkey house construction services in Deoghar, Ranchi, Dhanbad, Dumka, and across Jharkhand. Book your consultation today.",
  keywords: "Construction company Deoghar, Interior designer Ranchi, House builders Dhanbad, Civil contractor Dumka, STAVYA Design & Construction, Architects Jharkhand, Turnkey home construction",
  openGraph: {
    title: "STAVYA Design & Construction | Build Your Dream Home",
    description: "Expert turnkey construction and premium interior design across Deoghar, Ranchi, Dhanbad, and Dumka.",
    url: "https://stavyadesignconstruction.com",
    siteName: "STAVYA Design & Construction",
    images: [{ url: "/hero-bg.png", width: 1200, height: 630 }],
    locale: "en_IN",
    type: "website",
  }
};

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CityModal from "@/components/CityModal";
import WhatsAppButton from "@/components/WhatsAppButton";
import { LocationProvider } from "@/context/LocationContext";

export default function RootLayout({ children }) {
  // Schema Markup for AI & Google Search
  const schemaMarkup = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "name": "STAVYA Design & Construction",
    "image": "https://stavyadesignconstruction.com/logo.png",
    "@id": "https://stavyadesignconstruction.com",
    "url": "https://stavyadesignconstruction.com",
    "telephone": "+918825166415",
    "email": "info@stavyadesignconstruction.com",
    "description": "Rated #1 Best Construction Company and Turnkey Builders in Deoghar, Dumka, and Santhal Pargana. Premium architects, interior designers, and civil engineers in Jharkhand.",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "By Pass Road Rampur, Near Jha Thakur Fuel Pump",
      "addressLocality": "Deoghar",
      "addressRegion": "Jharkhand",
      "postalCode": "814112",
      "addressCountry": "IN"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": 24.4716,
      "longitude": 86.6974
    },
    "openingHoursSpecification": {
      "@type": "OpeningHoursSpecification",
      "dayOfWeek": [
        "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"
      ],
      "opens": "09:00",
      "closes": "18:00"
    },
    "sameAs": [
      "https://www.facebook.com/StavyaDesignConstruction",
      "https://www.instagram.com/StavyaDesignConstruction"
    ]
  };

  return (
    <html lang="en" className={inter.variable}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaMarkup) }}
        />
      </head>
      <body>
        <LocationProvider>
          <Navbar />
          {children}
          <Footer />
          <CityModal />
          <WhatsAppButton />
        </LocationProvider>
      </body>
    </html>
  );
}
