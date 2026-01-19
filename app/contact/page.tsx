"use client";

import { useState } from "react";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    email: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: `${formData.firstName} ${formData.lastName}`.trim(),
          email: formData.email,
          phone: formData.phone,
          message: formData.message,
        }),
      });

      if (response.ok) {
        setSubmitted(true);
        setFormData({
          firstName: "",
          lastName: "",
          phone: "",
          email: "",
          message: "",
        });
      }
    } catch (error) {
      console.error("Error submitting form:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-[#f5f0e8] text-[#2a2520]">
        <section className="min-h-[80vh] flex items-center justify-center px-6">
          <div className="text-center">
            <p className="font-serif text-3xl md:text-4xl mb-6">Message received.</p>
            <p className="text-[#2a2520]/50">We'll be in touch soon.</p>
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f5f0e8] text-[#2a2520]">
      <section className="px-6 md:px-12 lg:px-16 py-24 md:py-32">
        <div className="max-w-[1400px] mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24">
            
            {/* Left column — title */}
            <div>
              <p className="text-[11px] uppercase tracking-[0.2em] text-[#2a2520]/40 mb-6">
                Get in Touch
              </p>
              <h1 className="font-serif text-5xl md:text-6xl lg:text-7xl leading-[1.1]">
                Send us<br />
                a note.
              </h1>
            </div>

            {/* Right column — form */}
            <div className="lg:pt-4">
              <form onSubmit={handleSubmit} className="space-y-10">
                {/* First Name + Last Name row */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div>
                    <label className="block text-[11px] uppercase tracking-[0.2em] text-[#2a2520]/40 mb-4">
                      First Name
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.firstName}
                      onChange={(e) =>
                        setFormData((prev) => ({ ...prev, firstName: e.target.value }))
                      }
                      className="w-full border-b border-[#2a2520]/20 py-3 bg-transparent focus:border-[#2a2520] transition-colors outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] uppercase tracking-[0.2em] text-[#2a2520]/40 mb-4">
                      Last Name
                    </label>
                    <input
                      type="text"
                      value={formData.lastName}
                      onChange={(e) =>
                        setFormData((prev) => ({ ...prev, lastName: e.target.value }))
                      }
                      className="w-full border-b border-[#2a2520]/20 py-3 bg-transparent focus:border-[#2a2520] transition-colors outline-none"
                    />
                  </div>
                </div>

                {/* Phone Number */}
                <div>
                  <label className="block text-[11px] uppercase tracking-[0.2em] text-[#2a2520]/40 mb-4">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, phone: e.target.value }))
                    }
                    className="w-full border-b border-[#2a2520]/20 py-3 bg-transparent focus:border-[#2a2520] transition-colors outline-none"
                  />
                </div>

                {/* Email Address */}
                <div>
                  <label className="block text-[11px] uppercase tracking-[0.2em] text-[#2a2520]/40 mb-4">
                    Email Address
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, email: e.target.value }))
                    }
                    className="w-full border-b border-[#2a2520]/20 py-3 bg-transparent focus:border-[#2a2520] transition-colors outline-none"
                  />
                </div>

                {/* Message */}
                <div>
                  <label className="block text-[11px] uppercase tracking-[0.2em] text-[#2a2520]/40 mb-4">
                    Message (Optional)
                  </label>
                  <textarea
                    rows={4}
                    value={formData.message}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, message: e.target.value }))
                    }
                    className="w-full border-b border-[#2a2520]/20 py-3 bg-transparent focus:border-[#2a2520] transition-colors resize-none outline-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full md:w-auto px-12 border border-[#2a2520]/30 text-[#2a2520] py-4 text-[11px] uppercase tracking-[0.15em] hover:bg-[#2a2520] hover:text-[#f5f0e8] transition-all duration-300 disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? "Sending…" : "Send"}
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
