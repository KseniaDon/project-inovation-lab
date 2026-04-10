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

  // Чёткий щелчок — короткий шумовой импульс
  const bufferSize = ac.sampleRate * 0.03;
  const buffer = ac.createBuffer(1, bufferSize, ac.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < bufferSize; i++) {
    data[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / bufferSize, 8);
  }
  const noise = ac.createBufferSource();
  noise.buffer = buffer;

  const filter = ac.createBiquadFilter();
  filter.type = "bandpass";
  filter.frequency.value = 3500;
  filter.Q.value = 0.8;

  const g = ac.createGain();
  g.gain.setValueAtTime(0.18, t);
  g.gain.exponentialRampToValueAtTime(0.001, t + 0.03);

  noise.connect(filter);
  filter.connect(g);
  g.connect(ac.destination);
  noise.start(t);
  noise.stop(t + 0.04);

  setTimeout(() => ac.close(), 200);
}