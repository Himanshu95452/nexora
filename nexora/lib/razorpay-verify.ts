import crypto from "crypto";
import { usingMockGateway } from "@/lib/razorpay";

/**
 * Verifies the signature Razorpay Checkout returns to the client after a
 * successful payment: HMAC-SHA256 of `${order_id}|${payment_id}`, keyed with
 * the account's key secret.
 *
 * In mock mode (no real keys configured) this always returns true, since the
 * client never talked to the real Razorpay Checkout widget in the first
 * place — see components/payment/PaymentMethodSelector usage in the booking
 * flow, which skips loading the widget entirely when the order came back
 * marked `mock: true`.
 */
export function verifyPaymentSignature(orderId: string, paymentId: string, signature: string) {
  if (usingMockGateway) return true;
  const expected = crypto
    .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET!)
    .update(`${orderId}|${paymentId}`)
    .digest("hex");
  return expected === signature;
}

/**
 * Verifies the `X-Razorpay-Signature` header on incoming webhooks: HMAC-SHA256
 * of the raw request body, keyed with the webhook secret configured in the
 * Razorpay dashboard.
 */
export function verifyWebhookSignature(rawBody: string, signatureHeader: string | null) {
  if (usingMockGateway) return true;
  if (!signatureHeader || !process.env.RAZORPAY_WEBHOOK_SECRET) return false;
  const expected = crypto
    .createHmac("sha256", process.env.RAZORPAY_WEBHOOK_SECRET)
    .update(rawBody)
    .digest("hex");
  return expected === signatureHeader;
}
