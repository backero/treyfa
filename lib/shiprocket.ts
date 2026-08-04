import { prisma } from "@/lib/prisma";

const BASE_URL = "https://apiv2.shiprocket.in/v1/external";
const TOKEN_SETTING_KEY = "shiprocket_auth_token";

// Fixed default package used for every order (single-bottle cosmetics parcel).
// Override via env if the standard box size ever changes.
const DEFAULT_WEIGHT_KG = Number(process.env.SHIPROCKET_DEFAULT_WEIGHT_KG || "0.3");
const DEFAULT_LENGTH_CM = Number(process.env.SHIPROCKET_DEFAULT_LENGTH_CM || "10");
const DEFAULT_BREADTH_CM = Number(process.env.SHIPROCKET_DEFAULT_BREADTH_CM || "10");
const DEFAULT_HEIGHT_CM = Number(process.env.SHIPROCKET_DEFAULT_HEIGHT_CM || "15");

type ShiprocketOrderInput = {
  id: string;
  createdAt: Date;
  paymentMethod: string;
  subtotal: number;
  total: number;
  items: { name: string; price: number; quantity: number; productId: string }[];
  address: {
    name: string;
    phone: string;
    line1: string;
    line2: string | null;
    city: string;
    state: string;
    pincode: string;
    country: string;
  };
  userEmail: string;
};

function splitName(fullName: string): { first: string; last: string } {
  const parts = fullName.trim().split(/\s+/);
  if (parts.length === 1) return { first: parts[0], last: parts[0] };
  return { first: parts.slice(0, -1).join(" "), last: parts[parts.length - 1] };
}

function isConfigured(): boolean {
  return Boolean(
    process.env.SHIPROCKET_EMAIL &&
      process.env.SHIPROCKET_PASSWORD &&
      process.env.SHIPROCKET_PICKUP_LOCATION
  );
}

async function getToken(): Promise<string> {
  const cached = await prisma.setting.findUnique({ where: { key: TOKEN_SETTING_KEY } });
  if (cached) {
    const parsed = JSON.parse(cached.value) as { token: string; expiresAt: string };
    if (new Date(parsed.expiresAt) > new Date()) return parsed.token;
  }

  const res = await fetch(`${BASE_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      email: process.env.SHIPROCKET_EMAIL,
      password: process.env.SHIPROCKET_PASSWORD,
    }),
  });

  if (!res.ok) {
    throw new Error(`Shiprocket login failed (${res.status})`);
  }

  const data = await res.json();
  if (!data.token) throw new Error("Shiprocket login did not return a token");

  // Shiprocket tokens are valid ~10 days; refresh a day early to be safe.
  const expiresAt = new Date(Date.now() + 9 * 24 * 60 * 60 * 1000).toISOString();
  await prisma.setting.upsert({
    where: { key: TOKEN_SETTING_KEY },
    update: { value: JSON.stringify({ token: data.token, expiresAt }) },
    create: { key: TOKEN_SETTING_KEY, value: JSON.stringify({ token: data.token, expiresAt }) },
  });

  return data.token as string;
}

export async function createShiprocketOrder(
  order: ShiprocketOrderInput
): Promise<
  | { success: true; shiprocketOrderId: string; shiprocketShipmentId: string }
  | { success: false; error: string }
> {
  if (!isConfigured()) {
    return { success: false, error: "Shiprocket is not configured (missing SHIPROCKET_EMAIL/PASSWORD/PICKUP_LOCATION)" };
  }

  try {
    const token = await getToken();
    const { first, last } = splitName(order.address.name);

    const payload = {
      order_id: order.id,
      order_date: order.createdAt.toISOString().slice(0, 16).replace("T", " "),
      pickup_location: process.env.SHIPROCKET_PICKUP_LOCATION,
      billing_customer_name: first,
      billing_last_name: last,
      billing_address: order.address.line1,
      billing_address_2: order.address.line2 ?? "",
      billing_city: order.address.city,
      billing_pincode: order.address.pincode,
      billing_state: order.address.state,
      billing_country: order.address.country || "India",
      billing_email: order.userEmail,
      billing_phone: order.address.phone,
      shipping_is_billing: true,
      order_items: order.items.map((item) => ({
        name: item.name,
        sku: item.productId,
        units: item.quantity,
        selling_price: item.price,
      })),
      payment_method: order.paymentMethod === "COD" ? "COD" : "Prepaid",
      sub_total: order.subtotal,
      length: DEFAULT_LENGTH_CM,
      breadth: DEFAULT_BREADTH_CM,
      height: DEFAULT_HEIGHT_CM,
      weight: DEFAULT_WEIGHT_KG,
    };

    const res = await fetch(`${BASE_URL}/orders/create/adhoc`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    });

    const data = await res.json();

    if (!res.ok || data.order_id == null) {
      const message = data?.message || data?.errors ? JSON.stringify(data.errors ?? data.message) : `HTTP ${res.status}`;
      return { success: false, error: `Shiprocket order creation failed: ${message}` };
    }

    return {
      success: true,
      shiprocketOrderId: String(data.order_id),
      shiprocketShipmentId: String(data.shipment_id),
    };
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return { success: false, error: `Shiprocket request failed: ${message}` };
  }
}
