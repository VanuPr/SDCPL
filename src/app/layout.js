import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata = {
  title: "STAVYA | Construct Your Dream Home",
  description: "Take a closer look at STAVYA Design & Construction offerings.",
};

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CityModal from "@/components/CityModal";
import { LocationProvider } from "@/context/LocationContext";

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={inter.variable}>
      <body>
        <LocationProvider>
          <Navbar />
          {children}
          <Footer />
          <CityModal />
        </LocationProvider>
      </body>
    </html>
  );
}
