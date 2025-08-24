import {
  ScrollVelocityContainer,
  ScrollVelocityRow,
} from "@/components/magicui/scroll-based-velocity";

export default function PartnerLogos() {
  return (
    <section className="w-full bg-[#0A0A0A] py-16">
      <div className="relative flex w-full flex-col items-center justify-center overflow-hidden">
        <ScrollVelocityContainer className="text-xl md:text-3xl lg:text-4xl font-bold tracking-[-0.02em] text-white/40">
          <ScrollVelocityRow baseVelocity={1} direction={1}>
            Google Cloud • Microsoft Azure • Amazon Web Services • NVIDIA • 
          </ScrollVelocityRow>
          <ScrollVelocityRow baseVelocity={1} direction={-1}>
            OpenAI • Anthropic • Meta AI • Salesforce • Stripe • Vercel • 
          </ScrollVelocityRow>
        </ScrollVelocityContainer>
        <div className="pointer-events-none absolute inset-y-0 left-0 w-1/4 bg-gradient-to-r from-[#0A0A0A]"></div>
        <div className="pointer-events-none absolute inset-y-0 right-0 w-1/4 bg-gradient-to-l from-[#0A0A0A]"></div>
      </div>
    </section>
  );
}