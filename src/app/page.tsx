import type { Metadata } from "next";
import LeadsHome from "@/components/LeadsHome";

export const metadata: Metadata = {
  title: "Hobson Real Estate Concierge | Buy or Sell in [Service Area, ST]",
  description:
    "Looking for a home in [Service Area, ST]? Hobson Real Estate Concierge pairs a local, licensed agent with an always-on concierge so your questions never wait a day. Buying, selling, and everything in between.",
  keywords: [
    "homes for sale [Service Area]",
    "real estate agent [Service Area, ST]",
    "buy a home in [Service Area]",
    "sell my home [Service Area]",
    "Hobson Real Estate Concierge",
  ],
  alternates: { canonical: "/" },
  openGraph: {
    title: "Hobson Real Estate Concierge | Buy or Sell in [Service Area, ST]",
    description:
      "A local agent backed by an always-on concierge — so buyers and sellers in [Service Area, ST] get a same-day answer, every time.",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary",
    title: "Hobson Real Estate Concierge",
    description: "Buy or sell in [Service Area, ST] with a local agent and an always-on concierge.",
  },
};

const faqs = [
  {
    q: "How quickly will I hear back if I reach out?",
    a: "Same day, usually within the hour. Every inquiry is routed through Hobson, our concierge system, the moment it comes in — nothing sits in a queue overnight.",
  },
  {
    q: "Do you work with both buyers and sellers in [Service Area, ST]?",
    a: "Yes. Whether you're searching for your next home or getting ready to list, you get the same local, hands-on approach and the same fast response time.",
  },
  {
    q: "I'm just starting to look — is it too early to reach out?",
    a: "No. Most of the buyers we work with start with questions, not an offer. Reach out whenever you're ready to talk, even if that's step one.",
  },
  {
    q: "What areas do you cover?",
    a: "We focus on [Service Area, ST] and the surrounding communities. Ask us about a specific neighborhood and we'll tell you straight whether it's a fit.",
  },
];

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqs.map((f) => ({
    "@type": "Question",
    name: f.q,
    acceptedAnswer: { "@type": "Answer", text: f.a },
  })),
};

const realEstateAgentJsonLd = {
  "@context": "https://schema.org",
  "@type": "RealEstateAgent",
  name: "[Your Name] — Hobson Real Estate Concierge",
  description:
    "Local real estate agent serving buyers and sellers in [Service Area, ST], backed by the Hobson concierge system for same-day response.",
  areaServed: "[Service Area, ST]",
  telephone: "[Phone]",
  email: "[Email]",
  url: "https://hobsonconcierge.com",
};

