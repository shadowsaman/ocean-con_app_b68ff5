import React, { useEffect, useRef, useState } from 'react';
import { Mail, Phone, MapPin, Loader2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import apiClient from '@/lib/api';

export default function ContactSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    sender_name: '',
    sender_email: '',
    subject: '',
    message: '',
    message_type: 'general',
  });

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((e) => { if (e.isIntersecting) e.target.classList.add('visible'); }),
      { threshold: 0.1 }
    );
    const el = sectionRef.current;
    if (el) el.querySelectorAll('.section-reveal').forEach((elem) => observer.observe(elem));
    return () => observer.disconnect();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await apiClient.post('/v2/items/contact_messages', {
        ...form,
        is_read: false,
      });
      toast.success('Message sent! We\'ll respond within 24 hours.');
      setForm({ sender_name: '', sender_email: '', subject: '', message: '', message_type: 'general' });
    } catch {
      toast.error('Something went wrong. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const labelStyle: React.CSSProperties = { fontFamily: 'Montserrat, sans-serif', fontWeight: 600, fontSize: '14px', color: '#1A365D' };

  return (
    <section id="contact-form" ref={sectionRef} className="py-20 bg-[#F8FEFF]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12 section-reveal">
          <span className="inline-block text-[#FF6B35] font-semibold text-xs tracking-[3px] uppercase mb-3" style={{ fontFamily: 'Open Sans, sans-serif' }}>Get In Touch</span>
          <h2 className="text-3xl md:text-4xl font-black text-[#1A365D] mb-4" style={{ fontFamily: 'Montserrat, sans-serif' }}>Contact Us</h2>
          <div className="w-16 h-1 bg-[#00A6D6] rounded-full mx-auto" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-8 section-reveal">
          <div className="md:col-span-2 flex flex-col gap-6">
            <div className="bg-white rounded-[12px] p-6 border border-[#E2E8F0] shadow-sm">
              <h3 className="font-bold text-[#1A365D] mb-4" style={{ fontFamily: 'Montserrat, sans-serif' }}>Reach Out Directly</h3>
              <div className="flex flex-col gap-4">
                <div className="flex items-center gap-3 text-[#4A5568] text-sm">
                  <div className="w-9 h-9 rounded-full bg-[#0077BE]/10 flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-4 h-4 text-[#0077BE]" />
                  </div>
                  <span style={{ fontFamily: 'Open Sans, sans-serif' }}>123 Coral Bay Drive, Miami, FL 33101</span>
                </div>
                <div className="flex items-center gap-3 text-[#4A5568] text-sm">
                  <div className="w-9 h-9 rounded-full bg-[#0077BE]/10 flex items-center justify-center flex-shrink-0">
                    <Mail className="w-4 h-4 text-[#0077BE]" />
                  </div>
                  <span style={{ fontFamily: 'Open Sans, sans-serif' }}>hello@oceanconservation.org</span>
                </div>
                <div className="flex items-center gap-3 text-[#4A5568] text-sm">
                  <div className="w-9 h-9 rounded-full bg-[#0077BE]/10 flex items-center justify-center flex-shrink-0">
                    <Phone className="w-4 h-4 text-[#0077BE]" />
                  </div>
                  <span style={{ fontFamily: 'Open Sans, sans-serif' }}>+1 (800) 555-OCEAN</span>
                </div>
              </div>
            </div>

            <div className="bg-[#0077BE] rounded-[12px] p-6 text-white">
              <h4 className="font-bold mb-2" style={{ fontFamily: 'Montserrat, sans-serif' }}>Emergency Ocean Hotline</h4>
              <p className="text-white/80 text-sm mb-3" style={{ fontFamily: 'Open Sans, sans-serif' }}>Report oil spills, marine animal distress, or illegal dumping 24/7</p>
              <div className="text-[#FF6B35] font-black text-lg" style={{ fontFamily: 'Montserrat, sans-serif' }}>1-800-SAVE-SEA</div>
            </div>
          </div>

          <div className="md:col-span-3">
            <form onSubmit={handleSubmit} className="bg-white rounded-[12px] p-8 border border-[#E2E8F0] shadow-sm flex flex-col gap-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label style={labelStyle} className="block mb-2">Your Name</label>
                  <Input
                    type="text"
                    placeholder="Jane Smith"
                    value={form.sender_name}
                    onChange={(e) => setForm({ ...form, sender_name: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <label style={labelStyle} className="block mb-2">Email Address</label>
                  <Input
                    type="email"
                    placeholder="jane@example.com"
                    value={form.sender_email}
                    onChange={(e) => setForm({ ...form, sender_email: e.target.value })}
                    required
                  />
                </div>
              </div>
              <div>
                <label style={labelStyle} className="block mb-2">Subject</label>
                <Input
                  type="text"
                  placeholder="How can we help?"
                  value={form.subject}
                  onChange={(e) => setForm({ ...form, subject: e.target.value })}
                  required
                />
              </div>
              <div>
                <label style={labelStyle} className="block mb-2">Message Type</label>
                <div className="flex flex-wrap gap-2">
                  {['general', 'partnership', 'media', 'volunteer', 'donation'].map((type) => (
                    <button
                      key={type}
                      type="button"
                      onClick={() => setForm({ ...form, message_type: type })}
                      className="px-4 py-2 rounded-full text-xs font-semibold capitalize border transition-all min-h-[36px]"
                      style={{
                        fontFamily: 'Open Sans, sans-serif',
                        background: form.message_type === type ? '#0077BE' : '#F8FEFF',
                        color: form.message_type === type ? 'white' : '#0077BE',
                        borderColor: '#0077BE',
                      }}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label style={labelStyle} className="block mb-2">Message</label>
                <Textarea
                  placeholder="Tell us about your inquiry..."
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  className="min-h-[120px]"
                  required
                />
              </div>
              <button
                type="submit"
                disabled={submitting}
                className="w-full text-white font-bold py-4 rounded-[8px] text-base transition-all duration-200 flex items-center justify-center gap-2 min-h-[52px] hover:-translate-y-0.5 hover:shadow-md"
                style={{ fontFamily: 'Montserrat, sans-serif', background: submitting ? '#4A5568' : '#0077BE' }}
              >
                {submitting ? <><Loader2 className="w-5 h-5 animate-spin" /> Sending...</> : 'Send Message'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
