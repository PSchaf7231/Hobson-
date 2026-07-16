"use client";

interface CallOverlayProps {
  name: string;
  phone: string;
  onClose: () => void;
  onDialed: () => void;
}

export default function CallOverlay({ name, phone, onClose, onDialed }: CallOverlayProps) {
  function dial() {
    window.location.href = `tel:${phone.replace(/[^0-9+]/g, "")}`;
    onDialed();
    onClose();
  }

  return (
    <div className="fixed inset-0 z-[100] bg-[rgba(5,10,20,.97)] flex flex-col items-center justify-center gap-5 animate-fadeIn">
      <div className="w-[88px] h-[88px] rounded-full bg-gradient-to-br from-navy-light to-gold border-[3px] border-gold flex items-center justify-center text-white font-display text-4xl">
        {name.charAt(0)}
      </div>
      <div className="text-white font-bold text-[22px]">{name}</div>
      <div className="text-slate-400 text-sm">{phone}</div>
      <div className="text-gold text-xs tracking-wide">Ready to dial…</div>
      <div className="flex gap-10 mt-4">
        <div className="flex flex-col items-center">
          <button
            onClick={onClose}
            className="w-[60px] h-[60px] rounded-full bg-red-500 text-white font-bold text-[11px]"
          >
            END
          </button>
          <div className="text-[10px] text-slate-400 mt-1.5">Cancel</div>
        </div>
        <div className="flex flex-col items-center">
          <button
            onClick={dial}
            className="w-[60px] h-[60px] rounded-full bg-emerald-500 text-navy font-bold text-[11px]"
          >
            CALL
          </button>
          <div className="text-[10px] text-slate-400 mt-1.5">Call Now</div>
        </div>
      </div>
    </div>
  );
}