export default function Page() {
  return (
    <div className="bg-navy">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(realEstateAgentJsonLd) }}
      />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />

      {/* hero */}
      <header className="px-6 pt-[calc(env(safe-area-inset-top)+28px)] pb-10 text-center max-w-xl mx-auto">
        <div className="inline-flex items-center gap-2 mb-6">
          <div className="w-8 h-8 rounded-[9px] bg-gradient-to-b from-[#f0da8a] to-gold flex items-center justify-center font-display font-bold text-navy text-base shadow-[0_3px_8px_rgba(212,175,55,.4),inset_0_1px_0_rgba(255,255,255,.5)]">
            H
          </div>
          <span className="font-display font-bold text-white text-[17px]">
            Hobson <span className="text-gold">Concierge</span>
          </span>
        </div>

        <h1 className="font-display font-bold text-white text-[28px] leading-tight mb-4">
          Buy or sell a home in{" "}
          <span className="text-gold">[Service Area, ST]</span> without the wait.
        </h1>
        <p className="text-slate-300 text-[14px] leading-relaxed mb-7">
          You get a local agent who knows the market and an always-on concierge who makes sure no question,
          showing request, or offer update sits unanswered overnight.
        </p>

        <div className="flex items-center justify-center gap-3">
          <a
            href="tel:[Phone]"
            className="px-5 py-2.5 rounded-full bg-gradient-to-b from-[#f0da8a] to-gold text-navy text-[13px] font-bold shadow-glow"
          >
            Call [Phone]
          </a>
          <a
            href="mailto:[Email]"
            className="px-5 py-2.5 rounded-full border border-white/15 text-white text-[13px] font-semibold"
          >
            Send a Message
          </a>
        </div>
      </header>

      {/* value props */}
      <section className="px-6 pb-10 max-w-3xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-3">
        <ValueCard
          title="Same-Day Response"
          copy="Reach out any time — Hobson flags it instantly, so you're never waiting until tomorrow for an answer."
        />
        <ValueCard
          title="Local Market Knowledge"
          copy="Pricing, neighborhoods, and timing advice specific to [Service Area, ST] — not a national average."
        />
        <ValueCard
          title="Guided Start to Finish"
          copy="From your first question to closing day, one agent walks the whole process with you."
        />
      </section>

      {/* buying / selling */}
      <section className="px-6 pb-10 max-w-3xl mx-auto grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="bg-card border border-white/10 rounded-2xl p-5">
          <h2 className="font-display font-bold text-gold text-[16px] mb-2">Buying a Home</h2>
          <p className="text-slate-300 text-[13px] leading-relaxed">
            Tell us what you're looking for in [Service Area, ST] and we'll bring you homes that actually match —
            plus straight answers on financing, timing, and what an offer needs to look like to win.
          </p>
        </div>
        <div className="bg-card border border-white/10 rounded-2xl p-5">
          <h2 className="font-display font-bold text-gold text-[16px] mb-2">Selling Your Home</h2>
          <p className="text-slate-300 text-[13px] leading-relaxed">
            A pricing strategy built on real comps, a plan to get your listing in front of serious buyers, and
            a single point of contact who returns every call the same day.
          </p>
        </div>
      </section>

      {/* transparency / demo section */}
      <section className="px-6 pb-4 max-w-3xl mx-auto text-center">
        <h2 className="font-display font-bold text-white text-[18px] mb-2">
          What happens when you reach out
        </h2>
        <p className="text-slate-300 text-[13px] leading-relaxed mb-6">
          Every inquiry lands here first. Hobson prioritizes it, flags it as urgent when it needs to be, and
          makes sure it's answered the same day — this is the actual system behind that promise, not a mockup.
        </p>
      </section>

      <section className="max-w-md mx-auto">
        <LeadsHome />
      </section>

      {/* FAQ */}
      <section className="px-6 py-12 max-w-2xl mx-auto">
        <h2 className="font-display font-bold text-white text-[20px] mb-6 text-center">
          Common Questions from Buyers &amp; Sellers
        </h2>
        <div className="flex flex-col gap-4">
          {faqs.map((f) => (
            <div key={f.q} className="border-b border-white/10 pb-4">
              <h3 className="text-gold font-semibold text-[13.5px] mb-1.5">{f.q}</h3>
              <p className="text-slate-300 text-[13px] leading-relaxed">{f.a}</p>
            </div>
          ))}
        </div>
      </section>

      {/* footer */}
      <footer className="px-6 py-10 border-t border-white/10 text-center text-slate-400 text-[12px] leading-relaxed">
        <p className="mb-2">
          <span className="text-white font-semibold">[Your Name]</span> — Hobson Real Estate Concierge, serving
          buyers and sellers throughout [Service Area, ST].
        </p>
        <p className="mb-2">
          [Phone] · [Email] · [Brokerage Name, License #]
        </p>
        <p>© {new Date().getFullYear()} Hobson Real Estate Concierge. All rights reserved.</p>
      </footer>
    </div>
  );
}

function ValueCard({ title, copy }: { title: string; copy: string }) {
  return (
    <div className="bg-card border border-white/10 rounded-2xl p-4 text-center">
      <h3 className="font-display font-bold text-gold text-[13.5px] mb-1.5">{title}</h3>
      <p className="text-slate-300 text-[12px] leading-relaxed">{copy}</p>
    </div>
  );
}
