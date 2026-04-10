const getAudioContext = (): AudioContext | null => {
  const AC =
    window.AudioContext ||
    (window as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
  if (!AC) return null;
  return new AC();
};

export function playClickSound() {
  const ac = getAudioContext();
  if (!ac) return;

  const t = ac.currentTime;

  // Мягкий верхний тон
  const osc1 = ac.createOscillator();
  const g1 = ac.createGain();
  osc1.type = "sine";
  osc1.frequency.setValueAtTime(1200, t);
  osc1.frequency.exponentialRampToValueAtTime(900, t + 0.07);
  g1.gain.setValueAtTime(0.10, t);
  g1.gain.exponentialRampToValueAtTime(0.001, t + 0.10);
  osc1.connect(g1);
  g1.connect(ac.destination);
  osc1.start(t);
  osc1.stop(t + 0.12);

  // Тёплый нижний тон
  const osc2 = ac.createOscillator();
  const g2 = ac.createGain();
  osc2.type = "sine";
  osc2.frequency.setValueAtTime(600, t);
  osc2.frequency.exponentialRampToValueAtTime(400, t + 0.09);
  g2.gain.setValueAtTime(0.07, t);
  g2.gain.exponentialRampToValueAtTime(0.001, t + 0.12);
  osc2.connect(g2);
  g2.connect(ac.destination);
  osc2.start(t);
  osc2.stop(t + 0.14);

  setTimeout(() => ac.close(), 300);
}