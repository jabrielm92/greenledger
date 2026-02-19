"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Send, MapPin, Mail, Calendar } from "lucide-react";

export default function ContactPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [company, setCompany] = useState("");
  const [message, setMessage] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess(false);
    setIsSending(true);

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, company, message }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Failed to send message");
      }

      setSuccess(true);
      setName("");
      setEmail("");
      setCompany("");
      setMessage("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div>
      {/* Header */}
      <section className="py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl font-bold text-brand-secondary mb-4">
            Contact Us
          </h1>
          <p className="text-lg text-muted-foreground max-w-xl mx-auto">
            Questions about GreenLedger? We&apos;d love to hear from you.
          </p>
        </div>
      </section>

      <section className="pb-20">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-[1fr_340px] gap-12 max-w-4xl mx-auto">
            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Name *</Label>
                  <Input
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    placeholder="Your name"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    placeholder="you@company.com"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="company">Company</Label>
                <Input
                  id="company"
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  placeholder="Your company name"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="message">Message *</Label>
                <textarea
                  id="message"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  required
                  rows={5}
                  placeholder="Tell us how we can help..."
                  className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                />
              </div>

              {error && <p className="text-sm text-red-600">{error}</p>}
              {success && (
                <p className="text-sm text-emerald-600">
                  Message sent! We&apos;ll get back to you shortly.
                </p>
              )}

              <Button
                type="submit"
                disabled={isSending || !name || !email || !message}
                className="bg-brand-primary hover:bg-brand-primary/90"
              >
                <Send className="mr-2 h-4 w-4" />
                {isSending ? "Sending..." : "Send Message"}
              </Button>
            </form>

            {/* Sidebar */}
            <div className="space-y-6">
              <div className="rounded-lg border p-6">
                <div className="flex items-center gap-3 mb-3">
                  <Mail className="h-5 w-5 text-brand-primary" />
                  <h3 className="text-sm font-semibold text-brand-secondary">
                    Email
                  </h3>
                </div>
                <p className="text-sm text-muted-foreground">
                  hello@greenledger.io
                </p>
              </div>

              <div className="rounded-lg border p-6">
                <div className="flex items-center gap-3 mb-3">
                  <MapPin className="h-5 w-5 text-brand-primary" />
                  <h3 className="text-sm font-semibold text-brand-secondary">
                    Office
                  </h3>
                </div>
                <p className="text-sm text-muted-foreground">
                  San Francisco, CA
                  <br />
                  United States
                </p>
              </div>

              <div className="rounded-lg border p-6">
                <div className="flex items-center gap-3 mb-3">
                  <Calendar className="h-5 w-5 text-brand-primary" />
                  <h3 className="text-sm font-semibold text-brand-secondary">
                    Book a Demo
                  </h3>
                </div>
                <p className="text-sm text-muted-foreground mb-3">
                  See GreenLedger in action with a personalized demo.
                </p>
                <Button variant="outline" size="sm" asChild>
                  <a href="mailto:hello@greenledger.io?subject=Demo%20Request">
                    Schedule Demo
                  </a>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
