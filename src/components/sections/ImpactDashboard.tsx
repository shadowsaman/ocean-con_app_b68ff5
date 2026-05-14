import React, { useEffect, useRef, useState } from 'react';
import { Shield, Trash2, Fish, Users, Target, DollarSign } from 'lucide-react';
import { useApiQuery, extractList } from '@/hooks/useApiQuery';

interface ImpactStat {
  guid: string;
  metric_name: string;
  metric_value: number;
  metric_unit: string;
  metric_icon: string;
  description: string;
  display_order: number;
  year: string;
}

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  shield: Shield,
  trash: Trash2,
  fish: Fish,
  users: Users,
  target: Target,
  dollar: DollarSign,
  default: Target,
};

const fallbackStats = [
  { guid: 's1', icon: Shield, value: 2.5, unit: 'M km²', label: 'Ocean Area Protected', suffix: '' },
  { guid: 's2', icon: Trash2, value: 185, unit: 'K tons', label: 'Plastic Removed', suffix: '' },
  { guid: 's3', icon: Fish, value: 1247, unit: '', label: 'Species Protected', suffix: '' },
  { guid: 's4', icon: Users, value: 52, unit: 'K', label: 'Active Volunteers', suffix: '' },
];

function useCountUp(target: number, duration = 2000, start = false) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!start) return;
    const startTime = performance.now();
    const isDecimal = target % 1 !== 0;
    const animate = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = target * eased;
      setCount(isDecimal ? parseFloat(current.toFixed(1)) : Math.round(current));
      if (progress < 1) requestAnimationFrame(animate);
    };
    requestAnimationFrame(animate);
  }, [target, duration, start]);
  return count;
}

function StatCard({ icon: Icon, value, unit, label, description, delay }: {
  icon: React.ComponentType<{ className?: string }>;
  value: number;
  unit: string;
  label: string;
  description?: string;
  delay: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [started, setStarted] = useState(false);
  const count = useCountUp(value, 2200, started);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          setStarted(true);
          observer.disconnect();
        }
      },
      { threshold: 0.3 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className="rounded-xl p-8 text-center hover:bg-white/15 transition-all duration-300 border border-white/15 section-reveal"
      style={{
        background: 'rgba(255,255,255,0.08)',
        backdropFilter: 'blur(8px)',
        animationDelay: `${delay}s`,
      }}
    >
      <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center mx-auto mb-4">
        <Icon className="w-6 h-6 text-white" />
      </div>
      <div className="text-white mb-2">
        <span className="font-black" style={{ fontFamily: 'Montserrat, sans-serif', fontSize: 'clamp(32px, 5vw, 52px)' }}>
          {typeof count === 'number' && count % 1 !== 0 ? count.toFixed(1) : count}
        </span>
        <span className="text-lg ml-1" style={{ fontFamily: 'Open Sans, sans-serif', color: 'rgba(255,255,255,0.75)' }}>{unit}</span>
      </div>
      <p className="text-white text-base" style={{ fontFamily: 'Open Sans, sans-serif', color: 'rgba(255,255,255,0.85)' }}>{label}</p>
      {description && (
        <p className="text-xs mt-2" style={{ fontFamily: 'Open Sans, sans-serif', color: 'rgba(255,255,255,0.55)' }}>{description}</p>
      )}
    </div>
  );
}

