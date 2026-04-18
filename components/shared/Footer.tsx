import Link from "next/link";
import Image from "next/image";
import { Phone, Mail, MapPin, Clock } from "lucide-react";
import { TbBrandInstagram, TbBrandFacebook, TbBrandX, TbBrandYoutube } from "react-icons/tb";

const quickLinks = [
  { href: "/products", label: "All Products" },
  { href: "/products?category=hair-care", label: "Hair Care" },
  { href: "/products?category=face-care", label: "Face Care" },
  { href: "/products?category=bath-body", label: "Bath & Body" },
  { href: "/products?featured=true", label: "Featured" },
];

const companyLinks = [
  { href: "/about", label: "About Us" },
  { href: "/blog", label: "Blog" },
  { href: "/contact", label: "Contact Us" },
  { href: "/faq", label: "FAQ" },
];

const policyLinks = [
  { href: "/terms-and-conditions", label: "Terms & Conditions" },
  { href: "/refund-shipping-policy", label: "Refund & Shipping" },
  { href: "/privacy-policy", label: "Privacy Policy" },
];

const socials = [
  {
    icon: TbBrandInstagram,
    href: "https://instagram.com/treyfa_naturalcare",
    label: "Instagram",
  },
  {
    icon: TbBrandFacebook,
    href: "https://facebook.com/share/19HrmdnzYW/",
    label: "Facebook",
  },
  {
    icon: TbBrandX,
    href: "https://x.com/TreyfaNatural",
    label: "Twitter",
  },
  {
    icon: TbBrandYoutube,
    href: "https://youtube.com/@treyfa_naturalcare",
    label: "YouTube",
  },
];

export function Footer() {
  return (
    <footer className="bg-[#0c1a0f] text-white">
      {/* Main grid */}
      <div className="container mx-auto px-4 py-12 md:py-16">
        <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-5 gap-8 md:gap-10 lg:gap-8">

          {/* Brand column — full width on mobile, spans 2 on lg */}
          <div className="col-span-2 lg:col-span-2">
            <Link href="/" className="inline-block mb-5">
              <Image
                src="/logo.png"
                alt="Treyfa"
                width={100}
                height={40}
                className="object-contain brightness-0 invert w-[90px] md:w-[110px] h-auto"
              />
            </Link>
            <p className="text-white/50 text-sm leading-relaxed mb-6 max-w-xs">
              India&apos;s natural &amp; herbal beauty brand. Rooted in South Indian Ayurvedic
              traditions, crafted for modern daily care.
            </p>

            {/* Socials */}
            <div className="flex gap-2 flex-wrap">
              {socials.map(({ icon: Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="h-10 w-10 flex items-center justify-center rounded-lg border border-white/10 text-white/50 hover:bg-white/10 hover:text-white transition-all duration-200"
                >
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>

            {/* Contact details */}
            <div className="mt-7 space-y-3">
              <a
                href="tel:+919486500671"
                className="flex items-start gap-2.5 text-sm text-white/50 hover:text-white transition-colors"
              >
                <Phone className="h-3.5 w-3.5 flex-shrink-0 mt-0.5" />
                <span>+91 94865 00671 / +91 89034 12061</span>
              </a>
              <a
                href="mailto:info@treyfa.in"
                className="flex items-center gap-2.5 text-sm text-white/50 hover:text-white transition-colors"
              >
                <Mail className="h-3.5 w-3.5 flex-shrink-0" />
                info@treyfa.in
              </a>
              <div className="flex items-start gap-2.5 text-sm text-white/50">
                <MapPin className="h-3.5 w-3.5 flex-shrink-0 mt-0.5" />
                <span>42, Interflex Complex, Trichy Road, Sulur, Coimbatore — 641402</span>
              </div>
              <div className="flex items-center gap-2.5 text-sm text-white/50">
                <Clock className="h-3.5 w-3.5 flex-shrink-0" />
                Mon–Sat: 10AM – 6PM
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div className="col-span-1">
            <h4 className="text-xs font-semibold uppercase tracking-[0.3em] text-white/40 mb-4 md:mb-5">
              Shop
            </h4>
            <ul className="space-y-3">
              {quickLinks.map(({ href, label }) => (
                <li key={label}>
                  <Link
                    href={href}
                    className="text-sm text-white/55 hover:text-white transition-colors"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div className="col-span-1">
            <h4 className="text-xs font-semibold uppercase tracking-[0.3em] text-white/40 mb-4 md:mb-5">
              Company
            </h4>
            <ul className="space-y-3">
              {companyLinks.map(({ href, label }) => (
                <li key={label}>
                  <Link
                    href={href}
                    className="text-sm text-white/55 hover:text-white transition-colors"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Policies */}
          <div className="col-span-1 md:col-span-2 lg:col-span-1">
            <h4 className="text-xs font-semibold uppercase tracking-[0.3em] text-white/40 mb-4 md:mb-5">
              Policies
            </h4>
            <ul className="space-y-3">
              {policyLinks.map(({ href, label }) => (
                <li key={label}>
                  <Link
                    href={href}
                    className="text-sm text-white/55 hover:text-white transition-colors"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/8">
        <div className="container mx-auto px-4 py-4 md:py-5 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-white/30 text-center sm:text-left">
            &copy; {new Date().getFullYear()} Treyfa Natural Care. All rights reserved.
          </p>
          <div className="flex items-center gap-1.5 flex-wrap justify-center">
            <span className="text-xs text-white/30">We accept</span>
            {["Visa", "MC", "UPI", "Razorpay"].map((m) => (
              <span
                key={m}
                className="px-2 py-0.5 rounded text-[10px] font-medium border border-white/10 text-white/40"
              >
                {m}
              </span>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
