import React, { useRef, useEffect, useState } from 'react';
import { Fish, AlertTriangle, Thermometer, Wind, ArrowRight } from 'lucide-react';
import { useApiQuery, extractList } from '@/hooks/useApiQuery';
import { cn } from '@/lib/utils';

interface OceanFact {
  guid: string;
  title: string;
  description: string;
  icon_name: string;
  category: string;
  display_order: number;
}

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  fish: Fish,
  alert: AlertTriangle,
  thermometer: Thermometer,
  wind: Wind,
  default: Fish,
};

const fallbackFacts = [
  {
    guid: 'f1',
    icon: Fish,
    color: '#00A6D6',
    title: 'Marine Biodiversity',
    description: 'Our oceans are home to over 230,000 known species — and scientists estimate millions more remain undiscovered. These ecosystems form the foundation of life on Earth, providing habitat, food, and resources to billions of people.',
  },
  {
    guid: 'f2',
    icon: AlertTriangle,
    color: '#FF6B35',
    title: 'Ocean Pollution Crisis',
    description: 'Every year, 8 million tons of plastic enter our oceans, harming marine life and entering the food chain. Industrial runoff, agricultural chemicals, and microplastics are devastating coastal ecosystems and threatening biodiversity.',
  },
  {
    guid: 'f3',
    icon: Thermometer,
    color: '#0077BE',
    title: 'Climate Change Impact',
    description: 'Oceans absorb over 90% of excess heat and 25–30% of all CO₂ emissions. Rising temperatures cause coral bleaching, ocean acidification, and rising sea levels — threatening 680 million people living in low-lying coastal zones.',
  },
];

