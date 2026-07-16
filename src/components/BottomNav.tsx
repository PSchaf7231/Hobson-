const ITEMS = ["Leads", "Pipeline", "Hobson", "Stats", "Settings"];

export default function BottomNav({ active = "Leads" }: { active?: string }) {
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-navy-mid/90 backdrop-blur-md border-t border-white/10 flex justify-around py-3 pb-[calc(env(safe-area-inset-bottom)+10px)] shadow-[0_-10px_24px_rgba(0,0,0,.35)]">
      {ITEMS.map((item) => (
        <div key={item} className="flex flex-col items-center gap-1.5">
          <div className={`w-1 h-1 rounded-full ${item === active ? "bg-gold" : "bg-transparent"}`} />
          <div
            className={`text-[8.5px] font-semibold tracking-wide uppercase ${
              item === active ? "text-gold" : "text-slate-400"
            }`}
          >
            {item}
          </div>
        </div>
      ))}
    </div>
  );
}
