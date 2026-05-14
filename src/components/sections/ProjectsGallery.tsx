import React, { useEffect, useRef, useState } from 'react';
import { MapPin, Loader2 } from 'lucide-react';
import { useApiQuery, extractList } from '@/hooks/useApiQuery';

interface ConservationProject {
  guid: string;
  title: string;
  slug_name: string;
  description: string;
  cover_image: string;
  before_image: string;
  after_image: string;
  category: string;
  location: string;
  latitude: string;
  longitude: string;
  status: string;
  funding_goal: number;
  funding_raised: number;
  start_date: string;
  is_featured: boolean;
}

const thumbPool = [
  'https://cdn-api.ucode.run/db7377f3-c851-4b16-a28e-04fc8d3c5856/ocean_conservation_alliance_images/7de87240-f634-42f2-a170-a0411491c6ae_img_03.jpg',
  'https://cdn-api.ucode.run/db7377f3-c851-4b16-a28e-04fc8d3c5856/ocean_conservation_alliance_images/fe72bd28-bc70-4d3e-9b59-240f53bc6e8a_img_04.jpg',
  'https://cdn-api.ucode.run/db7377f3-c851-4b16-a28e-04fc8d3c5856/ocean_conservation_alliance_images/db10744a-920b-4163-8092-f8db115c8e9e_img_05.jpg',
  'https://cdn-api.ucode.run/db7377f3-c851-4b16-a28e-04fc8d3c5856/ocean_conservation_alliance_images/26ec55a6-8982-4e5d-92a4-ef29032c7f00_img_06.jpg',
  'https://cdn-api.ucode.run/db7377f3-c851-4b16-a28e-04fc8d3c5856/ocean_conservation_alliance_images/8f919296-97fc-44eb-a524-b769c8533481_img_07.jpg',
  'https://cdn-api.ucode.run/db7377f3-c851-4b16-a28e-04fc8d3c5856/ocean_conservation_alliance_images/936c760b-9cd4-483a-a368-2fc311e99592_img_08.jpg',
];

const allCategories = ['All', 'Coral Restoration', 'Ocean Pollution', 'Marine Biodiversity', 'Climate Change', 'Ecosystem Restoration'];

function formatDate(dateStr: string): string {
  if (!dateStr) return '—';
  try {
    return new Date(dateStr).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  } catch {
    return dateStr;
  }
}

interface MapPin2 {
  id: string;
  name: string;
  lat: number;
  lng: number;
  status: string;
  percent: number;
}

