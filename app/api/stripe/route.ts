import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: "2026-02-25.clover" });

export async function POST(req: NextRequest) {
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
