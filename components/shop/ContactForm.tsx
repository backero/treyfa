"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Send, CheckCircle } from "lucide-react";

export function ContactForm() {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1200));
    setLoading(false);
    setSubmitted(true);
  }

  if (submitted) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex flex-col items-center justify-center gap-4 py-20 text-center"
      >
        <div className="h-16 w-16 rounded-full bg-green-50 border border-green-100 flex items-center justify-center">
          <CheckCircle className="h-7 w-7 text-green-600" />
        </div>
        <h3 className="text-lg font-semibold">Message Sent!</h3>
        <p className="text-sm text-muted-foreground max-w-xs">
          Thank you for reaching out. Our team will get back to you within 24 hours.
        </p>
        <Button variant="outline" size="sm" onClick={() => { setSubmitted(false); setForm({ name: "", email: "", subject: "", message: "" }); }}>
          Send Another
        </Button>
      </motion.div>
    );
  }

  const inputClass = "w-full rounded-xl border border-border bg-background px-4 py-3 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-foreground/20 transition-shadow";

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="text-xs uppercase tracking-widest text-muted-foreground block mb-1.5">Name</label>
          <input
            name="name"
            value={form.name}
            onChange={handleChange}
            required
            placeholder="Your name"
            className={inputClass}
          />
        </div>
        <div>
          <label className="text-xs uppercase tracking-widest text-muted-foreground block mb-1.5">Email</label>
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            required
            placeholder="you@email.com"
            className={inputClass}
          />
        </div>
      </div>

      <div>
        <label className="text-xs uppercase tracking-widest text-muted-foreground block mb-1.5">Subject</label>
        <select
          name="subject"
          value={form.subject}
          onChange={handleChange}
          required
          className={inputClass}
        >
          <option value="">Select a subject</option>
          <option value="order">Order Query</option>
          <option value="product">Product Information</option>
          <option value="return">Return / Refund</option>
          <option value="shipping">Shipping Query</option>
          <option value="other">Other</option>
        </select>
      </div>

      <div>
        <label className="text-xs uppercase tracking-widest text-muted-foreground block mb-1.5">Message</label>
        <textarea
          name="message"
          value={form.message}
          onChange={handleChange}
          required
          rows={5}
          placeholder="Tell us how we can help..."
          className={inputClass + " resize-none"}
        />
      </div>

      <Button type="submit" className="w-full h-12 rounded-xl" disabled={loading}>
        <AnimatePresence mode="wait">
          {loading ? (
            <motion.span key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex items-center gap-2">
              <span className="h-4 w-4 rounded-full border-2 border-background/30 border-t-background animate-spin" />
              Sending…
            </motion.span>
          ) : (
            <motion.span key="send" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex items-center gap-2">
              <Send className="h-4 w-4" /> Send Message
            </motion.span>
          )}
        </AnimatePresence>
      </Button>
    </form>
  );
}
