import React, { useState } from 'react';
import { Waves, Mail, Phone, MapPin, Globe, ExternalLink } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useApiQuery, extractList } from '@/hooks/useApiQuery';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { toast } from 'sonner';
import apiClient from '@/lib/api';

interface TeamMember {
  guid: string;
  name: string;
  title: string;
  photo: string;
  bio: string;
  specialization: string;
  linkedin_url: string;
  display_order: number;
}

function getInitials(name: string): string {
  return (name ?? '').split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase();
}

const thumbPool = [
  'https://cdn-api.ucode.run/db7377f3-c851-4b16-a28e-04fc8d3c5856/ocean_conservation_alliance_images/e4431559-a576-44a7-a88a-0cf9f59dcbfa_img_00.jpg',
  'https://cdn-api.ucode.run/db7377f3-c851-4b16-a28e-04fc8d3c5856/ocean_conservation_alliance_images/1a038dd4-589d-47e9-b6cc-1dc5b604e73d_img_01.jpg',
  'https://cdn-api.ucode.run/db7377f3-c851-4b16-a28e-04fc8d3c5856/ocean_conservation_alliance_images/20c86445-6586-4541-ab9b-b90f3fb73fd7_img_02.jpg',
];

export default function Footer() {
  const [email, setEmail] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const { data: teamData } = useApiQuery<unknown>(['team-members-footer'], '/v2/items/team_members');
  const teamMembers = extractList<TeamMember>(teamData).slice(0, 4);

  const handleNewsletter = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setSubmitting(true);
    try {
      await apiClient.post('/v2/items/newsletter_subscribers', {
        email,
        source: 'footer',
        is_active: true,
      });
      toast.success('You\'re subscribed! Welcome to the current.');
      setEmail('');
    } catch {
      toast.error('Something went wrong. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const scrollTo = (href: string) => {
    const id = href.replace('#', '');
    const el = document.getElementById(id);
    if (el) {
      const top = el.getBoundingClientRect().top + window.scrollY - 80;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  };

  const quickLinks1 = [
    { label: 'About', href: '#about' },
    { label: 'Projects', href: '#projects' },
    { label: 'Impact', href: '#impact' },
    { label: 'Volunteer', href: '#get-involved' },
  ];
  const quickLinks2 = [
    { label: 'Donate', href: '#get-involved' },
    { label: 'Press', href: '#contact' },
    { label: 'Research', href: '#impact' },
    { label: 'Events', href: '#get-involved' },
  ];

  return (
    <footer id="contact" className="bg-[#1A365D] text-white">
      {/* Newsletter Strip */}
      <div className="bg-[#00A6D6] py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <h3 className="text-2xl font-bold text-white" style={{ fontFamily: 'Montserrat, sans-serif' }}>Stay in the Current</h3>
            <p className="text-white/80 text-sm mt-1" style={{ fontFamily: 'Open Sans, sans-serif' }}>Get weekly ocean conservation updates delivered to your inbox.</p>
          </div>
          <form onSubmit={handleNewsletter} className="flex gap-3 w-full md:w-auto">
            <Input
              type="email"
              placeholder="Your email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="bg-white text-foreground w-full md:w-72 h-12"
              required
            />
            <button
              type="submit"
              disabled={submitting}
              className="bg-[#FF6B35] hover:bg-[#e55a26] text-white font-bold px-6 h-12 rounded-[8px] transition-colors whitespace-nowrap min-w-[110px]"
              style={{ fontFamily: 'Montserrat, sans-serif' }}
            >
              {submitting ? 'Subscribing...' : 'Subscribe'}
            </button>
          </form>
        </div>
      </div>

      {/* Team Mini Section */}
      {teamMembers.length > 0 && (
        <div className="border-b border-white/10 py-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h4 className="text-center font-bold text-white text-lg mb-8" style={{ fontFamily: 'Montserrat, sans-serif' }}>Our Team</h4>
            <div className="flex flex-wrap justify-center gap-8">
              {teamMembers.map((member, i) => (
                <div key={member.guid ?? i} className="flex flex-col items-center gap-2 text-center">
                  <Avatar className="w-20 h-20">
                    <AvatarImage
                      src={member.photo ?? thumbPool[i % thumbPool.length]}
                      alt={member.name ?? ''}
                    />
                    <AvatarFallback>{getInitials(member.name ?? '')}</AvatarFallback>
                  </Avatar>
                  <span className="font-semibold text-white text-base" style={{ fontFamily: 'Montserrat, sans-serif' }}>{member.name ?? '—'}</span>
                  <span className="text-white/70 text-sm" style={{ fontFamily: 'Open Sans, sans-serif' }}>{member.title ?? '—'}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Main Footer */}
      <div className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
            {/* Brand */}
            <div className="md:col-span-1">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center">
                  <Waves className="w-6 h-6 text-white" />
                </div>
                <span className="font-bold text-white text-lg" style={{ fontFamily: 'Montserrat, sans-serif' }}>Ocean Conservation Alliance</span>
              </div>
              <p className="text-white/70 text-sm leading-relaxed mb-6" style={{ fontFamily: 'Open Sans, sans-serif' }}>
                Protecting marine ecosystems and building a sustainable future for our oceans since 2015.
              </p>
              <div className="flex flex-col gap-3">
                <div className="flex items-center gap-2 text-white/70 text-sm">
                  <MapPin className="w-4 h-4 flex-shrink-0" />
                  <span>123 Coral Bay Drive, Miami, FL 33101</span>
                </div>
                <div className="flex items-center gap-2 text-white/70 text-sm">
                  <Mail className="w-4 h-4 flex-shrink-0" />
                  <span>hello@oceanconservation.org</span>
                </div>
                <div className="flex items-center gap-2 text-white/70 text-sm">
                  <Phone className="w-4 h-4 flex-shrink-0" />
                  <span>+1 (800) 555-OCEAN</span>
                </div>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h5 className="font-bold text-white mb-4" style={{ fontFamily: 'Montserrat, sans-serif' }}>Quick Links</h5>
              <ul className="flex flex-col gap-2">
                {quickLinks1.map((link) => (
                  <li key={link.href}>
                    <button
                      onClick={() => scrollTo(link.href)}
                      className="text-white/70 hover:text-[#FF6B35] text-sm transition-colors"
                      style={{ fontFamily: 'Open Sans, sans-serif' }}
                    >
                      {link.label}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h5 className="font-bold text-white mb-4" style={{ fontFamily: 'Montserrat, sans-serif' }}>Get Involved</h5>
              <ul className="flex flex-col gap-2">
                {quickLinks2.map((link) => (
                  <li key={link.href}>
                    <button
                      onClick={() => scrollTo(link.href)}
                      className="text-white/70 hover:text-[#FF6B35] text-sm transition-colors"
                      style={{ fontFamily: 'Open Sans, sans-serif' }}
                    >
                      {link.label}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            {/* Social */}
            <div>
              <h5 className="font-bold text-white mb-4" style={{ fontFamily: 'Montserrat, sans-serif' }}>Follow Us</h5>
              <div className="flex gap-3 flex-wrap">
                {[
                  { icon: Globe, label: 'Website' },
                  { icon: Mail, label: 'Email' },
                  { icon: ExternalLink, label: 'LinkedIn' },
                  { icon: ExternalLink, label: 'Twitter' },
                ].map(({ icon: Icon, label }) => (
                  <button
                    key={label}
                    aria-label={label}
                    className="w-10 h-10 rounded-full bg-white/10 hover:bg-[#00A6D6] flex items-center justify-center transition-colors"
                  >
                    <Icon className="w-4 h-4 text-white" />
                  </button>
                ))}
              </div>
              <div className="mt-6 p-4 bg-white/5 rounded-xl">
                <p className="text-white/70 text-xs leading-relaxed" style={{ fontFamily: 'Open Sans, sans-serif' }}>
                  Registered 501(c)(3) nonprofit organization. Your donations are tax-deductible.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/10 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-white/50 text-xs" style={{ fontFamily: 'Open Sans, sans-serif' }}>
            &copy; 2024 Ocean Conservation Alliance. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            {['Privacy Policy', 'Terms of Service', 'Cookie Settings'].map((item) => (
              <button key={item} className="text-white/50 hover:text-white text-xs transition-colors">
                {item}
              </button>
            ))}
          </div>
        </div>
        <div className="flex justify-center mt-4 opacity-30">
          <svg viewBox="0 0 200 30" className="w-48 h-8" fill="none">
            <path d="M0,15 C30,5 50,25 80,15 C110,5 130,25 160,15 C175,10 185,20 200,15" stroke="#00A6D6" strokeWidth="2" fill="none"/>
          </svg>
        </div>
      </div>
    </footer>
  );
}
