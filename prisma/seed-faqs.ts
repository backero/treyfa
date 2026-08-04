import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const faqs = [
  {
    category: "Products",
    items: [
      {
        q: "Are Treyfa products 100% natural?",
        a: "Yes. All Treyfa products are formulated with natural and herbal ingredients inspired by South Indian Ayurvedic traditions. They are free from sulfates, parabens, and harmful synthetic chemicals.",
      },
      {
        q: "Are your products suitable for all skin and hair types?",
        a: "Most of our products are designed to be gentle and work across a range of skin and hair types. Each product page includes specific guidance. If you have a medical skin condition, please consult a dermatologist before use.",
      },
      {
        q: "Do Treyfa products have any side effects?",
        a: "Our products are crafted with clean, natural ingredients and are generally well-tolerated. However, as with any cosmetic product, individual reactions can vary. We recommend a patch test before full use.",
      },
      {
        q: "Are Treyfa products cruelty-free?",
        a: "Yes. Treyfa does not test on animals. We believe in ethical beauty practices alongside our commitment to natural formulations.",
      },
    ],
  },
  {
    category: "Orders & Shipping",
    items: [
      {
        q: "How long does delivery take?",
        a: "Orders are processed within 2 business days of payment confirmation. Standard delivery takes 2–5 business days. Express shipping (3–4 business days) is available for an additional fee.",
      },
      {
        q: "Is there free shipping?",
        a: "Yes! Orders paid online (card, UPI, net banking, or wallet) always ship free, regardless of order value. For Cash on Delivery orders, shipping is free above ₹300 — below that, a ₹99 shipping fee applies.",
      },
      {
        q: "How do I track my order?",
        a: "Once your order is shipped, the courier and tracking number will appear on your order details page under My Orders — no separate tracking link needed.",
      },
      {
        q: "Do you deliver outside India?",
        a: "We currently ship across India. International shipping options are being explored — contact us at treyfaacc@gmail.com for more information on international orders.",
      },
    ],
  },
  {
    category: "Returns & Refunds",
    items: [
      {
        q: "What is your return policy?",
        a: "We offer a hassle-free refund policy. Refund requests must be made within 3 days of receiving your order. The product must be returned in its original packaging and unused condition.",
      },
      {
        q: "How do I initiate a return?",
        a: "Email us at treyfaacc@gmail.com or call +91 89034 12061 within 3 days of delivery. Our team will guide you through the return process. Return shipping is at the customer's expense.",
      },
      {
        q: "When will I receive my refund?",
        a: "Once we receive and verify the returned product, your full refund will be processed within 2 business days to your original payment method.",
      },
      {
        q: "Can I return an opened product?",
        a: "For hygiene reasons, opened or used products are not eligible for returns unless the product is defective or damaged on arrival.",
      },
    ],
  },
  {
    category: "Account & Payments",
    items: [
      {
        q: "What payment methods do you accept?",
        a: "We accept Credit/Debit Cards, UPI (Google Pay, PhonePe, Paytm, or any UPI app), Net Banking, and Cash on Delivery — online payments are securely processed via Razorpay.",
      },
      {
        q: "Is it safe to pay online?",
        a: "Yes. All online payments are processed through Razorpay, a PCI-DSS compliant payment gateway. Your card, UPI, and banking details are never stored on our servers.",
      },
      {
        q: "Do I need an account to place an order?",
        a: "You can browse and explore our products without an account. However, creating an account allows you to track orders, manage your wishlist, and enjoy a faster checkout experience.",
      },
    ],
  },
];

async function main() {
  const existing = await prisma.faq.count();
  if (existing > 0) {
    console.log(`Faq table already has ${existing} rows — skipping seed.`);
    return;
  }

  for (const group of faqs) {
    for (let i = 0; i < group.items.length; i++) {
      const item = group.items[i];
      await prisma.faq.create({
        data: {
          category: group.category,
          question: item.q,
          answer: item.a,
          order: i,
          isPublished: true,
        },
      });
    }
  }

  console.log("Seeded FAQ content.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
