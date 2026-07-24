"use client";

import { useState } from "react";
import { Section } from "@/components/ui/Section";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { ArrowPillButton } from "@/components/ui/ArrowPillButton";
import { Button } from "@/components/ui/Button";
import { site, socialUrls } from "@/content/site";
import { contact } from "@/content/contact";
import { Mail, CheckCircle2, MapPin } from "lucide-react";
import { InstagramIcon, LinkedinIcon, TwitterIcon } from "@/components/ui/icons";

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    brand: "",
    vertical: "UGC Video Creation",
    budget: "Custom Quote",
    timeline: "This month",
    message: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(false);
    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      const res = await fetch("/api/proposals", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to submit proposal inquiry. Please try again.");
      }

      setSubmitted(true);
    } catch (err) {
      setErrorMessage((err as Error).message || "An unexpected error occurred.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-[#eef3fa] text-[#080b12] min-h-screen relative isolate overflow-hidden">
      {/* Background Gaussian glow clouds */}
      <div className="absolute size-96 rounded-full bg-[#2e7bff]/10 blur-3xl -top-20 -left-20 -z-10" />
      <div className="absolute size-96 rounded-full bg-[#1e5fe0]/5 blur-3xl bottom-10 right-10 -z-10" />

      <Section tone="default" spacing="default" className="pt-8 sm:pt-10 lg:pt-12 pb-12 lg:pb-16 bg-transparent">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          {/* Left panel: Info & links */}
          <div className="lg:col-span-5 text-left flex flex-col items-start space-y-6">
            <Badge className="bg-blue text-white border-transparent">
              Inquiries
            </Badge>

            <h1 className="font-heading text-4xl sm:text-5xl font-bold tracking-tight text-[#080b12] leading-tight">
              Let&apos;s create something <br />
              <span className="text-blue">worth remembering.</span>
            </h1>

            <p className="text-xs sm:text-sm text-[#3f4651] max-w-[42ch] leading-relaxed">
              {contact.intro}
            </p>

            <div className="space-y-4 w-full pt-4">
              <a
                href={`mailto:${site.email}`}
                className="flex items-center gap-3.5 p-4 bg-white border border-[#0a0a0a]/10 rounded-lg hover:border-blue/30 transition-all group shadow-xs"
              >
                <div className="size-9 rounded-full bg-[#dce9ff] text-[#155de1] flex items-center justify-center border border-[#2e7bff]/5">
                  <Mail className="size-4.5" />
                </div>
                <div className="text-left">
                  <span className="text-[9px] font-bold text-[#3f4651] uppercase tracking-wider block">Email Directly</span>
                  <span className="text-xs font-semibold text-[#080b12] group-hover:text-blue transition-colors block mt-0.5">{site.email}</span>
                </div>
              </a>

              {/* Instagram accounts */}
              <a
                href={socialUrls.instagramFitness}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3.5 p-4 bg-white border border-[#0a0a0a]/10 rounded-lg hover:border-blue/30 transition-all group shadow-xs"
              >
                <div className="size-9 rounded-full bg-[#dce9ff] text-[#155de1] flex items-center justify-center border border-[#2e7bff]/5">
                  <InstagramIcon className="size-4.5" />
                </div>
                <div className="text-left">
                  <span className="text-[9px] font-bold text-[#3f4651] uppercase tracking-wider block">Fitness Instagram</span>
                  <span className="text-xs font-semibold text-[#080b12] group-hover:text-blue transition-colors block mt-0.5">@meetsofficial</span>
                </div>
              </a>

              <a
                href={socialUrls.instagramFinance}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3.5 p-4 bg-white border border-[#0a0a0a]/10 rounded-lg hover:border-blue/30 transition-all group shadow-xs"
              >
                <div className="size-9 rounded-full bg-[#dce9ff] text-[#155de1] flex items-center justify-center border border-[#2e7bff]/5">
                  <InstagramIcon className="size-4.5" />
                </div>
                <div className="text-left">
                  <span className="text-[9px] font-bold text-[#3f4651] uppercase tracking-wider block">Finance Instagram</span>
                  <span className="text-xs font-semibold text-[#080b12] group-hover:text-blue transition-colors block mt-0.5">@meet.fitfix</span>
                </div>
              </a>

              {/* LinkedIn & X */}
              <div className="grid grid-cols-2 gap-4">
                <a
                  href={socialUrls.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 p-3.5 bg-white border border-[#0a0a0a]/10 rounded-lg hover:border-blue/30 transition-all group shadow-xs"
                >
                  <LinkedinIcon className="size-4 text-[#155de1]" />
                  <span className="text-xs font-semibold text-[#080b12] group-hover:text-blue transition-colors">LinkedIn</span>
                </a>
                <a
                  href={socialUrls.twitter}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 p-3.5 bg-white border border-[#0a0a0a]/10 rounded-lg hover:border-blue/30 transition-all group shadow-xs"
                >
                  <TwitterIcon className="size-4 text-blue" />
                  <span className="text-xs font-semibold text-[#080b12] group-hover:text-blue transition-colors">Twitter / X</span>
                </a>
              </div>
            </div>

            <div className="flex items-center gap-2 text-xs font-semibold text-[#3f4651] pt-4">
              <MapPin className="size-4 text-blue shrink-0" />
              <span>Based in {site.location}</span>
            </div>
          </div>

          {/* Right panel: Form or Submission Success */}
          <div className="lg:col-span-7 w-full">
            <Card className="p-8 border border-[#0a0a0a]/10 bg-white shadow-2xl relative rounded-panel">
              {submitted ? (
                <div className="py-12 text-center flex flex-col items-center">
                  <div className="size-16 rounded-full bg-[#dce9ff] text-[#155de1] flex items-center justify-center border border-[#2e7bff]/10 mb-6">
                    <CheckCircle2 className="size-8" />
                  </div>
                  <h3 className="font-heading text-2xl font-bold text-[#080b12]">
                    Proposal Submitted
                  </h3>
                  <p className="mt-3 text-xs sm:text-sm text-[#3f4651] leading-relaxed max-w-[36ch]">
                    {contact.form.successMessage} {contact.nextStep}
                  </p>
                  <div className="mt-8">
                    <Button onClick={() => setSubmitted(false)} className="bg-[#080b12] text-white hover:bg-[#080b12]/90" size="sm">
                      Submit Another Inquiry
                    </Button>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <h3 className="font-heading text-lg font-bold text-[#080b12]">
                    Campaign Details Proposal
                  </h3>

                  {errorMessage && (
                    <div role="alert" className="p-3.5 rounded-lg border border-red-200 bg-red-50 text-xs font-semibold text-red-600">
                      {errorMessage}
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="user-name" className="text-[10px] font-bold text-[#0a0a0a] uppercase block mb-2">
                        Your Name
                      </label>
                      <input
                        id="user-name"
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full h-11 border border-[#0a0a0a]/10 px-4 rounded-lg text-xs text-[#080b12] focus:border-blue focus:outline-hidden bg-[#f7f7f4]"
                      />
                    </div>

                    <div>
                      <label htmlFor="user-email" className="text-[10px] font-bold text-[#0a0a0a] uppercase block mb-2">
                        Work Email
                      </label>
                      <input
                        id="user-email"
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full h-11 border border-[#0a0a0a]/10 px-4 rounded-lg text-xs text-[#080b12] focus:border-blue focus:outline-hidden bg-[#f7f7f4]"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="user-brand" className="text-[10px] font-bold text-[#0a0a0a] uppercase block mb-2">
                        Brand / Company
                      </label>
                      <input
                        id="user-brand"
                        type="text"
                        required
                        value={formData.brand}
                        onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                        className="w-full h-11 border border-[#0a0a0a]/10 px-4 rounded-lg text-xs text-[#080b12] focus:border-blue focus:outline-hidden bg-[#f7f7f4]"
                      />
                    </div>

                    <div>
                      <label htmlFor="campaign-vertical" className="text-[10px] font-bold text-[#0a0a0a] uppercase block mb-2">
                        Collaboration Type
                      </label>
                      <select
                        id="campaign-vertical"
                        value={formData.vertical}
                        onChange={(e) => setFormData({ ...formData, vertical: e.target.value })}
                        className="w-full h-11 border border-[#0a0a0a]/10 px-4 rounded-lg text-xs text-[#080b12] focus:border-blue focus:outline-hidden bg-[#f7f7f4]"
                      >
                        <option value="UGC Video Creation">UGC Video Creation</option>
                        <option value="Dedicated Short-Form Reels">Dedicated Short-Form Reels</option>
                        <option value="Story Sequence Integrations">Story Sequence Integrations</option>
                        <option value="Long-term Partnership">Long-term Partnership</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="budget-range" className="text-[10px] font-bold text-[#0a0a0a] uppercase block mb-2">
                        Budget Range (Optional)
                      </label>
                      <select
                        id="budget-range"
                        value={formData.budget}
                        onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                        className="w-full h-11 border border-[#0a0a0a]/10 px-4 rounded-lg text-xs text-[#080b12] focus:border-blue focus:outline-hidden bg-[#f7f7f4]"
                      >
                        <option value="Custom Quote">Custom Quote</option>
                        <option value="Starter Testing">Starter Testing</option>
                        <option value="Campaign Bundle">Campaign Bundle</option>
                      </select>
                    </div>

                    <div>
                      <label htmlFor="timeline-option" className="text-[10px] font-bold text-[#0a0a0a] uppercase block mb-2">
                        Timeline
                      </label>
                      <select
                        id="timeline-option"
                        value={formData.timeline}
                        onChange={(e) => setFormData({ ...formData, timeline: e.target.value })}
                        className="w-full h-11 border border-[#0a0a0a]/10 px-4 rounded-lg text-xs text-[#080b12] focus:border-blue focus:outline-hidden bg-[#f7f7f4]"
                      >
                        {contact.form.timelines.map((timeline) => (
                          <option key={timeline} value={timeline}>
                            {timeline}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label htmlFor="proposal-message" className="text-[10px] font-bold text-[#0a0a0a] uppercase block mb-2">
                      Campaign Details / Message
                    </label>
                    <textarea
                      id="proposal-message"
                      required
                      rows={4}
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      className="w-full border border-[#0a0a0a]/10 p-4 rounded-lg text-xs text-[#080b12] focus:border-blue focus:outline-hidden bg-[#f7f7f4] resize-none"
                      placeholder="Tell me about your product, target audience, and success metrics..."
                    />
                  </div>

                  <div>
                    <ArrowPillButton size="lg" fullWidth loading={isSubmitting} disabled={isSubmitting}>
                      Submit Proposal Inquiry
                    </ArrowPillButton>
                  </div>
                </form>
              )}
            </Card>
          </div>
        </div>
      </Section>
    </div>
  );
}