function ImpactCalculator() {
  const [donation, setDonation] = useState(50);

  const impacts = [
    { label: 'lbs of ocean plastic removed', value: Math.round(donation * 0.5) },
    { label: 'sq ft of coral reef protected', value: Math.round(donation * 2) },
    { label: 'hours of sea turtle patrol funded', value: Math.round(donation / 25) },
    { label: 'marine species monitored', value: Math.round(donation / 10) },
  ];

  const trackPercent = ((donation - 10) / (10000 - 10)) * 100;

  return (
    <div className="max-w-2xl mx-auto mt-16 bg-white rounded-[16px] p-8 shadow-[0_8px_40px_rgba(0,0,0,0.15)] section-reveal">
      <h3 className="text-2xl font-black text-[#1A365D] mb-2" style={{ fontFamily: 'Montserrat, sans-serif' }}>Calculate Your Impact</h3>
      <p className="text-[#4A5568] text-sm mb-6" style={{ fontFamily: 'Open Sans, sans-serif' }}>See exactly how your contribution makes a difference</p>

      <label className="block">
        <span className="font-bold text-sm text-[#1A365D] block mb-3" style={{ fontFamily: 'Montserrat, sans-serif' }}>Your Donation Amount</span>
        <div className="flex items-center gap-4 mb-4">
          <span className="text-3xl font-black text-[#0077BE]" style={{ fontFamily: 'Montserrat, sans-serif' }}>
            ${donation.toLocaleString()}
          </span>
        </div>
        <div className="relative">
          <div
            className="absolute top-1/2 left-0 h-1.5 rounded-full -translate-y-1/2 pointer-events-none"
            style={{ width: `${trackPercent}%`, background: '#0077BE' }}
          />
          <input
            type="range"
            min={10}
            max={10000}
            step={10}
            value={donation}
            onChange={(e) => setDonation(Number(e.target.value))}
            className="relative w-full"
          />
        </div>
        <div className="flex justify-between text-xs text-[#4A5568] mt-1" style={{ fontFamily: 'Open Sans, sans-serif' }}>
          <span>$10</span><span>$10,000</span>
        </div>
      </label>

      <div className="grid grid-cols-2 gap-3 mt-6">
        {impacts.map((impact) => (
          <div key={impact.label} className="bg-[#F8FEFF] rounded-lg p-4 border border-[#E2E8F0] transition-all duration-300">
            <div className="text-2xl font-black text-[#0077BE] mb-1" style={{ fontFamily: 'Montserrat, sans-serif' }}>
              {impact.value.toLocaleString()}
            </div>
            <div className="text-xs text-[#4A5568]" style={{ fontFamily: 'Open Sans, sans-serif' }}>{impact.label}</div>
          </div>
        ))}
      </div>

      <button
        onClick={() => {
          const el = document.getElementById('get-involved');
          if (el) { const top = el.getBoundingClientRect().top + window.scrollY - 80; window.scrollTo({ top, behavior: 'smooth' }); }
        }}
        className="mt-6 w-full bg-[#FF6B35] hover:bg-[#e55a26] text-white font-bold py-4 rounded-[8px] text-base transition-all duration-200 hover:shadow-[0_4px_20px_rgba(255,107,53,0.4)] hover:-translate-y-0.5"
        style={{ fontFamily: 'Montserrat, sans-serif' }}
      >
        Donate ${donation.toLocaleString()} Now
      </button>
    </div>
  );
}

export default function ImpactDashboard() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const { data: statsData } = useApiQuery<unknown>(['impact-statistics'], '/v2/items/impact_statistics');
  const apiStats = extractList<ImpactStat>(statsData);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((e) => { if (e.isIntersecting) e.target.classList.add('visible'); }),
      { threshold: 0.1, rootMargin: '0px 0px -60px 0px' }
    );
    const el = sectionRef.current;
    if (el) el.querySelectorAll('.section-reveal').forEach((elem) => observer.observe(elem));
    return () => observer.disconnect();
  }, [apiStats]);

  const statsToRender = apiStats.length > 0
    ? apiStats.slice(0, 4).map((s, i) => ({
        guid: s.guid ?? `api-${i}`,
        icon: iconMap[s.metric_icon ?? 'default'] ?? Target,
        value: s.metric_value ?? 0,
        unit: s.metric_unit ?? '',
        label: s.metric_name ?? '—',
        description: s.description ?? '',
      }))
    : fallbackStats.map((s) => ({
        guid: s.guid,
        icon: s.icon,
        value: s.value,
        unit: s.unit,
        label: s.label,
        description: '',
      }));

  return (
    <section
      id="impact"
      ref={sectionRef}
      className="py-24 relative overflow-hidden"
      style={{ background: '#0077BE' }}
    >
      {/* Wave bg pattern */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1440 80'%3E%3Cpath d='M0,40 C360,80 720,0 1080,40 C1260,60 1380,20 1440,40 L1440,80 L0,80 Z' fill='%2300A6D6' fill-opacity='0.12'/%3E%3C/svg%3E")`,
          backgroundSize: '1440px 80px',
          backgroundRepeat: 'repeat-x',
        }}
      />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        {/* Header */}
        <div className="text-center mb-12 section-reveal">
          <span className="inline-block text-[#FF6B35] font-semibold text-xs tracking-[3px] uppercase mb-3" style={{ fontFamily: 'Open Sans, sans-serif' }}>Our Impact</span>
          <h2 className="text-4xl md:text-5xl font-black text-white mb-4" style={{ fontFamily: 'Montserrat, sans-serif' }}>Making Waves of Change</h2>
          <div className="w-16 h-1 bg-[#FF6B35] rounded-full mx-auto mb-5" />
          <p className="text-lg max-w-xl mx-auto" style={{ fontFamily: 'Open Sans, sans-serif', color: 'rgba(255,255,255,0.8)', lineHeight: 1.7 }}>Real numbers, real impact since 2015. Every figure represents lives saved, ecosystems restored, and futures secured.</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {statsToRender.map((stat, i) => (
            <StatCard
              key={stat.guid}
              icon={stat.icon}
              value={stat.value}
              unit={stat.unit}
              label={stat.label}
              description={stat.description}
              delay={i * 0.1}
            />
          ))}
        </div>

        {/* Impact Calculator */}
        <ImpactCalculator />
      </div>

      {/* Wave separator bottom */}
      <div className="wave-separator mt-16">
        <svg viewBox="0 0 1440 80" preserveAspectRatio="none">
          <path d="M0,20 C480,80 960,0 1440,40 L1440,80 L0,80 Z" fill="#F8FEFF" />
        </svg>
      </div>
    </section>
  );
}
