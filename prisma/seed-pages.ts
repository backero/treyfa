import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

function esc(s: string) {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

function textSection(title: string, body: string, list: string[] = []) {
  let html = `<p>${esc(body)}</p>`;
  if (list.length > 0) {
    html += `<ul>${list.map((item) => `<li>${esc(item)}</li>`).join("")}</ul>`;
  }
  return { title, body: html };
}

async function seedLegalPage(
  key: string,
  data: {
    heroLabel: string;
    title: string;
    lastUpdated: string;
    intro: string;
    stats?: { icon: string; label: string; value: string }[];
    sections: { title: string; body: string }[];
  }
) {
  const existing = await prisma.legalPage.findUnique({ where: { key } });
  if (existing) {
    console.log(`LegalPage "${key}" already exists — skipping.`);
    return;
  }

  const page = await prisma.legalPage.create({
    data: {
      key,
      heroLabel: data.heroLabel,
      title: data.title,
      lastUpdated: data.lastUpdated,
      intro: data.intro,
    },
  });

  if (data.stats?.length) {
    await prisma.legalStat.createMany({
      data: data.stats.map((s, i) => ({ legalPageId: page.id, icon: s.icon, label: s.label, value: s.value, order: i })),
    });
  }

  await prisma.legalSection.createMany({
    data: data.sections.map((s, i) => ({ legalPageId: page.id, title: s.title, body: s.body, order: i })),
  });

  console.log(`Seeded LegalPage "${key}".`);
}

async function seedPrivacyPolicy() {
  await seedLegalPage("privacy-policy", {
    heroLabel: "Legal",
    title: "Privacy Policy",
    lastUpdated: "January 2026",
    intro:
      'Treyfa ("we," "our," or "us") values your privacy and is committed to protecting your personal information. This Privacy Policy explains how we collect, use, share, and safeguard data when you visit our website or make a purchase.',
    sections: [
      textSection(
        "1. Information We Collect",
        "We collect the following types of information when you use our website or make a purchase:",
        [
          "Personal Information: Name, email address, phone number, shipping and billing address, and payment details",
          "Transaction Data: Order history, refund requests, and shipping details",
          "Usage Data: IP address, browser type, device information, and website interaction patterns",
          "Marketing Preferences: Your communication and marketing opt-in choices",
        ]
      ),
      textSection(
        "2. How We Use Your Information",
        "Your information is used solely to provide and improve our services:",
        [
          "Process and fulfil your orders",
          "Provide customer support and respond to queries",
          "Send order confirmations, tracking updates, and service notifications",
          "Send promotional communications only if you have opted in",
          "Improve website functionality and user experience",
          "Comply with applicable legal obligations",
        ]
      ),
      textSection(
        "3. Sharing Your Information",
        "Treyfa does not sell, rent, or trade your personal information. We may share it only in the following limited circumstances:",
        [
          "With logistics and payment partners solely to fulfil your order",
          "With legal authorities when required by applicable law",
          "In the event of a business merger or acquisition, with full notice to you",
        ]
      ),
      textSection(
        "4. Data Security",
        "We implement industry-standard security measures including SSL encryption and access controls to protect your personal data. While we take every precaution, no online transaction is entirely risk-free. We strongly recommend using a strong, unique password for your Treyfa account."
      ),
      textSection(
        "5. Cookies & Tracking Technologies",
        "Our website uses cookies to improve functionality, analyse user behaviour, and personalise your experience. Cookies do not identify you personally. You can manage or disable cookies through your browser settings, though some site features may be affected."
      ),
      textSection(
        "6. Your Rights & Choices",
        "As a user, you have the following rights regarding your personal data:",
        [
          "Access and review the personal data we hold about you",
          "Request corrections to inaccurate information",
          "Request deletion of your personal data",
          "Opt out of marketing communications at any time",
          "Request portability of your data",
        ]
      ),
      textSection(
        "7. Third-Party Links",
        "Our website may contain links to third-party websites. Treyfa is not responsible for the privacy practices or content of those external sites. We recommend reviewing the privacy policy of any site you visit."
      ),
      textSection(
        "8. Changes to This Policy",
        "We may update this Privacy Policy periodically to reflect changes in our practices or legal requirements. Updates will be posted on this page with a revised effective date. Continued use of our website after any change constitutes your acceptance of the revised policy."
      ),
      textSection(
        "9. Contact Us",
        "For questions, concerns, or requests related to your personal data or this Privacy Policy, please contact:",
        ["Email: treyfaacc@gmail.com", "Address: 42, Interflex Complex, Trichy Road, Coimbatore — 641402, Tamil Nadu, India"]
      ),
    ],
  });
}

async function seedTerms() {
  await seedLegalPage("terms-and-conditions", {
    heroLabel: "Legal",
    title: "Terms & Conditions",
    lastUpdated: "January 2026",
    intro:
      "By accessing and using the Treyfa website and purchasing our products, you accept and agree to be bound by these Terms and Conditions. Please read them carefully before placing an order.",
    sections: [
      textSection(
        "1. Product & Pricing",
        "All product prices listed on this website are in Indian Rupees (INR) and are inclusive of applicable taxes unless stated otherwise. Prices are subject to change without prior notice. While we make every effort to ensure accuracy, Treyfa is not responsible for any typographical errors or inaccuracies in product listings, descriptions, or pricing."
      ),
      textSection(
        "2. Orders",
        "By placing an order, you confirm that all information provided is accurate and complete. Treyfa reserves the right to refuse or cancel any order at its sole discretion — including in cases of suspected fraud, pricing errors, or product unavailability. Payment must be made through our secure payment gateway before an order is confirmed and processed."
      ),
      textSection(
        "3. Shipping & Delivery",
        "Products are shipped within India. International shipping options may be available on request — please contact us at treyfaacc@gmail.com for details. Delivery timeframes provided at checkout are estimates only. Treyfa is not responsible for delays caused by third-party logistics providers, natural events, or circumstances beyond our control."
      ),
      textSection(
        "4. Returns & Refunds",
        "Only defective or damaged products qualify for return within 7 days of delivery. Opened or used products are not eligible for returns due to hygiene reasons. To initiate a return, contact our support team within the specified window. Refunds are processed to the original payment method within 2 business days of product verification."
      ),
      textSection(
        "5. User Conduct",
        "You agree to use this website only for lawful purposes. Fraudulent activity, including chargebacks without valid cause, misrepresentation of identity, or unauthorized resale of Treyfa products, is strictly prohibited and may result in account termination and legal action."
      ),
      textSection(
        "6. Intellectual Property",
        "All content on this website — including text, images, logos, product photographs, and design elements — is the exclusive property of Treyfa and is protected by applicable intellectual property laws. Unauthorized reproduction, distribution, or use of any content without prior written consent is prohibited."
      ),
      textSection(
        "7. Disclaimer of Liability",
        "Treyfa is not liable for any allergic reactions or adverse effects resulting from product use. All products are formulated with natural ingredients; however, individual reactions may vary. We strongly recommend performing a patch test before first use. Users with known skin conditions or allergies should consult a dermatologist prior to use."
      ),
      textSection(
        "8. Privacy",
        "Customer data is collected and used in accordance with our Privacy Policy. We do not sell or share your personal information with third parties without your consent, except as required by law or to facilitate your order (e.g., with our logistics partners)."
      ),
      textSection(
        "9. Governing Law & Disputes",
        "These Terms and Conditions are governed by the laws of India. Any disputes arising from these terms or your use of this website shall be subject to the exclusive jurisdiction of the courts in Coimbatore, Tamil Nadu, India. We encourage resolution through direct communication before escalation."
      ),
      textSection(
        "10. Contact",
        "For any questions regarding these Terms and Conditions, please contact us at treyfaacc@gmail.com or call +91 89034 12061."
      ),
    ],
  });
}

async function seedRefundShipping() {
  await seedLegalPage("refund-shipping-policy", {
    heroLabel: "Legal",
    title: "Refund & Shipping Policy",
    lastUpdated: "January 2026",
    intro: "",
    stats: [
      { icon: "refresh", label: "Refund Window", value: "3 Days" },
      { icon: "truck", label: "Standard Delivery", value: "2–5 Days" },
      { icon: "package", label: "Free Shipping", value: "Online, or COD above ₹300" },
      { icon: "mail", label: "Refund Processed", value: "2 Bus. Days" },
    ],
    sections: [
      {
        title: "Refund Policy",
        body: `<h3>Our Promise</h3><p>Treyfa offers a hassle-free, no-questions-asked refund policy. We stand behind the quality of every product we make. If you are not satisfied, we will make it right.</p>
<h3>How to Request a Refund</h3><ol><li>Contact us at <a href="mailto:treyfaacc@gmail.com">treyfaacc@gmail.com</a> or call <a href="tel:+918903412061">+91 89034 12061</a> within 3 days of receiving your order.</li><li>Ship the product back in its original, unopened packaging. Return shipping costs are the customer's responsibility.</li><li>Once we receive and verify the product, a full refund will be issued to your original payment method within 2 business days.</li></ol>
<h3>Conditions for Refund</h3><ul><li>Refund request submitted within 3 days of delivery</li><li>Product returned in original, unused, and sealed packaging</li><li>Proof of purchase / order ID required</li></ul>
<h3>Non-Refundable Items</h3><ul><li>Opened or used products (for hygiene reasons)</li><li>Products damaged due to customer misuse</li><li>Requests made after the 3-day window</li></ul>`,
      },
      {
        title: "Shipping Policy",
        body: `<h3>Order Processing</h3><p>Orders are processed within 2 business days of payment confirmation. You will receive an email confirmation once your order is dispatched.</p>
<h3>Delivery Options</h3><table><thead><tr><th>Option</th><th>Timeframe</th><th>Cost</th></tr></thead><tbody><tr><td>Standard Shipping</td><td>2–5 business days</td><td>Free with online payment. COD: free above ₹300 (₹99 below)</td></tr><tr><td>Express Shipping</td><td>3–4 business days</td><td>Additional fee at checkout</td></tr></tbody></table>
<h3>Tracking Your Order</h3><p>A tracking link is sent to your registered email and phone number once your order is shipped. Use this to monitor your delivery in real time.</p>
<h3>Damaged or Missing Items</h3><p>If your order arrives damaged or items are missing, contact our support team within 1–3 days of delivery at <a href="mailto:treyfaacc@gmail.com">treyfaacc@gmail.com</a>. Please include photographs of the damaged packaging for faster resolution.</p>`,
      },
      {
        title: "Questions about your order?",
        body: `<p>Email us at <a href="mailto:treyfaacc@gmail.com">treyfaacc@gmail.com</a> or call <a href="tel:+919486500671">+91 94865 00671</a>. We're available Monday to Saturday, 10AM – 6PM.</p>`,
      },
    ],
  });
}

async function seedAbout() {
  const existing = await prisma.aboutPage.findFirst();
  if (existing) {
    console.log("AboutPage already exists — skipping.");
    return;
  }

  const page = await prisma.aboutPage.create({
    data: {
      heroLabel: "Our Story",
      heroTitle: "India's First",
      heroSubtitle: "Cancer-Free Cosmetics",
      heroDescription:
        "Treyfa is Backero Private Limited's flagship clean beauty brand — built on one conviction: Indian consumers deserve daily personal care that is both safe and effective, without toxic trade-offs.",
      missionLabel: "Who We Are",
      missionTitle: "Clean Beauty,",
      missionSubtitle: "Backed by Science",
      missionParagraph1:
        "Launched in 2021, Treyfa is the commercial cornerstone of Backero Private Limited's clean beauty mission — headquartered in Dindigul with manufacturing in Coimbatore, Tamil Nadu. Every formula is 100% naturally derived and validated through our in-house R&D process, not just labelled \"natural.\"",
      missionParagraph2:
        "Our mission: to make toxin-free, cancer-free personal care accessible, credible, and high-performing for every Indian consumer — proving that \"natural\" and \"effective\" are never mutually exclusive.",
      standardLabel: "No-Compromise Ingredient Policy",
      standardTitle: "The Treyfa Clean Beauty Standard",
      rndLabel: "Formulation Science",
      rndTitle: "Validated In-House, Not Just Labelled Natural",
      rndQuote:
        '"If a Treyfa formulation cannot outperform its synthetic equivalent in lab conditions, it does not go to market. We never compromise on efficacy in the name of naturalness." — Backero R&D Team',
      timelineLabel: "Our Journey",
      timelineTitle: "How It Started",
      hqCity: "Dindigul, Tamil Nadu",
      hqState: "A brand by Backero Private Limited",
      hqCaption: "Headquarters",
      manufacturingLine1: "42, Interflex Complex, Trichy Road, Near RVS College of Arts & Science,",
      manufacturingLine2: "Sulur, Coimbatore — 641402, Tamil Nadu, India",
    },
  });

  await prisma.aboutStat.createMany({
    data: [
      { value: "44+", label: "Products" },
      { value: "2021", label: "Founded" },
      { value: "100%", label: "Naturally Derived" },
      { value: "8", label: "Zero-Compromise Pledges" },
    ].map((s, i) => ({ ...s, aboutPageId: page.id, order: i })),
  });

  await prisma.aboutStandard.createMany({
    data: [
      { title: "Zero Parabens", desc: "No methyl-, ethyl-, propyl-, or butylparabens — linked to hormone disruption." },
      { title: "Zero Sulfates", desc: "No SLS / SLES — known irritants that cause scalp and skin sensitisation." },
      { title: "Zero Phthalates", desc: "No DEP, DBP, or DEHP — endocrine disruptors found in synthetic fragrances." },
      { title: "Zero Synthetic Colours", desc: "No petroleum-derived FD&C or D&C dyes." },
      { title: "Zero Formaldehyde Donors", desc: "No DMDM hydantoin, quaternium-15, or related preservatives." },
      { title: "Zero Mineral Oils", desc: "No petrolatum or paraffin — occlusive agents derived from crude petroleum." },
      { title: "Zero Artificial Fragrances", desc: "No synthetic perfume compounds — a major allergen and sensitiser source." },
      { title: "100% Naturally Derived", desc: "Every functional ingredient sourced from botanical, mineral, or bio-derived origins." },
    ].map((s, i) => ({ ...s, aboutPageId: page.id, order: i })),
  });

  await prisma.aboutRnDStage.createMany({
    data: [
      { title: "Ingredient Selection", desc: "Evidence-based botanical selection with toxicological screening against INCI and IARC guidelines." },
      { title: "Formulation & Stability", desc: "Laboratory-scale formulation, refined through iterative testing and accelerated stability trials." },
      { title: "Safety Assessment", desc: "Patch testing, skin compatibility, and irritancy evaluation before any product moves forward." },
      { title: "Performance Benchmarking", desc: "Every formula is benchmarked side-by-side against leading synthetic counterparts before it can launch." },
    ].map((s, i) => ({ ...s, aboutPageId: page.id, order: i })),
  });

  await prisma.aboutTimelineEvent.createMany({
    data: [
      { year: "2021", event: "Treyfa launches as Backero Private Limited's flagship clean beauty brand — a digital-first, direct-to-consumer herbal care line." },
      { year: "2022", event: "Expands from pure D2C into omni-channel retail, building distributor relationships across South India." },
      { year: "2024", event: "Scales nationally with 44+ products spanning Hair Care, Face Care, and Bath & Body." },
      { year: "2026", event: "Consolidating the range with certified formulations and a dermatologist advisory panel — same commitment to purity, backed by science." },
    ].map((s, i) => ({ ...s, aboutPageId: page.id, order: i })),
  });

  console.log("Seeded AboutPage.");
}

async function main() {
  await seedPrivacyPolicy();
  await seedTerms();
  await seedRefundShipping();
  await seedAbout();
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
