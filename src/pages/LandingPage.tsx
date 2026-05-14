import React, { useState, useEffect } from 'react';
import { ArrowUp } from 'lucide-react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import Hero from '@/components/sections/Hero';
import AboutOceans from '@/components/sections/AboutOceans';
import ProjectsGallery from '@/components/sections/ProjectsGallery';
import ImpactDashboard from '@/components/sections/ImpactDashboard';
import GetInvolved from '@/components/sections/GetInvolved';
import ContactSection from '@/components/sections/ContactSection';

export default function LandingPage() {
  const [showTop, setShowTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => setShowTop(window.scrollY > 500);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen">
      <Navbar />
      <main>
        <Hero />
        <AboutOceans />
        <ProjectsGallery />
        <ImpactDashboard />
        <GetInvolved />
        <ContactSection />
      </main>
      <Footer />

      {/* Scroll to top */}
      {showTop && (
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="fixed bottom-8 right-8 z-50 w-12 h-12 rounded-full bg-[#0077BE] hover:bg-[#FF6B35] text-white flex items-center justify-center shadow-lg hover:scale-110 transition-all duration-200"
          aria-label="Scroll to top"
        >
          <ArrowUp className="w-5 h-5" />
        </button>
      )}
    </div>
  );
}
