const templates = [
  {
    name: "Nova",
    category: "SaaS",
    delay: "0s",
    preview: "nova",
  },
  {
    name: "Forma",
    category: "Agency",
    delay: "0.4s",
    preview: "forma",
  },
  {
    name: "Mono",
    category: "Portfolio",
    delay: "0.8s",
    preview: "mono",
  },
  {
    name: "Atlas",
    category: "Startup",
    delay: "1.2s",
    preview: "atlas",
  },
] as const;

function PreviewArt({ kind }: { kind: (typeof templates)[number]["preview"] }) {
  if (kind === "nova") {
    return (
      <div className="relative h-[118px] overflow-hidden bg-[#0b1220]">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(0,102,255,0.35),transparent_42%)]" />
        <div className="absolute left-4 top-4 h-2 w-16 rounded-full bg-white/15" />
        <div className="absolute left-4 top-9 h-1.5 w-10 rounded-full bg-[#0066FF]" />
        <div className="absolute bottom-4 left-4 right-4 grid grid-cols-3 gap-2">
          <div className="h-10 rounded-md bg-white/8" />
          <div className="h-10 rounded-md bg-white/8" />
          <div className="h-10 rounded-md bg-white/8" />
        </div>
      </div>
    );
  }
  if (kind === "forma") {
    return (
      <div className="relative h-[118px] overflow-hidden bg-[#14110e]">
        <div className="absolute right-0 top-0 h-24 w-24 rounded-full bg-[#c9a27a]/20 blur-2xl" />
        <div className="absolute left-4 top-5 h-8 w-8 rounded-full border border-white/15" />
        <div className="absolute left-16 top-6 right-5 space-y-1.5">
          <div className="h-1.5 w-3/4 rounded-full bg-white/20" />
          <div className="h-1.5 w-1/2 rounded-full bg-white/10" />
        </div>
        <div className="absolute bottom-4 left-4 right-4 h-12 rounded-md bg-white/6" />
      </div>
    );
  }
  if (kind === "mono") {
    return (
      <div className="relative h-[118px] overflow-hidden bg-black">
        <div className="absolute inset-x-5 top-5 grid grid-cols-4 gap-1.5">
          {Array.from({ length: 8 }).map((_, i) => (
            <div
              key={i}
              className="h-8 rounded-[3px] bg-white/10"
              style={{ opacity: i % 3 === 0 ? 0.22 : 0.1 }}
            />
          ))}
        </div>
        <div className="absolute bottom-4 left-5 h-1.5 w-12 rounded-full bg-white" />
      </div>
    );
  }
  return (
    <div className="relative h-[118px] overflow-hidden bg-[#071018]">
      <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(0,102,255,0.18),transparent_40%)]" />
      <div className="absolute left-4 top-4 right-4 h-7 rounded-md border border-white/10 bg-white/5" />
      <div className="absolute bottom-4 left-4 right-4 flex gap-2">
        <div className="h-12 flex-1 rounded-md bg-[#0066FF]/70" />
        <div className="h-12 w-10 rounded-md bg-white/8" />
      </div>
    </div>
  );
}

export function MarketplacePreview() {
  return (
    <div className="relative mx-auto w-full max-w-[560px]">
      <div className="animate-glow pointer-events-none absolute -inset-8 rounded-[40px] bg-[radial-gradient(circle_at_50%_40%,rgba(0,102,255,0.22),transparent_62%)] blur-2xl" />

      <div className="animate-float-slow relative overflow-hidden rounded-[18px] border border-white/10 bg-[#0a0a0a] shadow-[0_30px_80px_rgba(0,0,0,0.28)]">
        <div className="flex items-center gap-2 border-b border-white/8 px-4 py-3">
          <span className="h-2.5 w-2.5 rounded-full bg-white/15" />
          <span className="h-2.5 w-2.5 rounded-full bg-white/15" />
          <span className="h-2.5 w-2.5 rounded-full bg-white/15" />
          <span className="mx-auto -translate-x-6 rounded-md bg-white/6 px-3 py-1 text-[11px] tracking-wide text-white/40">
            marketplace.fnj.dev
          </span>
        </div>

        <div className="grid grid-cols-[112px_1fr] sm:grid-cols-[132px_1fr]">
          <aside className="hidden border-r border-white/8 p-4 sm:block">
            <p className="mb-4 text-[11px] font-medium tracking-[0.16em] text-white/40">
              FNJ
            </p>
            {["Browse", "SaaS", "Agency", "Portfolio"].map((item, index) => (
              <div
                key={item}
                className={`mb-1 rounded-md px-2.5 py-1.5 text-[12px] ${
                  index === 0
                    ? "bg-white/8 text-white"
                    : "text-white/45"
                }`}
              >
                {item}
              </div>
            ))}
          </aside>

          <div className="p-4 sm:p-5">
            <div className="mb-4 flex items-center justify-between gap-3">
              <p className="text-[13px] font-medium text-white">Templates</p>
              <div className="h-8 flex-1 max-w-[180px] rounded-md border border-white/8 bg-white/5 px-3 text-[11px] leading-8 text-white/30">
                Search templates…
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {templates.map((template) => (
                <article
                  key={template.name}
                  className="animate-float-card group overflow-hidden rounded-[12px] border border-white/8 bg-white/[0.03] transition-all duration-300 hover:-translate-y-1 hover:border-white/20 hover:bg-white/[0.05]"
                  style={{ animationDelay: template.delay }}
                >
                  <PreviewArt kind={template.preview} />
                  <div className="flex items-center justify-between px-3 py-2.5">
                    <div>
                      <p className="text-[13px] font-medium text-white">
                        {template.name}
                      </p>
                      <p className="text-[11px] text-white/40">
                        {template.category}
                      </p>
                    </div>
                    <span className="text-[10px] text-white/30 opacity-0 transition-opacity group-hover:opacity-100">
                      Next.js
                    </span>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
