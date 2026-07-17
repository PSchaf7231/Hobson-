import { SpeakerIcon } from "./Icons";

interface HobsonPillProps {
  name?: string;
  onToggleVoice: (e: React.MouseEvent) => void;
}

export default function HobsonPill({ name = "Paul Schafranick", onToggleVoice }: HobsonPillProps) {
  return (
    <div style={styles.wrapper}>
      <div style={styles.label}>HOBSON</div>
      <div style={styles.pillFrame}>
        <div style={styles.pill}>
          <span style={styles.pillName}>{name}</span>
          <button style={styles.speakerBtn} onClick={onToggleVoice} aria-label="Toggle voice">
            <SpeakerIcon className="w-[18px] h-[18px]" />
          </button>
        </div>
      </div>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  wrapper: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: 10,
    width: "100%",
  },
  label: {
    color: "#e8c554",
    fontWeight: 800,
    fontSize: 15,
    letterSpacing: 4,
    fontFamily: "'Playfair Display', Georgia, serif",
    textShadow: "0 1px 3px rgba(0,0,0,0.5)",
  },
  pillFrame: {
    width: "100%",
    maxWidth: 360,
    padding: 5,
    borderRadius: 999,
    background: "linear-gradient(180deg,#e8c554,#8a6608)",
    boxShadow: "0 3px 8px rgba(0,0,0,0.4)",
  },
  pill: {
    position: "relative",
    background:
      "linear-gradient(180deg, #fdf3c6 0%, #f0c33e 18%, #d9a520 42%, #f5da7a 52%, #c9971c 78%, #9c7710 100%)",
    border: "1px solid #6b4f0a",
    boxShadow: "inset 0 2px 3px rgba(255,255,255,0.65), inset 0 -3px 5px rgba(0,0,0,0.35)",
    borderRadius: 999,
    padding: "16px 48px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  pillName: {
    color: "#0a1128",
    fontWeight: 800,
    fontSize: 19,
    fontFamily: "Georgia, serif",
    textShadow: "0 1px 0 rgba(255,255,255,0.5)",
    textAlign: "center",
  },
  speakerBtn: {
    position: "absolute",
    right: 18,
    top: "50%",
    transform: "translateY(-50%)",
    background: "none",
    border: "none",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    padding: 0,
    color: "#0a1128",
  },
};
