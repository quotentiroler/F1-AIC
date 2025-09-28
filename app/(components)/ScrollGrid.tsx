"use client";

// Scroll-driven sticky grid effect adapted for our landing page..

export default function ScrollGrid() {
  // Curated keywords related to AI, startups, founders, funding, and growth.
  // We create a deterministic shuffle to avoid SSR/CSR hydration mismatches while still feeling "random".
  const KEYWORDS = [
    "AI", "Machine Learning", "LLM", "GenAI", "Autonomous Agents", "RAG", "Vector DB", "Embeddings",
    "Prompt Engineering", "Fine-tuning", "OpenAI", "Anthropic", "Cohere", "Mistral", "Hugging Face",
    "Transformer", "Diffusion", "Multimodal", "Synthetic Data", "Reinforcement Learning", "GANs",
    "Edge AI", "On-device AI", "RLHF", "Distillation", "Few-shot", "Zero-shot", "Self-play",
    "Founders", "Co-founders", "Product-Market Fit", "MVP", "Iterate", "Pivot", "Growth", "Retention",
    "Virality", "Network Effects", "Distribution", "Monetization", "Pricing", "Freemium", "PLG",
    "Community", "Early Adopters", "Launch", "Waitlist", "Events", "Onboarding", "Activation",
    "Churn", "North Star Metric", "OKRs", "KPI", "Analytics", "Cohorts", "A/B Testing", "Experiments",
    "Referrals", "Flywheel", "Content", "SEO", "Outbound", "Inbound", "Demand Gen", "Sales",
    "Founder-led Sales", "Pipeline", "Conversion", "CAC", "LTV", "Retention", "NPS", "Payback",
    "Bootstrapped", "Seed Round", "Pre-seed", "Series A", "Series B", "Term Sheet", "Valuation",
    "Cap Table", "SAFE", "Convertible Note", "Runway", "Burn", "Unit Economics", "Gross Margin",
    "Go To Market", "B2B", "B2C", "DevTools", "SaaS", "Marketplace", "Platform", "APIs",
    "YC", "Y Combinator", "Techstars", "Accelerator", "Angel Investor", "VC", "Fundraising",
    "Pitch Deck", "Traction", "Moat", "Defensibility", "Speed", "Focus", "Execution",
    "Scrappy", "Ownership", "Leverage", "Compounding", "Ambition", "First Principles",
    "10x", "0 to 1", "PG", "Do Things that Don't Scale",
  ];

  // Simple seeded PRNG + shuffle (deterministic across SSR/CSR)
  function mulberry32(seed: number) {
    return function () {
      let t = (seed += 0x6d2b79f5);
      t = Math.imul(t ^ (t >>> 15), t | 1);
      t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }

  function shuffleDeterministic<T>(arr: T[], seed = 1337): T[] {
    const rand = mulberry32(seed);
    const a = arr.slice();
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(rand() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }

  const TOTAL_ITEMS = 50; // must match CSS nth-of-type animation ranges defined below
  const CTA_INDEX = 10; // 0-based index -> 11th item
  const shuffled = shuffleDeterministic(KEYWORDS, 20250928);
  const pool = shuffled.filter((w) => w !== "Join the AI Collective");
  const items: string[] = [];
  for (let i = 0; i < TOTAL_ITEMS; i++) {
    if (i === CTA_INDEX) {
      items.push("Join the AI Collective");
    } else {
      // Pull from pool in order; wrap-around if needed
      items.push(pool[(i < CTA_INDEX ? i : i - 1) % pool.length]);
    }
  }

  // Build CSS strings for animation ranges and 5x5 grid-area mapping
  const positions5x5 = Array.from({ length: 25 }, (_, idx) => `${Math.floor(idx / 5) + 1}/${(idx % 5) + 1}`);
  const gridAreaCSS = Array.from({ length: TOTAL_ITEMS }, (_, i) => {
    // Ensure CTA (nth-of-type 11) sits centered at 3/3 in the 5x5 grid
    const area = i === CTA_INDEX ? "3/3" : positions5x5[i % positions5x5.length];
    return `.stuck-grid > .grid-item:nth-of-type(${i + 1}) { grid-area: ${area} }`;
  }).join("\n");
  const animationRangeCSS = Array.from({ length: 50 }, (_, i) => `.stuck-grid > .grid-item:nth-of-type(${i + 1}) { animation-range: ${[40,20,52,50,45,10,90,30,80,70, -10,52,15,7,75,3,87,42,57,37,12,8,84,33,48,13,78,62,31,8,4,74,61,26,63,11,89,33,88,22,16,26,66,3,44,11,23,39,59,6][i%50]}% ${[50,30,62,60,55,20,100,40,90,80,50,62,25,17,85,13,97,52,67,47,22,18,94,43,58,23,88,72,41,18,14,84,71,36,73,21,99,43,98,32,26,36,76,13,54,21,33,49,69,16][i%50]}% }`).join("\n");

  const css = `
@keyframes zoom-in {
  0% { transform: translateZ(-1000px); opacity: 0; filter: blur(5px); }
  50% { transform: translateZ(0px); opacity: 1; filter: blur(0px); }
  100% { transform: translateZ(1000px); opacity: 0; filter: blur(5px); }
}
.stuck-grid {
  block-size: 100svh; perspective: 1000px; transform-style: preserve-3d;
  display: grid; grid: repeat(5, 20dvh) / repeat(5, 20dvw); place-items: center;
  position: sticky; top: 0; overflow: clip;
}
.stuck-grid > .grid-item {
  transform-style: preserve-3d; font-size: 3.75vmin; font-weight: 300; text-wrap: nowrap;
}
@supports (animation-timeline: scroll()) {
  @media (prefers-reduced-motion: no-preference) {
    .stuck-grid > .grid-item { animation: zoom-in linear both; animation-timeline: scroll(root block); will-change: transform, opacity, filter; }
  }
}
.stuck-grid > .grid-item.special { grid-row: 2 / span 2; grid-column: 2 / span 2; }
.stuck-grid > .grid-item > b { font-size: 15vmin; }
${animationRangeCSS}
@supports (animation-timeline: scroll()) {
  ${gridAreaCSS}
}
`;
  return (
    <section className="relative">
      <style
        // Inline CSS to keep this component self-contained
        dangerouslySetInnerHTML={{
          __html: css,
        }}
      />
      <div className="stuck-grid text-white">
        {items.map((label, i) => (
          <div className="grid-item" key={`${i}-${label}`}>
            {label}
          </div>
        ))}
      </div>
      {/* Spacer content to allow scroll past the sticky grid */}
      <div style={{ blockSize: "200svh" }} />
    </section>
  );
}
