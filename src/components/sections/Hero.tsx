import React, { useEffect, useRef } from 'react';
import { ChevronDown } from 'lucide-react';

export default function Hero() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    interface Bubble { x: number; y: number; r: number; speed: number; opacity: number; }
    const bubbles: Bubble[] = Array.from({ length: 40 }, () => ({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight + window.innerHeight,
      r: Math.random() * 6 + 2,
      speed: Math.random() * 0.8 + 0.3,
      opacity: Math.random() * 0.4 + 0.1,
    }));

    let animId: number;
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      bubbles.forEach((b) => {
        b.y -= b.speed;
        b.x += Math.sin(b.y * 0.01) * 0.4;
        if (b.y < -20) {
          b.y = canvas.height + 20;
          b.x = Math.random() * canvas.width;
        }
        ctx.beginPath();
        ctx.arc(b.x, b.y, b.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255,255,255,${b.opacity})`;
        ctx.fill();
      });
      animId = requestAnimationFrame(animate);
    };
    animate();

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animId);
    };
  }, []);

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      const top = el.getBoundingClientRect().top + window.scrollY - 80;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  };

  return (
    <section className="relative w-full h-screen min-h-[600px] flex items-center justify-center overflow-hidden" style={{ paddingTop: '80px' }}>
      {/* Background image */}
      <div className="absolute inset-0 z-0">
        <img
          src="https://cdn-api.ucode.run/db7377f3-c851-4b16-a28e-04fc8d3c5856/ocean_conservation_alliance_images/e4431559-a576-44a7-a88a-0cf9f59dcbfa_img_00.jpg"
          alt="Underwater ocean with coral reef"
          className="w-full h-full object-cover"
          loading="eager"
          onError={(e) => {
            e.currentTarget.onerror = null;
            e.currentTarget.style.display = 'none';
            if (e.currentTarget.parentElement) {
              e.currentTarget.parentElement.style.background = 'linear-gradient(180deg,#0077BE,#1A365D)';
            }
          }}
        />
        {/* Gradient overlay */}
        <div
          className="absolute inset-0"
          style={{ background: 'linear-gradient(180deg, rgba(0,119,190,0.5) 0%, rgba(26,54,93,0.65) 100%)' }}
        />
      </div>

      {/* Bubble canvas */}
      <canvas ref={canvasRef} className="absolute inset-0 z-[1] pointer-events-none" />

      {/* Content */}
      <div className="relative z-[2] text-center max-w-4xl mx-auto px-4 sm:px-6">
        <div className="opacity-0 animate-fade-up" style={{ animationFillMode: 'forwards', animationDelay: '0.3s' }}>
          <span
            className="inline-block mb-4 text-[#FF6B35] font-semibold text-sm tracking-[3px] uppercase"
            style={{ fontFamily: 'Open Sans, sans-serif' }}
          >
            Est. 2015 · 45 Countries · 52,000+ Volunteers
          </span>
        </div>

        <h1
          className="opacity-0 animate-fade-up text-white font-black leading-tight mb-6"
          style={{
            fontFamily: 'Montserrat, sans-serif',
            fontSize: 'clamp(36px, 6vw, 64px)',
            textShadow: '0 2px 20px rgba(0,0,0,0.3)',
            animationFillMode: 'forwards',
            animationDelay: '0.6s',
          }}
        >
          Protecting Our Oceans,
          <br />
          <span style={{ color: '#FF6B35' }}>Preserving Our Future</span>
        </h1>

        <p
          className="opacity-0 animate-fade-up mb-10 max-w-2xl mx-auto"
          style={{
            fontFamily: 'Open Sans, sans-serif',
            fontSize: 'clamp(16px, 2.5vw, 20px)',
            color: 'rgba(255,255,255,0.9)',
            lineHeight: 1.7,
            animationFillMode: 'forwards',
            animationDelay: '0.9s',
          }}
        >
          Join 52,000+ volunteers worldwide in the fight to restore marine ecosystems, eliminate ocean pollution, and combat the climate crisis threatening our blue planet.
        </p>

        <div
          className="opacity-0 animate-fade-up flex flex-col sm:flex-row gap-4 justify-center items-center"
          style={{ animationFillMode: 'forwards', animationDelay: '1.2s' }}
        >
          <button
            onClick={() => scrollTo('get-involved')}
            className="bg-[#FF6B35] text-white font-bold px-8 py-4 rounded-[8px] text-base hover:bg-[#e55a26] hover:scale-105 hover:shadow-[0_8px_30px_rgba(255,107,53,0.5)] transition-all duration-200 min-h-[52px] min-w-[180px]"
            style={{ fontFamily: 'Montserrat, sans-serif' }}
          >
            Make a Donation
          </button>
          <button
            onClick={() => scrollTo('projects')}
            className="border-2 border-white text-white font-bold px-8 py-4 rounded-[8px] text-base hover:bg-white hover:text-[#0077BE] transition-all duration-200 min-h-[52px] min-w-[180px]"
            style={{ fontFamily: 'Montserrat, sans-serif' }}
          >
            Explore Projects
          </button>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-[2] animate-bounce-y">
        <button
          onClick={() => scrollTo('about')}
          className="text-white/70 hover:text-white transition-colors"
          aria-label="Scroll down"
        >
          <ChevronDown className="w-10 h-10" />
        </button>
      </div>

      {/* Bottom wave */}
      <div className="absolute bottom-0 left-0 right-0 z-[2] wave-separator">
        <svg viewBox="0 0 1440 80" preserveAspectRatio="none" fill="none">
          <path d="M0,40 C360,80 1080,0 1440,40 L1440,80 L0,80 Z" fill="#F8FEFF" />
        </svg>
      </div>
    </section>
  );
}