function ProjectMap({ pins }: { pins: MapPin2[] }) {
  const [activePin, setActivePin] = useState<string | null>(null);

  const toXY = (lat: number, lng: number) => ({
    x: ((lng + 180) / 360) * 100,
    y: ((90 - lat) / 180) * 100,
  });

  return (
    <div className="mt-16">
      <h3 className="text-2xl font-bold text-[#1A365D] text-center mb-8" style={{ fontFamily: 'Montserrat, sans-serif' }}>
        Projects Around the Globe
      </h3>
      <div
        className="relative w-full rounded-2xl overflow-hidden shadow-xl border border-[#E2E8F0]"
        style={{
          background: 'linear-gradient(180deg, #C8E6F7 0%, #90CBE8 40%, #5BA4C9 100%)',
          aspectRatio: '2/1',
        }}
      >
        {/* Simplified world map SVG outlines */}
        <svg
          viewBox="0 0 100 50"
          className="absolute inset-0 w-full h-full"
          preserveAspectRatio="none"
        >
          {/* Rough continent shapes */}
          <path d="M10,15 L14,12 L18,13 L20,17 L18,22 L14,24 L10,22 Z" fill="#D4E9C4" fillOpacity="0.8" stroke="white" strokeWidth="0.2" />
          <path d="M22,8 L38,7 L42,10 L44,16 L42,24 L36,28 L28,26 L22,22 L20,15 Z" fill="#D4E9C4" fillOpacity="0.8" stroke="white" strokeWidth="0.2" />
          <path d="M44,10 L62,8 L68,12 L70,20 L68,30 L60,34 L52,32 L46,26 L44,18 Z" fill="#D4E9C4" fillOpacity="0.8" stroke="white" strokeWidth="0.2" />
          <path d="M70,8 L86,9 L92,14 L90,24 L82,28 L74,26 L68,18 Z" fill="#D4E9C4" fillOpacity="0.8" stroke="white" strokeWidth="0.2" />
          <path d="M28,30 L36,28 L38,34 L34,40 L28,38 L26,34 Z" fill="#D4E9C4" fillOpacity="0.8" stroke="white" strokeWidth="0.2" />
          <path d="M62,32 L68,30 L70,36 L66,42 L60,40 L58,36 Z" fill="#D4E9C4" fillOpacity="0.8" stroke="white" strokeWidth="0.2" />
          <path d="M82,32 L88,34 L86,42 L80,44 L76,38 L78,34 Z" fill="#D4E9C4" fillOpacity="0.8" stroke="white" strokeWidth="0.2" />
        </svg>

        {/* Latitude/longitude grid lines */}
        <svg viewBox="0 0 100 50" className="absolute inset-0 w-full h-full" preserveAspectRatio="none">
          {[10, 20, 30, 40].map((y) => (
            <line key={`h${y}`} x1="0" y1={y} x2="100" y2={y} stroke="rgba(255,255,255,0.15)" strokeWidth="0.2" />
          ))}
          {[20, 40, 60, 80].map((x) => (
            <line key={`v${x}`} x1={x} y1="0" x2={x} y2="50" stroke="rgba(255,255,255,0.15)" strokeWidth="0.2" />
          ))}
        </svg>

        {/* Pins */}
        {pins.map((pin) => {
          const { x, y } = toXY(pin.lat, pin.lng);
          return (
            <div
              key={pin.id}
              className="absolute group cursor-pointer"
              style={{ left: `${x}%`, top: `${y}%`, transform: 'translate(-50%,-50%)' }}
              onClick={() => setActivePin(activePin === pin.id ? null : pin.id)}
            >
              <div className="relative map-pin-pulse">
                <div
                  className="w-4 h-4 rounded-full border-2 border-white shadow-md transition-transform hover:scale-125"
                  style={{ background: pin.status === 'Active' ? '#FF6B35' : '#ED8936' }}
                />
              </div>
              {activePin === pin.id && (
                <div
                  className="absolute z-20 bottom-6 left-1/2 -translate-x-1/2 w-52 bg-white rounded-lg shadow-xl p-3 border border-[#E2E8F0]"
                >
                  <p className="font-bold text-[#1A365D] text-xs" style={{ fontFamily: 'Montserrat, sans-serif' }}>{pin.name}</p>
                  <p className="text-[#4A5568] text-xs mt-1" style={{ fontFamily: 'Open Sans, sans-serif' }}>Status: {pin.status}</p>
                  <div className="mt-2 h-1.5 bg-[#E2E8F0] rounded-full">
                    <div className="h-full bg-[#38A169] rounded-full" style={{ width: `${pin.percent}%` }} />
                  </div>
                  <p className="text-xs text-[#4A5568] mt-1">{pin.percent}% funded</p>
                </div>
              )}
            </div>
          );
        })}
      </div>
      <p className="text-center text-[#4A5568] text-sm mt-3" style={{ fontFamily: 'Open Sans, sans-serif' }}>Click pins to explore project details</p>
    </div>
  );
}