function BeforeAfterSlider() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [sliderPos, setSliderPos] = useState(50);
  const isDragging = useRef(false);

  const handleMove = (clientX: number) => {
    if (!containerRef.current || !isDragging.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const pos = ((clientX - rect.left) / rect.width) * 100;
    setSliderPos(Math.max(5, Math.min(95, pos)));
  };

  useEffect(() => {
    const onMouseUp = () => { isDragging.current = false; };
    const onMouseMove = (e: MouseEvent) => handleMove(e.clientX);
    const onTouchMove = (e: TouchEvent) => { if (e.touches[0]) handleMove(e.touches[0].clientX); };
    window.addEventListener('mouseup', onMouseUp);
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('touchend', onMouseUp);
    window.addEventListener('touchmove', onTouchMove);
    return () => {
      window.removeEventListener('mouseup', onMouseUp);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('touchend', onMouseUp);
      window.removeEventListener('touchmove', onTouchMove);
    };
  }, []);

  return (
    <div className="max-w-3xl mx-auto mt-16">
      <div className="text-center mb-8">
        <h3 className="text-2xl font-bold text-[#1A365D] mb-2" style={{ fontFamily: 'Montserrat, sans-serif' }}>See the Difference We Make</h3>
        <p className="text-[#4A5568] text-base" style={{ fontFamily: 'Open Sans, sans-serif' }}>Drag the slider to compare healthy vs. damaged reef ecosystems</p>
      </div>
      <div
        ref={containerRef}
        className="before-after-container relative rounded-xl overflow-hidden shadow-xl select-none"
        style={{ aspectRatio: '16/9', cursor: 'ew-resize' }}
        onMouseDown={(e) => { e.preventDefault(); isDragging.current = true; handleMove(e.clientX); }}
        onTouchStart={(e) => { isDragging.current = true; if (e.touches[0]) handleMove(e.touches[0].clientX); }}
      >
        {/* After (full width) */}
        <div className="absolute inset-0">
          <img
            src="https://cdn-api.ucode.run/db7377f3-c851-4b16-a28e-04fc8d3c5856/ocean_conservation_alliance_images/7de87240-f634-42f2-a170-a0411491c6ae_img_03.jpg"
            alt="Healthy coral reef"
            className="w-full h-full object-cover"
            draggable={false}
            loading="lazy"
            onError={(e) => {
              e.currentTarget.onerror = null;
              e.currentTarget.style.display = 'none';
              if (e.currentTarget.parentElement) {
                e.currentTarget.parentElement.style.background = 'linear-gradient(135deg,#0077BE,#00A6D6)';
              }
            }}
          />
          <div className="absolute top-4 right-4 bg-[#38A169] text-white text-xs font-bold px-3 py-1.5 rounded" style={{ fontFamily: 'Montserrat, sans-serif' }}>AFTER — Restored</div>
        </div>

        {/* Before (clipped) */}
        <div className="absolute inset-0" style={{ clipPath: `inset(0 ${100 - sliderPos}% 0 0)` }}>
          <img
            src="https://cdn-api.ucode.run/db7377f3-c851-4b16-a28e-04fc8d3c5856/ocean_conservation_alliance_images/fe72bd28-bc70-4d3e-9b59-240f53bc6e8a_img_04.jpg"
            alt="Damaged coral reef"
            className="w-full h-full object-cover grayscale-[60%] contrast-[0.9]"
            draggable={false}
            loading="lazy"
            onError={(e) => {
              e.currentTarget.onerror = null;
              e.currentTarget.style.display = 'none';
              if (e.currentTarget.parentElement) {
                e.currentTarget.parentElement.style.background = 'linear-gradient(135deg,#4A5568,#718096)';
              }
            }}
          />
          <div className="absolute top-4 left-4 bg-[#ED8936] text-white text-xs font-bold px-3 py-1.5 rounded" style={{ fontFamily: 'Montserrat, sans-serif' }}>BEFORE — Damaged</div>
        </div>

        {/* Divider */}
        <div
          className="absolute top-0 bottom-0 w-1 bg-white z-10 shadow-[0_0_10px_rgba(255,255,255,0.5)]"
          style={{ left: `calc(${sliderPos}% - 1px)` }}
        >
          <div className="before-after-handle absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-[#FF6B35] flex items-center justify-center shadow-lg">
            <svg className="w-5 h-5" fill="white" viewBox="0 0 20 20">
              <path d="M7 4l-4 6 4 6M13 4l4 6-4 6" stroke="white" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function AboutOceans() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const { data: factsData } = useApiQuery<unknown>(['ocean-facts'], '/v2/items/ocean_facts');
  const apiFacts = extractList<OceanFact>(factsData);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
          }
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -60px 0px' }
    );
    const el = sectionRef.current;
    if (el) {
      el.querySelectorAll('.section-reveal').forEach((elem) => observer.observe(elem));
      el.querySelectorAll('.stagger-children').forEach((elem) => observer.observe(elem));
    }
    return () => observer.disconnect();
  }, [apiFacts]);

  return (
    <section id="about" className="py-24 bg-[#F8FEFF]" ref={sectionRef}>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16 section-reveal">
          <span
            className="inline-block text-[#FF6B35] font-semibold text-xs tracking-[3px] uppercase mb-3"
            style={{ fontFamily: 'Open Sans, sans-serif' }}
          >
            Why It Matters
          </span>
          <h2
            className="text-4xl md:text-5xl font-black text-[#1A365D] mb-4"
            style={{ fontFamily: 'Montserrat, sans-serif' }}
          >
            Our Oceans Are in Crisis
          </h2>
          <div className="w-16 h-1 bg-[#00A6D6] rounded-full mx-auto mb-5" />
          <p
            className="text-lg text-[#4A5568] max-w-xl mx-auto"
            style={{ fontFamily: 'Open Sans, sans-serif', lineHeight: 1.7 }}
          >
            Understanding the challenges facing our marine ecosystems and why urgent action is needed now
          </p>
        </div>

        {/* Cards from API or fallback */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 stagger-children">
          {apiFacts.length > 0
            ? apiFacts.slice(0, 3).map((fact, i) => {
                const IconComp = iconMap[fact.icon_name ?? 'default'] ?? Fish;
                const colors = ['#00A6D6', '#FF6B35', '#0077BE'];
                return (
                  <div
                    key={fact.guid ?? i}
                    className="bg-white rounded-[12px] p-8 hover:-translate-y-2 hover:shadow-[0_12px_40px_rgba(0,119,190,0.15)] transition-all duration-300 shadow-[0_4px_12px_rgba(0,119,190,0.1)] group cursor-pointer"
                  >
                    <div
                      className="w-16 h-16 rounded-2xl flex items-center justify-center mb-6"
                      style={{ background: `${colors[i % colors.length]}18` }}
                    >
                      <IconComp className="w-8 h-8" style={{ color: colors[i % colors.length] } as React.CSSProperties} />
                    </div>
                    <h3
                      className="text-xl font-bold text-[#1A365D] mb-3"
                      style={{ fontFamily: 'Montserrat, sans-serif' }}
                    >
                      {fact.title ?? '—'}
                    </h3>
                    <p
                      className="text-[#4A5568] text-sm leading-relaxed mb-4"
                      style={{ fontFamily: 'Open Sans, sans-serif', lineHeight: 1.7 }}
                    >
                      {fact.description ?? '—'}
                    </p>
                    <button className="text-[#0077BE] text-sm font-semibold flex items-center gap-1 hover:gap-2 transition-all">
                      Learn More <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                );
              })
            : fallbackFacts.map((fact) => (
                <div
                  key={fact.guid}
                  className="bg-white rounded-[12px] p-8 hover:-translate-y-2 hover:shadow-[0_12px_40px_rgba(0,119,190,0.15)] transition-all duration-300 shadow-[0_4px_12px_rgba(0,119,190,0.1)] group cursor-pointer"
                >
                  <div
                    className="w-16 h-16 rounded-2xl flex items-center justify-center mb-6"
                    style={{ background: `${fact.color}18` }}
                  >
                    <fact.icon className="w-8 h-8" style={{ color: fact.color } as React.CSSProperties} />
                  </div>
                  <h3 className="text-xl font-bold text-[#1A365D] mb-3" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                    {fact.title}
                  </h3>
                  <p className="text-[#4A5568] text-sm leading-relaxed mb-4" style={{ fontFamily: 'Open Sans, sans-serif', lineHeight: 1.7 }}>
                    {fact.description}
                  </p>
                  <button className="text-[#0077BE] text-sm font-semibold flex items-center gap-1 hover:gap-2 transition-all">
                    Learn More <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              ))}
        </div>

        {/* Oxygen production highlight */}
        <div className="mt-6 bg-white rounded-[12px] p-8 shadow-[0_4px_12px_rgba(0,119,190,0.1)] section-reveal">
          <div className="flex flex-col md:flex-row items-center gap-6">
            <div className="w-16 h-16 rounded-2xl flex items-center justify-center flex-shrink-0" style={{ background: '#38A16918' }}>
              <Wind className="w-8 h-8" style={{ color: '#38A169' } as React.CSSProperties} />
            </div>
            <div className="flex-1">
              <h3 className="text-xl font-bold text-[#1A365D] mb-2" style={{ fontFamily: 'Montserrat, sans-serif' }}>Oxygen Production</h3>
              <p className="text-[#4A5568] text-sm leading-relaxed" style={{ fontFamily: 'Open Sans, sans-serif', lineHeight: 1.7 }}>
                Tiny phytoplankton in our oceans produce more than 50% of Earth&apos;s oxygen — more than all the world&apos;s rainforests combined.
                Protecting ocean health is directly linked to the air we breathe. Ocean acidification threatens this critical oxygen supply.
              </p>
            </div>
            <div className="text-center md:text-right flex-shrink-0">
              <div className="text-4xl font-black text-[#38A169]" style={{ fontFamily: 'Montserrat, sans-serif' }}>50%+</div>
              <div className="text-xs text-[#4A5568] mt-1" style={{ fontFamily: 'Open Sans, sans-serif' }}>of Earth&apos;s oxygen</div>
            </div>
          </div>
        </div>

        {/* Before / After Slider */}
        <div className="section-reveal">
          <BeforeAfterSlider />
        </div>
      </div>

      {/* Wave separator */}
      <div className="wave-separator mt-16">
        <svg viewBox="0 0 1440 80" preserveAspectRatio="none">
          <path d="M0,20 C480,80 960,0 1440,40 L1440,80 L0,80 Z" fill="#E8F4F8" fillOpacity="0.8" />
        </svg>
      </div>
    </section>
  );
}
