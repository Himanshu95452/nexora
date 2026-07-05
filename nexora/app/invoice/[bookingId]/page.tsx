import { notFound, redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { Seal } from "@/components/ui/Seal";
import { formatINR } from "@/lib/utils";

// Server-rendered, printable invoice — "Download Invoice" opens this in a
// new tab; the browser's own Print > Save as PDF covers the "download" part
// without pulling in a PDF-generation dependency.
export default async function InvoicePage({ params }: { params: { bookingId: string } }) {
  const session = await auth();
  if (!session?.user) redirect(`/login/customer?callbackUrl=/invoice/${params.bookingId}`);

  const booking = await prisma.booking.findUnique({
    where: { id: params.bookingId },
    include: {
      customer: { include: { user: true } },
      professional: { include: { user: true } },
      service: { include: { category: true } },
      payment: true,
      city: true,
    },
  });
  if (!booking) notFound();

  const { role, id: userId } = session.user as any;
  const owns =
    (role === "CUSTOMER" && booking.customer.userId === userId) ||
    (role === "PROFESSIONAL" && booking.professional?.userId === userId) ||
    role === "ADMIN";
  if (!owns) redirect("/dashboard/customer");

  const payment = booking.payment;

  return (
    <div className="min-h-screen bg-mist dark:bg-slate-950 py-12 px-6 print:bg-white print:py-0">
      <div className="max-w-2xl mx-auto bg-white dark:bg-slate-900 border border-line dark:border-slate-800 rounded-3xl p-10 print:border-0 print:rounded-none print:shadow-none">
        <div className="flex items-center justify-between mb-10">
          <div className="flex items-center gap-2">
            <Seal size={28} ringDash={false} />
            <span className="font-display text-lg font-bold text-navy dark:text-white">NEXORA</span>
          </div>
          <div className="text-right text-sm text-ink-soft dark:text-slate-400">
            <p className="font-semibold text-ink dark:text-white">Invoice</p>
            <p>#{booking.id.slice(-8).toUpperCase()}</p>
            <p>{new Date(booking.createdAt).toLocaleDateString()}</p>
          </div>
        </div>

        <div className="grid sm:grid-cols-2 gap-6 mb-8 text-sm">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-ink-soft dark:text-slate-400 mb-1">Billed to</p>
            <p className="font-semibold">{booking.customer.user.name}</p>
            <p className="text-ink-soft dark:text-slate-400">{booking.customer.user.email}</p>
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-ink-soft dark:text-slate-400 mb-1">Service by</p>
            <p className="font-semibold">{booking.professional?.user.name ?? "Unassigned"}</p>
            <p className="text-ink-soft dark:text-slate-400">{booking.city.name}</p>
          </div>
        </div>

        <div className="rounded-2xl border border-line dark:border-slate-800 overflow-hidden mb-6">
          <div className="grid grid-cols-3 px-5 py-3 text-xs font-semibold uppercase tracking-wide text-ink-soft dark:text-slate-400 bg-mist dark:bg-slate-800/50">
            <span>Description</span><span className="text-center">Category</span><span className="text-right">Amount</span>
          </div>
          <div className="grid grid-cols-3 px-5 py-4 text-sm border-t border-line dark:border-slate-800">
            <span>{booking.service.name}</span>
            <span className="text-center text-ink-soft dark:text-slate-400">{booking.service.category.name}</span>
            <span className="text-right font-semibold">{formatINR(Math.round(booking.estimatedPrice / 100))}</span>
          </div>
        </div>

        <div className="flex justify-end mb-8">
          <div className="w-56 space-y-2 text-sm">
            <div className="flex justify-between"><span className="text-ink-soft dark:text-slate-400">Subtotal</span><span>{formatINR(Math.round(booking.estimatedPrice / 100))}</span></div>
            <div className="flex justify-between font-bold text-base pt-2 border-t border-line dark:border-slate-800"><span>Total</span><span>{formatINR(Math.round((booking.finalPrice ?? booking.estimatedPrice) / 100))}</span></div>
          </div>
        </div>

        <div className="rounded-xl bg-mist dark:bg-slate-800/50 p-4 text-sm flex items-center justify-between">
          <span className="text-ink-soft dark:text-slate-400">Payment status</span>
          <span className="font-semibold">{payment ? `${payment.method} · ${payment.status}` : "Not recorded"}</span>
        </div>

        <button className="print:hidden mt-8 w-full h-11 rounded-full bg-navy text-white text-sm font-semibold" id="print-btn">
          Print / Save as PDF
        </button>
        <script dangerouslySetInnerHTML={{ __html: `document.getElementById('print-btn')?.addEventListener('click', () => window.print());` }} />
      </div>
    </div>
  );
}
