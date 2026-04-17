import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

export async function POST(req: NextRequest) {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) {
    return NextResponse.json({ error: "Stripe is not configured on this deployment" }, { status: 503 });
  }
  const stripe = new Stripe(key, { apiVersion: "2026-02-25.clover" });

  const { patientId, amount, description } = await req.json();
  if (!patientId || !amount) {
    return NextResponse.json({ error: "patientId and amount required" }, { status: 400 });
  }
  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100),
      currency: "cad",
      metadata: { patientId, description: description ?? "Dental service" },
    });
    return NextResponse.json({ clientSecret: paymentIntent.client_secret });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
