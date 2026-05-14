import React, { useEffect, useRef, useState } from 'react';
import { DollarSign, Users, Fish, MapPin, Globe, Building, Check, Loader2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import apiClient from '@/lib/api';

const actions = [
  { icon: DollarSign, title: 'Donate', desc: 'Fund conservation missions directly' },
  { icon: Users, title: 'Volunteer', desc: 'Join field operations worldwide' },
  { icon: Fish, title: 'Adopt a Reef', desc: 'Sponsor a coral reef restoration zone' },
  { icon: MapPin, title: 'Beach Cleanup', desc: 'Organize or join local cleanups' },
  { icon: Globe, title: 'Spread the Word', desc: 'Amplify our mission online' },
  { icon: Building, title: 'Corporate Partnership', desc: 'Partner your brand with impact' },
];

const presetAmounts = [25, 50, 100, 250];
const interestOptions = ['Beach Cleanup', 'Coral Restoration', 'Education', 'Research', 'Advocacy'];
const newsletterInterests = ['Marine Life', 'Climate', 'Volunteering', 'Events', 'Research'];

type TabType = 'donate' | 'volunteer' | 'newsletter';

export default function GetInvolved() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [activeTab, setActiveTab] = useState<TabType>('donate');
  const [submitting, setSubmitting] = useState(false);

  // Donate form state
  const [donateAmount, setDonateAmount] = useState(50);
  const [customAmount, setCustomAmount] = useState('');
  const [isCustom, setIsCustom] = useState(false);
  const [isRecurring, setIsRecurring] = useState(false);
  const [donorName, setDonorName] = useState('');
  const [donorEmail, setDonorEmail] = useState('');
  const [donorMessage, setDonorMessage] = useState('');
  const [isAnonymous, setIsAnonymous] = useState(false);

  // Volunteer form state
  const [volName, setVolName] = useState('');
  const [volEmail, setVolEmail] = useState('');
  const [volPhone, setVolPhone] = useState('');
  const [volLocation, setVolLocation] = useState('');
  const [volInterests, setVolInterests] = useState<string[]>([]);
  const [volAvailability, setVolAvailability] = useState('');
  const [volExperience, setVolExperience] = useState('');

  // Newsletter form state
  const [newsEmail, setNewsEmail] = useState('');
  const [newsName, setNewsName] = useState('');
  const [newsInterests, setNewsInterests] = useState<string[]>([]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((e) => { if (e.isIntersecting) e.target.classList.add('visible'); }),
      { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
    );
    const el = sectionRef.current;
    if (el) el.querySelectorAll('.section-reveal').forEach((elem) => observer.observe(elem));
    return () => observer.disconnect();
  }, []);

  const handleDonate = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    const amount = isCustom ? parseFloat(customAmount) : donateAmount;
    if (!amount || amount <= 0) { toast.error('Please enter a valid amount.'); setSubmitting(false); return; }
    try {
      await apiClient.post('/v2/items/donations', {
        donor_name: isAnonymous ? 'Anonymous' : donorName,
        donor_email: donorEmail,
        amount,
        donation_type: isRecurring ? 'monthly' : 'one-time',
        is_recurring: isRecurring,
        message: donorMessage,
        is_anonymous: isAnonymous,
      });
      toast.success(`Thank you for your $${amount} donation! Together we protect our oceans.`);
      setDonorName(''); setDonorEmail(''); setDonorMessage('');
    } catch {
      toast.error('Something went wrong. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleVolunteer = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await apiClient.post('/v2/items/volunteers', {
        full_name: volName,
        email: volEmail,
        phone: volPhone,
        location: volLocation,
        interests: volInterests.join(', '),
        availability: volAvailability,
        experience: volExperience,
        status: 'pending',
      });
      toast.success('Welcome to the team! We\'ll be in touch soon.');
      setVolName(''); setVolEmail(''); setVolPhone(''); setVolLocation('');
      setVolInterests([]); setVolAvailability(''); setVolExperience('');
    } catch {
      toast.error('Something went wrong. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleNewsletter = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await apiClient.post('/v2/items/newsletter_subscribers', {
        email: newsEmail,
        name: newsName,
        interests: newsInterests.join(', '),
        is_active: true,
        source: 'get-involved',
      });
      toast.success('Subscribed! Stay tuned for ocean updates.');
      setNewsEmail(''); setNewsName(''); setNewsInterests([]);
    } catch {
      toast.error('Something went wrong. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const toggleInterest = (item: string) => {
    setVolInterests((prev) =>
      prev.includes(item) ? prev.filter((i) => i !== item) : [...prev, item]
    );
  };

  const toggleNewsInterest = (item: string) => {
    setNewsInterests((prev) =>
      prev.includes(item) ? prev.filter((i) => i !== item) : [...prev, item]
    );
  };

  const labelStyle: React.CSSProperties = { fontFamily: 'Montserrat, sans-serif', fontWeight: 600, fontSize: '14px', color: '#1A365D' };

  return (
    <section id="get-involved" ref={sectionRef} className="py-24 bg-[#F8FEFF]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16 section-reveal">
          <span className="inline-block text-[#FF6B35] font-semibold text-xs tracking-[3px] uppercase mb-3" style={{ fontFamily: 'Open Sans, sans-serif' }}>Take Action</span>
          <h2 className="text-4xl md:text-5xl font-black text-[#1A365D] mb-4" style={{ fontFamily: 'Montserrat, sans-serif' }}>Every Wave Starts With a Single Drop</h2>
          <div className="w-16 h-1 bg-[#00A6D6] rounded-full mx-auto mb-5" />
          <p className="text-lg text-[#4A5568] max-w-xl mx-auto" style={{ fontFamily: 'Open Sans, sans-serif', lineHeight: 1.7 }}>Choose how you want to make a difference for our oceans</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          {/* Left — Action Grid */}
          <div className="section-reveal">
            <h3 className="text-xl font-bold text-[#1A365D] mb-6" style={{ fontFamily: 'Montserrat, sans-serif' }}>Ways to Get Involved</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {actions.map((action) => (
                <button
                  key={action.title}
                  onClick={() => { if (action.title === 'Donate') setActiveTab('donate'); else if (action.title === 'Volunteer') setActiveTab('volunteer'); }}
                  className="group bg-white p-5 rounded-[8px] shadow-sm border border-[#E2E8F0] hover:-translate-y-1 hover:shadow-md transition-all duration-200 text-left min-h-[80px]"
                >
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-lg bg-[#0077BE]/10 flex items-center justify-center flex-shrink-0">
                      <action.icon className="w-5 h-5 text-[#0077BE]" />
                    </div>
                    <div className="flex-1">
                      <div className="font-bold text-[#1A365D] text-sm flex items-center justify-between" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                        {action.title}
                        <span className="text-[#FF6B35] opacity-0 group-hover:opacity-100 transition-opacity text-xs">→</span>
                      </div>
                      <div className="text-[#4A5568] text-xs mt-1" style={{ fontFamily: 'Open Sans, sans-serif' }}>{action.desc}</div>
                    </div>
                  </div>
                </button>
              ))}
            </div>

            {/* Trust indicators */}
            <div className="mt-8 grid grid-cols-3 gap-4">
              {[
                { value: '52K+', label: 'Volunteers' },
                { value: '$4.2M', label: 'Raised' },
                { value: '45', label: 'Countries' },
              ].map((stat) => (
                <div key={stat.label} className="text-center bg-white p-4 rounded-xl border border-[#E2E8F0]">
                  <div className="text-2xl font-black text-[#0077BE]" style={{ fontFamily: 'Montserrat, sans-serif' }}>{stat.value}</div>
                  <div className="text-xs text-[#4A5568] mt-1" style={{ fontFamily: 'Open Sans, sans-serif' }}>{stat.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Right — Form */}
          <div className="bg-white rounded-[16px] shadow-lg border border-[#E2E8F0] overflow-hidden section-reveal">
            {/* Tab switcher */}
            <div className="flex border-b border-[#E2E8F0]">
              {(['donate', 'volunteer', 'newsletter'] as TabType[]).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className="flex-1 py-4 text-sm font-bold capitalize transition-all duration-200 border-b-2 min-h-[52px]"
                  style={{
                    fontFamily: 'Montserrat, sans-serif',
                    borderBottomColor: activeTab === tab ? '#0077BE' : 'transparent',
                    color: activeTab === tab ? '#0077BE' : '#4A5568',
                    background: activeTab === tab ? '#F0F8FF' : 'transparent',
                  }}
                >
                  {tab === 'donate' ? 'Donate' : tab === 'volunteer' ? 'Volunteer' : 'Newsletter'}
                </button>
              ))}
            </div>

            <div className="p-8">
              {/* Donate Tab */}
              {activeTab === 'donate' && (
                <form onSubmit={handleDonate} className="flex flex-col gap-5">
                  <div>
                    <label style={labelStyle} className="block mb-3">Select Amount</label>
                    <div className="grid grid-cols-4 gap-2 mb-3">
                      {presetAmounts.map((amt) => (
                        <button
                          key={amt}
                          type="button"
                          onClick={() => { setDonateAmount(amt); setIsCustom(false); }}
                          className="py-2.5 rounded-lg text-sm font-bold border transition-all duration-200 min-h-[44px]"
                          style={{
                            fontFamily: 'Montserrat, sans-serif',
                            background: !isCustom && donateAmount === amt ? '#0077BE' : '#F8FEFF',
                            color: !isCustom && donateAmount === amt ? 'white' : '#0077BE',
                            borderColor: '#0077BE',
                          }}
                        >
                          ${amt}
                        </button>
                      ))}
                    </div>
                    <button
                      type="button"
                      onClick={() => setIsCustom(true)}
                      className="w-full py-2.5 rounded-lg text-sm font-bold border transition-all duration-200 min-h-[44px]"
                      style={{
                        fontFamily: 'Montserrat, sans-serif',
                        background: isCustom ? '#0077BE' : '#F8FEFF',
                        color: isCustom ? 'white' : '#0077BE',
                        borderColor: '#0077BE',
                      }}
                    >
                      Custom Amount
                    </button>
                    {isCustom && (
                      <Input
                        type="number"
                        placeholder="Enter amount (USD)"
                        value={customAmount}
                        onChange={(e) => setCustomAmount(e.target.value)}
                        className="mt-3"
                        min="1"
                      />
                    )}
                  </div>

                  <div>
                    <label style={labelStyle} className="block mb-2">Donation Type</label>
                    <div className="flex gap-3">
                      {['One-time', 'Monthly'].map((type) => (
                        <button
                          key={type}
                          type="button"
                          onClick={() => setIsRecurring(type === 'Monthly')}
                          className="flex-1 py-2.5 rounded-full text-sm font-bold border transition-all duration-200 min-h-[44px]"
                          style={{
                            fontFamily: 'Montserrat, sans-serif',
                            background: (isRecurring && type === 'Monthly') || (!isRecurring && type === 'One-time') ? '#FF6B35' : '#F8FEFF',
                            color: (isRecurring && type === 'Monthly') || (!isRecurring && type === 'One-time') ? 'white' : '#FF6B35',
                            borderColor: '#FF6B35',
                          }}
                        >
                          {type}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label style={labelStyle} className="block mb-2">Your Name</label>
                    <Input
                      type="text"
                      placeholder="Jane Smith"
                      value={donorName}
                      onChange={(e) => setDonorName(e.target.value)}
                      disabled={isAnonymous}
                    />
                  </div>
                  <div>
                    <label style={labelStyle} className="block mb-2">Email Address</label>
                    <Input
                      type="email"
                      placeholder="jane@example.com"
                      value={donorEmail}
                      onChange={(e) => setDonorEmail(e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <label style={labelStyle} className="block mb-2">Message (Optional)</label>
                    <Textarea
                      placeholder="Share why you care about our oceans..."
                      value={donorMessage}
                      onChange={(e) => setDonorMessage(e.target.value)}
                      className="min-h-[80px]"
                    />
                  </div>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={isAnonymous}
                      onChange={(e) => setIsAnonymous(e.target.checked)}
                      className="w-4 h-4 accent-[#0077BE]"
                    />
                    <span className="text-sm text-[#4A5568]" style={{ fontFamily: 'Open Sans, sans-serif' }}>Make donation anonymous</span>
                  </label>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full bg-[#FF6B35] hover:bg-[#e55a26] text-white font-bold py-4 rounded-[8px] text-base transition-all duration-200 hover:shadow-[0_4px_20px_rgba(255,107,53,0.4)] hover:-translate-y-0.5 flex items-center justify-center gap-2 min-h-[52px]"
                    style={{ fontFamily: 'Montserrat, sans-serif' }}
                  >
                    {submitting ? <><Loader2 className="w-5 h-5 animate-spin" /> Processing...</> : `Donate $${isCustom ? (customAmount || '—') : donateAmount} Now`}
                  </button>
                </form>
              )}

              {/* Volunteer Tab */}
              {activeTab === 'volunteer' && (
                <form onSubmit={handleVolunteer} className="flex flex-col gap-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label style={labelStyle} className="block mb-2">Full Name *</label>
                      <Input type="text" placeholder="Jane Smith" value={volName} onChange={(e) => setVolName(e.target.value)} required />
                    </div>
                    <div>
                      <label style={labelStyle} className="block mb-2">Email *</label>
                      <Input type="email" placeholder="jane@example.com" value={volEmail} onChange={(e) => setVolEmail(e.target.value)} required />
                    </div>
                    <div>
                      <label style={labelStyle} className="block mb-2">Phone</label>
                      <Input type="tel" placeholder="+1 (555) 000-0000" value={volPhone} onChange={(e) => setVolPhone(e.target.value)} />
                    </div>
                    <div>
                      <label style={labelStyle} className="block mb-2">Location</label>
                      <Input type="text" placeholder="City, Country" value={volLocation} onChange={(e) => setVolLocation(e.target.value)} />
                    </div>
                  </div>

                  <div>
                    <label style={labelStyle} className="block mb-3">Interests</label>
                    <div className="flex flex-wrap gap-2">
                      {interestOptions.map((interest) => (
                        <button
                          key={interest}
                          type="button"
                          onClick={() => toggleInterest(interest)}
                          className="px-4 py-2 rounded-full text-xs font-semibold border transition-all duration-200 flex items-center gap-1.5 min-h-[36px]"
                          style={{
                            fontFamily: 'Open Sans, sans-serif',
                            background: volInterests.includes(interest) ? '#0077BE' : '#F8FEFF',
                            color: volInterests.includes(interest) ? 'white' : '#0077BE',
                            borderColor: '#0077BE',
                          }}
                        >
                          {volInterests.includes(interest) && <Check className="w-3 h-3" />}
                          {interest}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label style={labelStyle} className="block mb-2">Availability</label>
                    <div className="grid grid-cols-2 gap-2">
                      {['Weekdays', 'Weekends', 'Flexible', 'Remote Only'].map((avail) => (
                        <button
                          key={avail}
                          type="button"
                          onClick={() => setVolAvailability(avail)}
                          className="py-2.5 rounded-lg text-xs font-semibold border transition-all duration-200 min-h-[40px]"
                          style={{
                            fontFamily: 'Open Sans, sans-serif',
                            background: volAvailability === avail ? '#0077BE' : '#F8FEFF',
                            color: volAvailability === avail ? 'white' : '#0077BE',
                            borderColor: '#0077BE',
                          }}
                        >
                          {avail}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label style={labelStyle} className="block mb-2">Experience Level</label>
                    <div className="flex gap-3">
                      {['Beginner', 'Intermediate', 'Advanced'].map((exp) => (
                        <button
                          key={exp}
                          type="button"
                          onClick={() => setVolExperience(exp)}
                          className="flex-1 py-2.5 rounded-lg text-xs font-semibold border transition-all duration-200 min-h-[40px]"
                          style={{
                            fontFamily: 'Open Sans, sans-serif',
                            background: volExperience === exp ? '#0077BE' : '#F8FEFF',
                            color: volExperience === exp ? 'white' : '#0077BE',
                            borderColor: '#0077BE',
                          }}
                        >
                          {exp}
                        </button>
                      ))}
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full text-white font-bold py-4 rounded-[8px] text-base transition-all duration-200 flex items-center justify-center gap-2 min-h-[52px] hover:-translate-y-0.5"
                    style={{ fontFamily: 'Montserrat, sans-serif', background: submitting ? '#4A5568' : '#0077BE' }}
                  >
                    {submitting ? <><Loader2 className="w-5 h-5 animate-spin" /> Signing Up...</> : 'Sign Up to Volunteer'}
                  </button>
                </form>
              )}

              {/* Newsletter Tab */}
              {activeTab === 'newsletter' && (
                <form onSubmit={handleNewsletter} className="flex flex-col gap-5">
                  <div>
                    <label style={labelStyle} className="block mb-2">Name</label>
                    <Input type="text" placeholder="Your Name" value={newsName} onChange={(e) => setNewsName(e.target.value)} />
                  </div>
                  <div>
                    <label style={labelStyle} className="block mb-2">Email Address *</label>
                    <Input type="email" placeholder="your@email.com" value={newsEmail} onChange={(e) => setNewsEmail(e.target.value)} required />
                  </div>

                  <div>
                    <label style={labelStyle} className="block mb-3">Topics of Interest</label>
                    <div className="flex flex-wrap gap-2">
                      {newsletterInterests.map((interest) => (
                        <button
                          key={interest}
                          type="button"
                          onClick={() => toggleNewsInterest(interest)}
                          className="px-4 py-2 rounded-full text-xs font-semibold border transition-all duration-200 flex items-center gap-1.5 min-h-[36px]"
                          style={{
                            fontFamily: 'Open Sans, sans-serif',
                            background: newsInterests.includes(interest) ? '#0077BE' : '#F8FEFF',
                            color: newsInterests.includes(interest) ? 'white' : '#0077BE',
                            borderColor: '#0077BE',
                          }}
                        >
                          {newsInterests.includes(interest) && <Check className="w-3 h-3" />}
                          {interest}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="bg-[#F8FEFF] rounded-lg p-4 border border-[#E2E8F0]">
                    <p className="text-xs text-[#4A5568]" style={{ fontFamily: 'Open Sans, sans-serif' }}>
                      You can unsubscribe at any time. We send updates on ocean conservation news, project milestones, and volunteer opportunities.
                    </p>
                  </div>

                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full text-white font-bold py-4 rounded-[8px] text-base transition-all duration-200 flex items-center justify-center gap-2 min-h-[52px] hover:-translate-y-0.5"
                    style={{ fontFamily: 'Montserrat, sans-serif', background: submitting ? '#4A5568' : '#38A169' }}
                  >
                    {submitting ? <><Loader2 className="w-5 h-5 animate-spin" /> Subscribing...</> : 'Subscribe to Updates'}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Wave separator */}
      <div className="wave-separator mt-16">
        <svg viewBox="0 0 1440 80" preserveAspectRatio="none">
          <path d="M0,40 C360,0 720,80 1080,30 C1200,10 1380,60 1440,40 L1440,80 L0,80 Z" fill="#1A365D" />
        </svg>
      </div>
    </section>
  );
}
