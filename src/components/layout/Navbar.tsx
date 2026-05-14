import React, { useState, useEffect } from 'react';
import { Menu, X, Waves } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const navLinks = [
  { label: 'About', href: '#about' },
  { label: 'Projects', href: '#projects' },
  { label: 'Impact', href: '#impact' },
  { label: 'Get Involved', href: '#get-involved' },
  { label: 'Contact', href: '#contact' },
];

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [progress, setProgress] = useState(0);
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState('');

  useEffect(() => {
    const update = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(docHeight > 0 ? (scrollTop / docHeight) * 100 : 0);
      setScrolled(scrollTop > 80);
    };
    window.addEventListener('scroll', update, { passive: true });
    return () => window.removeEventListener('scroll', update);
  }, []);

  useEffect(() => {
    const sections = navLinks.map((l) => l.href.replace('#', ''));
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActiveSection(entry.target.id);
        });
      },
      { threshold: 0.3, rootMargin: '-80px 0px 0px 0px' }
    );
    sections.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, []);

  const scrollTo = (href: string) => {
    setMenuOpen(false);
    const id = href.replace('#', '');
    const el = document.getElementById(id);
    if (el) {
      const top = el.getBoundingClientRect().top + window.scrollY - 80;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  };

  return (
    <>
      {/* Progress bar */}
      <div
        className="fixed top-0 left-0 h-0.5 z-[60] transition-all duration-100"
        style={{ width: `${progress}%`, background: 'linear-gradient(to right, #0077BE, #FF6B35)' }}
      />

      <header
        className={cn(
          'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
          scrolled
            ? 'bg-[#0077BE] shadow-lg'
            : 'bg-[rgba(0,119,190,0.85)] backdrop-blur-[16px]'
        )}
        style={{ height: '80px' }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center justify-between">
          {/* Logo */}
          <a
            href="#"
            onClick={(e) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
            className="flex items-center gap-2 flex-shrink-0"
          >
            <div className="w-10 h-10 rounded-full bg-green-500/80 flex items-center justify-center">
              <Waves className="w-6 h-6 text-white" />
            </div>
            <span className="font-bold text-white text-base sm:text-lg" style={{ fontFamily: 'Montserrat, sans-serif' }}>
              Ocean Conservation
            </span>
          </a>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <button
                key={link.href}
                onClick={() => scrollTo(link.href)}
                className={cn(
                  'relative text-white/90 hover:text-white transition-colors font-semibold text-[15px] pb-1 min-h-[44px] flex items-center',
                )}
                style={{ fontFamily: 'Open Sans, sans-serif' }}
              >
                {link.label}
                <span
                  className={cn(
                    'absolute bottom-0 left-0 h-[3px] rounded-full bg-[#FF6B35] transition-all duration-300',
                    activeSection === link.href.replace('#', '') ? 'w-full' : 'w-0'
                  )}
                />
              </button>
            ))}
          </nav>

          {/* CTA */}
          <div className="hidden md:flex items-center">
            <button
              onClick={() => scrollTo('#get-involved')}
              className="bg-[#FF6B35] hover:bg-[#e55a26] text-white font-bold text-sm px-6 py-2.5 rounded-[8px] transition-all duration-200 hover:shadow-[0_4px_20px_rgba(255,107,53,0.4)] hover:-translate-y-0.5 min-h-[44px]"
              style={{ fontFamily: 'Montserrat, sans-serif' }}
            >
              Donate Now
            </button>
          </div>

          {/* Hamburger */}
          <button
            className="md:hidden p-2 text-white min-h-[44px] min-w-[44px] flex items-center justify-center"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
          >
            {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Drawer */}
        {menuOpen && (
          <div className="md:hidden absolute top-full left-0 w-full bg-[#0077BE] border-t border-white/10 shadow-xl animate-slide-in-right">
            <div className="flex flex-col p-6 gap-2">
              {navLinks.map((link) => (
                <button
                  key={link.href}
                  onClick={() => scrollTo(link.href)}
                  className="text-white text-lg font-semibold py-3 text-left border-b border-white/10 hover:text-[#FF6B35] transition-colors min-h-[48px]"
                  style={{ fontFamily: 'Open Sans, sans-serif' }}
                >
                  {link.label}
                </button>
              ))}
              <button
                onClick={() => scrollTo('#get-involved')}
                className="mt-4 bg-[#FF6B35] text-white font-bold py-3 px-6 rounded-[8px] hover:bg-[#e55a26] transition-colors min-h-[48px]"
                style={{ fontFamily: 'Montserrat, sans-serif' }}
              >
                Donate Now
              </button>
            </div>
          </div>
        )}
      </header>
    </>
  );
}
