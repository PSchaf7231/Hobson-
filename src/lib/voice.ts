export function speak(text: string, onEnd?: () => void) {
  if (typeof window === "undefined" || !("speechSynthesis" in window)) {
    onEnd?.();
    return;
  }
  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.rate = 0.98;
  utterance.pitch = 1;
  const voices = window.speechSynthesis.getVoices();
  const preferred = voices.find((v) => /en-US|en_US/.test(v.lang) && /male/i.test(v.name));
  if (preferred) utterance.voice = preferred;
  if (onEnd) {
    utterance.onend = onEnd;
    utterance.onerror = onEnd;
  }
  window.speechSynthesis.speak(utterance);
}