export default function ProjectsGallery() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [activeFilter, setActiveFilter] = useState('All');

  const { data: projectsData, isLoading } = useApiQuery<unknown>(['conservation-projects'], '/v2/items/conservation_projects');
  const projects = extractList<ConservationProject>(projectsData);

  const filtered = activeFilter === 'All'
    ? projects
    : projects.filter((p) => (p.category ?? '').toLowerCase().includes(activeFilter.toLowerCase()));

  const mapPins: MapPin2[] = projects
    .filter((p) => p.latitude && p.longitude)
    .map((p) => ({
      id: p.guid,
      name: p.title ?? '—',
      lat: parseFloat(p.latitude ?? '0'),
      lng: parseFloat(p.longitude ?? '0'),
      status: p.status ?? 'Active',
      percent: p.funding_goal && p.funding_goal > 0
        ? Math.round(((p.funding_raised ?? 0) / p.funding_goal) * 100)
        : 0,
    }));

  const staticMapPins: MapPin2[] = [
    { id: 'sp1', name: 'Great Barrier Reef Restoration', lat: -18.3, lng: 147.7, status: 'Active', percent: 72 },
    { id: 'sp2', name: 'Pacific Plastic Cleanup Initiative', lat: 30.0, lng: -140.0, status: 'Active', percent: 45 },
    { id: 'sp3', name: 'Caribbean Coral Alliance', lat: 15.0, lng: -66.0, status: 'Active', percent: 88 },
    { id: 'sp4', name: 'Mediterranean Sea Turtle Protection', lat: 37.0, lng: 15.0, status: 'Planning', percent: 20 },
    { id: 'sp5', name: 'Maldives Reef Network', lat: 4.2, lng: 73.5, status: 'Active', percent: 61 },
  ];

  const displayPins = mapPins.length > 0 ? mapPins : staticMapPins;

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((e) => { if (e.isIntersecting) e.target.classList.add('visible'); }),
      { threshold: 0.1, rootMargin: '0px 0px -60px 0px' }
    );
    const el = sectionRef.current;
    if (el) {
      el.querySelectorAll('.section-reveal').forEach((elem) => observer.observe(elem));
    }
    return () => observer.disconnect();
  }, [projects]);

  return (
    <section
      id="projects"
      ref={sectionRef}
      style={{ background: 'linear-gradient(180deg, #E8F4F8 0%, #F8FEFF 100%)' }}
      className="py-24"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12 section-reveal">
          <span className="inline-block text-[#FF6B35] font-semibold text-xs tracking-[3px] uppercase mb-3" style={{ fontFamily: 'Open Sans, sans-serif' }}>Our Work</span>
          <h2 className="text-4xl md:text-5xl font-black text-[#1A365D] mb-4" style={{ fontFamily: 'Montserrat, sans-serif' }}>Conservation Projects Around the Globe</h2>
          <div className="w-16 h-1 bg-[#00A6D6] rounded-full mx-auto mb-5" />
          <p className="text-lg text-[#4A5568] max-w-xl mx-auto" style={{ fontFamily: 'Open Sans, sans-serif', lineHeight: 1.7 }}>Active initiatives protecting marine life across 45 countries</p>
        </div>

        {/* Filter Bar */}
        <div className="flex gap-2 justify-start md:justify-center flex-nowrap overflow-x-auto pb-2 mb-10 section-reveal" style={{ scrollbarWidth: 'none' }}>
          {allCategories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveFilter(cat)}
              className="whitespace-nowrap px-5 py-2.5 rounded-full text-sm font-semibold transition-all duration-200 min-h-[40px] flex-shrink-0"
              style={{
                fontFamily: 'Open Sans, sans-serif',
                background: activeFilter === cat ? '#0077BE' : '#F8FEFF',
                color: activeFilter === cat ? 'white' : '#0077BE',
                border: activeFilter === cat ? '1px solid #0077BE' : '1px solid #0077BE',
              }}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Loading */}
        {isLoading && (
          <div className="flex justify-center items-center py-24">
            <Loader2 className="w-10 h-10 text-[#0077BE] animate-spin" />
          </div>
        )}

        {/* Gallery Grid */}
        {!isLoading && filtered.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filtered.map((project, i) => {
              const goal = project.funding_goal ?? 0;
              const raised = project.funding_raised ?? 0;
              const percent = goal > 0 ? Math.round((raised / goal) * 100) : 0;
              const isActive = (project.status ?? '').toLowerCase() === 'active';

              return (
                <div
                  key={project.guid ?? i}
                  className="relative rounded-[8px] overflow-hidden shadow-md hover:shadow-xl hover:scale-[1.03] transition-all duration-300 cursor-pointer group"
                  style={{ aspectRatio: '4/3' }}
                >
                  <img
                    src={project.cover_image ?? thumbPool[i % thumbPool.length]}
                    alt={project.title ?? 'Conservation project'}
                    loading="lazy"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    onError={(e) => {
                      e.currentTarget.onerror = null;
                      e.currentTarget.src = thumbPool[i % thumbPool.length];
                    }}
                  />
                  {/* Gradient overlay */}
                  <div
                    className="absolute inset-0"
                    style={{ background: 'linear-gradient(to bottom, transparent 30%, rgba(26,54,93,0.88) 100%)' }}
                  />

                  {/* Category badge */}
                  <div className="absolute top-3 left-3">
                    <span
                      className="bg-[#FF6B35] text-white text-xs font-bold px-3 py-1 rounded"
                      style={{ fontFamily: 'Montserrat, sans-serif' }}
                    >
                      {project.category ?? '—'}
                    </span>
                  </div>

                  {/* Status badge */}
                  <div className="absolute top-3 right-3">
                    <span
                      className="text-white text-xs font-bold px-3 py-1 rounded"
                      style={{
                        fontFamily: 'Montserrat, sans-serif',
                        background: isActive ? '#38A169' : '#ED8936',
                      }}
                    >
                      {project.status ?? '—'}
                    </span>
                  </div>

                  {/* Bottom info */}
                  <div className="absolute bottom-0 left-0 right-0 p-4">
                    <h3
                      className="text-white text-lg font-semibold mb-1 leading-tight"
                      style={{ fontFamily: 'Playfair Display, serif' }}
                    >
                      {project.title ?? '—'}
                    </h3>
                    {project.location && (
                      <div className="flex items-center gap-1 mb-3">
                        <MapPin className="w-3 h-3 text-white/70" />
                        <span className="text-white/70 text-xs" style={{ fontFamily: 'Open Sans, sans-serif' }}>{project.location}</span>
                      </div>
                    )}
                    {/* Funding progress */}
                    {goal > 0 && (
                      <div>
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-white/70 text-xs" style={{ fontFamily: 'Open Sans, sans-serif' }}>Funding Progress</span>
                          <span className="text-white text-xs font-semibold" style={{ fontFamily: 'Open Sans, sans-serif' }}>{percent}%</span>
                        </div>
                        <div className="h-1.5 rounded-full" style={{ background: 'rgba(255,255,255,0.2)' }}>
                          <div
                            className="h-full bg-[#38A169] rounded-full transition-all duration-500"
                            style={{ width: `${Math.min(100, percent)}%` }}
                          />
                        </div>
                      </div>
                    )}
                    {project.start_date && (
                      <p className="text-white/60 text-xs mt-2" style={{ fontFamily: 'Open Sans, sans-serif' }}>Started: {formatDate(project.start_date)}</p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* No projects fallback */}
        {!isLoading && filtered.length === 0 && (
          <div className="text-center py-20">
            <div className="w-20 h-20 rounded-full bg-[#0077BE]/10 flex items-center justify-center mx-auto mb-4">
              <MapPin className="w-10 h-10 text-[#0077BE]" />
            </div>
            <h3 className="text-xl font-bold text-[#1A365D] mb-2" style={{ fontFamily: 'Montserrat, sans-serif' }}>Projects Loading</h3>
            <p className="text-[#4A5568]" style={{ fontFamily: 'Open Sans, sans-serif' }}>Conservation projects from 45 countries will appear here.</p>
          </div>
        )}

        {/* Map */}
        <div className="section-reveal">
          <ProjectMap pins={displayPins} />
        </div>
      </div>

      {/* Wave separator */}
      <div className="wave-separator mt-16">
        <svg viewBox="0 0 1440 80" preserveAspectRatio="none">
          <path d="M0,60 C360,0 720,80 1080,20 C1200,0 1350,50 1440,30 L1440,80 L0,80 Z" fill="#0077BE" />
        </svg>
      </div>
    </section>
  );
}
