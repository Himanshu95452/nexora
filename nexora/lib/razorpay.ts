import Razorpay from "razorpay";

const hasRealKeys =
  !!process.env.RAZORPAY_KEY_ID &&
  !!process.env.RAZORPAY_KEY_SECRET &&
  !process.env.RAZORPAY_KEY_ID.includes("placeholder");

export const usingMockGateway = !hasRealKeys;
export const RAZORPAY_KEY_ID = process.env.RAZORPAY_KEY_ID || "rzp_test_mock_key";

/**
 * Falls back to an in-memory mock (same method shapes as the real SDK) when
 * RAZORPAY_KEY_ID / RAZORPAY_KEY_SECRET aren't configured, so the booking
 * flow, refunds, and dashboards all stay fully demoable without a live
 * Razorpay account. Set real keys in .env to go live — no other code needs
 * to change.
 */
export const razorpay: Razorpay = hasRealKeys
  ? new Razorpay({ key_id: process.env.RAZORPAY_KEY_ID!, key_secret: process.env.RAZORPAY_KEY_SECRET! })
  : ({
      orders: {
        create: async (opts: any) => ({
          id: `order_mock_${Date.now()}`,
          amount: opts.amount,
          currency: opts.currency ?? "INR",
          receipt: opts.receipt,
          status: "created",
        }),
      },
      payments: {
        refund: async (paymentId: string, opts: any) => ({
          id: `rfnd_mock_${Date.now()}`,
          payment_id: paymentId,
          amount: opts?.amount,
          status: "processed",
        }),
        fetch: async (paymentId: string) => ({ id: paymentId, method: "card", status: "captured" }),
      },
    } as unknown as Razorpay);
