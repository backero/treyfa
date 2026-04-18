import { PageTransition } from "@/components/shared/PageTransition";
import { AnimatedSection } from "@/components/shared/AnimatedSection";
import { ContactForm } from "@/components/shop/ContactForm";
import { Phone, Mail, MapPin, Clock, Instagram, Facebook } from "lucide-react";
import { TbBrandX, TbBrandYoutube } from "react-icons/tb";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact Us",
  description: "Get in touch with Treyfa. We're here to help with orders, products, and anything else.",
};

const contactDetails = [
  {
    icon: Phone,
    label: "Phone",
    lines: ["+91 94865 00671", "+91 89034 12061"],
    href: "tel:+919486500671",
  },
  {
    icon: Mail,
    label: "Email",
    lines: ["info@treyfa.in", "support@treyfa.in"],
    href: "mailto:info@treyfa.in",
  },
  {
    icon: MapPin,
    label: "Address",
    lines: [
      "42, Interflex Complex, Trichy Road,",
      "Near RVS College, Sulur,",
      "Coimbatore — 641402, Tamil Nadu",
    ],
    href: "https://maps.google.com/?q=42+Interflex+Complex+Trichy+Road+Sulur+Coimbatore",
  },
  {
    icon: Clock,
    label: "Business Hours",
    lines: ["Mon – Sat: 10:00 AM – 6:00 PM", "Sunday: Closed"],
    href: null,
  },
];

const socials = [
  {
    icon: Instagram,
    label: "Instagram",
    handle: "@treyfa_naturalcare",
    href: "https://instagram.com/treyfa_naturalcare",
  },
  {
    icon: Facebook,
    label: "Facebook",
    handle: "Treyfa Natural",
    href: "https://facebook.com/share/19HrmdnzYW/",
  },
  {
    icon: TbBrandX,
    label: "Twitter / X",
    handle: "@TreyfaNatural",
    href: "https://x.com/TreyfaNatural",
  },
  {
    icon: TbBrandYoutube,
    label: "YouTube",
    handle: "@treyfa_naturalcare",
    href: "https://youtube.com/@treyfa_naturalcare",
  },
];

export default function ContactPage() {
  return (
    <PageTransition>
      {/* Hero */}
      <section className="pt-24 pb-14 sm:pt-28 sm:pb-16 md:pt-36 md:pb-20 lg:pt-40 lg:pb-28 bg-[#0c1a0f]">
        <div className="container mx-auto px-4 text-center">
          <p className="text-[10px] uppercase tracking-[0.45em] text-green-400 mb-4">
            We&apos;d Love to Hear from You
          </p>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4">Contact Us</h1>
          <p className="text-white/50 max-w-md mx-auto text-sm md:text-base">
            Have a question about an order or a product? Our team is here to help.
          </p>
        </div>
      </section>

      <div className="container mx-auto px-4 py-12 md:py-16 lg:py-24">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-12 lg:gap-16">

          {/* Left — details */}
          <AnimatedSection>
            <h2 className="text-xl sm:text-2xl font-bold mb-6 md:mb-8">Get in Touch</h2>
            <div className="space-y-6 md:space-y-7">
              {contactDetails.map(({ icon: Icon, label, lines, href }) => (
                <div key={label} className="flex gap-3 md:gap-4">
                  <div className="h-10 w-10 rounded-xl bg-secondary flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Icon className="h-4 w-4" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs uppercase tracking-widest text-muted-foreground mb-1">
                      {label}
                    </p>
                    {lines.map((line) =>
                      href ? (
                        <a
                          key={line}
                          href={href}
                          target={href.startsWith("http") ? "_blank" : undefined}
                          rel="noopener noreferrer"
                          className="block text-sm hover:text-foreground text-muted-foreground transition-colors break-words"
                        >
                          {line}
                        </a>
                      ) : (
                        <p key={line} className="text-sm text-muted-foreground">{line}</p>
                      )
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Social */}
            <div className="mt-10 md:mt-12">
              <p className="text-xs uppercase tracking-widest text-muted-foreground mb-4 md:mb-5">
                Follow Us
              </p>
              <div className="grid grid-cols-2 gap-2 sm:gap-3">
                {socials.map(({ icon: Icon, label, handle, href }) => (
                  <a
                    key={label}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2.5 rounded-xl border border-border p-3 hover:bg-secondary transition-colors duration-200 group"
                  >
                    <Icon className="h-4 w-4 text-muted-foreground group-hover:text-foreground transition-colors flex-shrink-0" />
                    <div className="min-w-0">
                      <p className="text-xs font-medium leading-none truncate">{label}</p>
                      <p className="text-[10px] text-muted-foreground mt-0.5 truncate">{handle}</p>
                    </div>
                  </a>
                ))}
              </div>
            </div>
          </AnimatedSection>

          {/* Right — form */}
          <AnimatedSection delay={0.1}>
            <h2 className="text-xl sm:text-2xl font-bold mb-6 md:mb-8">Send a Message</h2>
            <ContactForm />
          </AnimatedSection>
        </div>

        {/* Map */}
        <AnimatedSection className="mt-12 md:mt-16">
          <div className="rounded-2xl overflow-hidden border border-border h-56 sm:h-64 md:h-72 lg:h-80">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3913.1!2d77.132488!3d11.0276263!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3ba8554f5b09719b%3A0xeaf0709655cf575c!2sTreyfa!5e0!3m2!1sen!2sin!4v1713456789!5m2!1sen!2sin"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Treyfa Location — Coimbatore"
            />
          </div>
          <p className="text-xs text-muted-foreground text-center mt-3">
            42, Interflex Complex, Trichy Road, Sulur, Coimbatore — 641402
          </p>
        </AnimatedSection>
      </div>
    </PageTransition>
  );
}
