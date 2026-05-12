class SoundGenerator {
  constructor(audioContext) {
    this.audioContext = audioContext;
    this.gainNode = null;
    this.oscillators = [];
    this.buffers = [];
    this.timeouts = [];
    this.isPlaying = false;
    this.volume = 0.5;
  }

  createWhiteNoiseBuffer(duration = 4) {
    const bufferSize = this.audioContext.sampleRate * duration;
    const buffer = this.audioContext.createBuffer(2, bufferSize, this.audioContext.sampleRate);
    
    for (let channel = 0; channel < 2; channel++) {
      const data = buffer.getChannelData(channel);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = (Math.random() * 2 - 1) * 0.5;
      }
    }
    
    return buffer;
  }

  createPinkNoiseBuffer(duration = 4) {
    const bufferSize = this.audioContext.sampleRate * duration;
    const buffer = this.audioContext.createBuffer(2, bufferSize, this.audioContext.sampleRate);
    
    for (let channel = 0; channel < 2; channel++) {
      const data = buffer.getChannelData(channel);
      let b0, b1, b2, b3, b4, b5, b6;
      b0 = b1 = b2 = b3 = b4 = b5 = b6 = 0.0;
      
      for (let i = 0; i < bufferSize; i++) {
        const white = (Math.random() * 2 - 1) * 0.5;
        b0 = 0.99886 * b0 + white * 0.0555179;
        b1 = 0.99332 * b1 + white * 0.0750759;
        b2 = 0.96900 * b2 + white * 0.1538520;
        b3 = 0.86650 * b3 + white * 0.3104856;
        b4 = 0.55000 * b4 + white * 0.5329522;
        b5 = -0.7616 * b5 - white * 0.0168980;
        data[i] = b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362;
        data[i] *= 0.11;
        b6 = white * 0.115926;
      }
    }
    
    return buffer;
  }

  createBrownNoiseBuffer(duration = 4) {
    const bufferSize = this.audioContext.sampleRate * duration;
    const buffer = this.audioContext.createBuffer(2, bufferSize, this.audioContext.sampleRate);
    
    for (let channel = 0; channel < 2; channel++) {
      const data = buffer.getChannelData(channel);
      let lastOut = 0.0;
      
      for (let i = 0; i < bufferSize; i++) {
        const white = (Math.random() * 2 - 1) * 0.5;
        lastOut = (lastOut + (0.02 * white)) / 1.02;
        data[i] = lastOut * 3.5;
      }
    }
    
    return buffer;
  }

  createVioletNoiseBuffer(duration = 4) {
    const bufferSize = this.audioContext.sampleRate * duration;
    const buffer = this.audioContext.createBuffer(2, bufferSize, this.audioContext.sampleRate);
    
    for (let channel = 0; channel < 2; channel++) {
      const data = buffer.getChannelData(channel);
      let lastWhite = 0;
      
      for (let i = 0; i < bufferSize; i++) {
        const white = (Math.random() * 2 - 1) * 0.5;
        data[i] = (white - lastWhite) * 0.5;
        lastWhite = white;
      }
    }
    
    return buffer;
  }

  createGreyNoiseBuffer(duration = 4) {
    const bufferSize = this.audioContext.sampleRate * duration;
    const buffer = this.audioContext.createBuffer(2, bufferSize, this.audioContext.sampleRate);
    
    for (let channel = 0; channel < 2; channel++) {
      const data = buffer.getChannelData(channel);
      let b0, b1, b2, b3, b4, b5, b6;
      b0 = b1 = b2 = b3 = b4 = b5 = b6 = 0.0;
      
      for (let i = 0; i < bufferSize; i++) {
        const white = (Math.random() * 2 - 1) * 0.5;
        b0 = 0.99886 * b0 + white * 0.0555179;
        b1 = 0.99332 * b1 + white * 0.0750759;
        b2 = 0.96900 * b2 + white * 0.1538520;
        b3 = 0.86650 * b3 + white * 0.3104856;
        b4 = 0.55000 * b4 + white * 0.5329522;
        b5 = -0.7616 * b5 - white * 0.0168980;
        data[i] = b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362;
        data[i] *= 0.08;
        b6 = white * 0.115926;
      }
    }
    
    return buffer;
  }

  setVolume(volume) {
    this.volume = volume;
    if (this.gainNode) {
      this.gainNode.gain.setTargetAtTime(volume, this.audioContext.currentTime, 0.15);
    }
  }

  stop() {
    this.oscillators.forEach(osc => {
      try { osc.stop(); } catch (e) {}
    });
    this.buffers.forEach(source => {
      try { source.stop(); } catch (e) {}
    });
    this.timeouts.forEach(id => clearTimeout(id));
    this.oscillators = [];
    this.buffers = [];
    this.timeouts = [];
    this.isPlaying = false;
  }

  smoothStart(gainNode, targetVolume, duration = 0.3) {
    const now = this.audioContext.currentTime;
    gainNode.gain.setValueAtTime(0, now);
    gainNode.gain.linearRampToValueAtTime(targetVolume, now + duration);
  }
}

class RainSound extends SoundGenerator {
  play() {
    this.stop();
    this.isPlaying = true;
    
    this.gainNode = this.audioContext.createGain();
    this.gainNode.gain.value = 0;
    
    const pinkNoise = this.audioContext.createBufferSource();
    pinkNoise.buffer = this.createPinkNoiseBuffer(8);
    pinkNoise.loop = true;
    
    const mainFilter = this.audioContext.createBiquadFilter();
    mainFilter.type = 'lowpass';
    mainFilter.frequency.value = 1200;
    mainFilter.Q.value = 0.5;
    
    const highFilter = this.audioContext.createBiquadFilter();
    highFilter.type = 'highpass';
    highFilter.frequency.value = 100;
    
    const lfo1 = this.audioContext.createOscillator();
    lfo1.type = 'sine';
    lfo1.frequency.value = 0.15;
    
    const lfo1Gain = this.audioContext.createGain();
    lfo1Gain.gain.value = 300;
    
    lfo1.connect(lfo1Gain);
    lfo1Gain.connect(mainFilter.frequency);
    
    pinkNoise.connect(mainFilter);
    mainFilter.connect(highFilter);
    highFilter.connect(this.gainNode);
    this.gainNode.connect(this.audioContext.destination);
    
    pinkNoise.start();
    lfo1.start();
    
    this.buffers.push(pinkNoise);
    this.oscillators.push(lfo1);
    
    this.smoothStart(this.gainNode, this.volume);
    
    this.addRainDropsLayer1();
    this.addRainDropsLayer2();
    this.addThunderRumble();
  }

  addRainDropsLayer1() {
    if (!this.isPlaying) return;
    
    const dropGain = this.audioContext.createGain();
    
    const dropOsc = this.audioContext.createOscillator();
    dropOsc.type = 'sine';
    dropOsc.frequency.value = 1200 + Math.random() * 600;
    
    const dropFilter = this.audioContext.createBiquadFilter();
    dropFilter.type = 'lowpass';
    dropFilter.frequency.value = 2500;
    
    dropOsc.connect(dropFilter);
    dropFilter.connect(dropGain);
    dropGain.connect(this.audioContext.destination);
    
    const now = this.audioContext.currentTime;
    dropGain.gain.setValueAtTime(0, now);
    dropGain.gain.linearRampToValueAtTime(this.volume * 0.08, now + 0.008);
    dropGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.08);
    
    dropOsc.start(now);
    dropOsc.stop(now + 0.08);
    
    this.oscillators.push(dropOsc);
    
    const timeoutId = setTimeout(() => this.addRainDropsLayer1(), 30 + Math.random() * 60);
    this.timeouts.push(timeoutId);
  }

  addRainDropsLayer2() {
    if (!this.isPlaying) return;
    
    const dropGain = this.audioContext.createGain();
    
    const dropNoise = this.audioContext.createBufferSource();
    dropNoise.buffer = this.createWhiteNoiseBuffer(0.2);
    
    const dropFilter = this.audioContext.createBiquadFilter();
    dropFilter.type = 'bandpass';
    dropFilter.frequency.value = 800 + Math.random() * 400;
    dropFilter.Q.value = 2;
    
    dropNoise.connect(dropFilter);
    dropFilter.connect(dropGain);
    dropGain.connect(this.audioContext.destination);
    
    const now = this.audioContext.currentTime;
    dropGain.gain.setValueAtTime(0, now);
    dropGain.gain.linearRampToValueAtTime(this.volume * 0.06, now + 0.01);
    dropGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.12);
    
    dropNoise.start(now);
    dropNoise.stop(now + 0.12);
    
    this.buffers.push(dropNoise);
    
    const timeoutId2 = setTimeout(() => this.addRainDropsLayer2(), 80 + Math.random() * 150);
    this.timeouts.push(timeoutId2);
  }

  addThunderRumble() {
    if (!this.isPlaying) return;
    
    const rumbleGain = this.audioContext.createGain();
    
    const rumbleNoise = this.audioContext.createBufferSource();
    rumbleNoise.buffer = this.createBrownNoiseBuffer(2);
    
    const rumbleFilter = this.audioContext.createBiquadFilter();
    rumbleFilter.type = 'lowpass';
    rumbleFilter.frequency.value = 150;
    
    const rumbleFilter2 = this.audioContext.createBiquadFilter();
    rumbleFilter2.type = 'lowpass';
    rumbleFilter2.frequency.value = 80;
    
    rumbleNoise.connect(rumbleFilter);
    rumbleFilter.connect(rumbleFilter2);
    rumbleFilter2.connect(rumbleGain);
    rumbleGain.connect(this.audioContext.destination);
    
    const now = this.audioContext.currentTime;
    rumbleGain.gain.setValueAtTime(0, now);
    rumbleGain.gain.linearRampToValueAtTime(this.volume * 0.15, now + 1.5);
    rumbleGain.gain.linearRampToValueAtTime(0, now + 4);
    
    rumbleNoise.start(now);
    rumbleNoise.stop(now + 4);
    
    this.buffers.push(rumbleNoise);
    
    const timeoutId3 = setTimeout(() => this.addThunderRumble(), 15000 + Math.random() * 25000);
    this.timeouts.push(timeoutId3);
  }
}

class StreamSound extends SoundGenerator {
  play() {
    this.stop();
    this.isPlaying = true;
    
    this.gainNode = this.audioContext.createGain();
    this.gainNode.gain.value = 0;
    
    const noise1 = this.audioContext.createBufferSource();
    noise1.buffer = this.createPinkNoiseBuffer(8);
    noise1.loop = true;
    
    const noise2 = this.audioContext.createBufferSource();
    noise2.buffer = this.createWhiteNoiseBuffer(8);
    noise2.loop = true;
    
    const filter1 = this.audioContext.createBiquadFilter();
    filter1.type = 'bandpass';
    filter1.frequency.value = 500;
    filter1.Q.value = 0.4;
    
    const filter2 = this.audioContext.createBiquadFilter();
    filter2.type = 'bandpass';
    filter2.frequency.value = 1500;
    filter2.Q.value = 0.3;
    
    const mixGain = this.audioContext.createGain();
    mixGain.gain.value = 0.7;
    
    const lfo1 = this.audioContext.createOscillator();
    lfo1.type = 'sine';
    lfo1.frequency.value = 0.8;
    
    const lfo1Gain = this.audioContext.createGain();
    lfo1Gain.gain.value = 200;
    
    const lfo2 = this.audioContext.createOscillator();
    lfo2.type = 'sine';
    lfo2.frequency.value = 0.5;
    
    const lfo2Gain = this.audioContext.createGain();
    lfo2Gain.gain.value = 400;
    
    lfo1.connect(lfo1Gain);
    lfo1Gain.connect(filter1.frequency);
    
    lfo2.connect(lfo2Gain);
    lfo2Gain.connect(filter2.frequency);
    
    noise1.connect(filter1);
    noise2.connect(filter2);
    filter1.connect(mixGain);
    filter2.connect(mixGain);
    mixGain.connect(this.gainNode);
    this.gainNode.connect(this.audioContext.destination);
    
    noise1.start();
    noise2.start();
    lfo1.start();
    lfo2.start();
    
    this.buffers.push(noise1, noise2);
    this.oscillators.push(lfo1, lfo2);
    
    this.smoothStart(this.gainNode, this.volume);
    
    this.addBubbles();
    this.addWaterDrips();
  }

  addBubbles() {
    if (!this.isPlaying) return;
    
    const bubbleGain = this.audioContext.createGain();
    
    const bubbleOsc = this.audioContext.createOscillator();
    bubbleOsc.type = 'sine';
    bubbleOsc.frequency.value = 400 + Math.random() * 300;
    
    bubbleOsc.connect(bubbleGain);
    bubbleGain.connect(this.audioContext.destination);
    
    const now = this.audioContext.currentTime;
    const duration = 0.15;
    
    bubbleGain.gain.setValueAtTime(0, now);
    bubbleGain.gain.linearRampToValueAtTime(this.volume * 0.08, now + 0.02);
    bubbleGain.gain.exponentialRampToValueAtTime(0.0001, now + duration);
    
    bubbleOsc.frequency.setValueAtTime(400 + Math.random() * 300, now);
    bubbleOsc.frequency.exponentialRampToValueAtTime(800 + Math.random() * 400, now + duration);
    
    bubbleOsc.start(now);
    bubbleOsc.stop(now + duration);
    
    this.oscillators.push(bubbleOsc);
    
    const timeoutId = setTimeout(() => this.addBubbles(), 300 + Math.random() * 500);
    this.timeouts.push(timeoutId);
  }

  addWaterDrips() {
    if (!this.isPlaying) return;
    
    const dripGain = this.audioContext.createGain();
    
    const dripOsc = this.audioContext.createOscillator();
    dripOsc.type = 'sine';
    
    const dripFilter = this.audioContext.createBiquadFilter();
    dripFilter.type = 'lowpass';
    dripFilter.frequency.value = 2000;
    
    dripOsc.connect(dripFilter);
    dripFilter.connect(dripGain);
    dripGain.connect(this.audioContext.destination);
    
    const now = this.audioContext.currentTime;
    
    dripGain.gain.setValueAtTime(0, now);
    dripGain.gain.linearRampToValueAtTime(this.volume * 0.1, now + 0.005);
    dripGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.2);
    
    dripOsc.frequency.setValueAtTime(1500, now);
    dripOsc.frequency.exponentialRampToValueAtTime(300, now + 0.2);
    
    dripOsc.start(now);
    dripOsc.stop(now + 0.2);
    
    this.oscillators.push(dripOsc);
    
    const timeoutId2 = setTimeout(() => this.addWaterDrips(), 2000 + Math.random() * 3000);
    this.timeouts.push(timeoutId2);
  }
}

class ForestSound extends SoundGenerator {
  play() {
    this.stop();
    this.isPlaying = true;
    
    this.gainNode = this.audioContext.createGain();
    this.gainNode.gain.value = 0;
    
    const windNoise = this.audioContext.createBufferSource();
    windNoise.buffer = this.createPinkNoiseBuffer(8);
    windNoise.loop = true;
    
    const windFilter = this.audioContext.createBiquadFilter();
    windFilter.type = 'lowpass';
    windFilter.frequency.value = 400;
    
    const windFilter2 = this.audioContext.createBiquadFilter();
    windFilter2.type = 'highpass';
    windFilter2.frequency.value = 50;
    
    const windLfo = this.audioContext.createOscillator();
    windLfo.type = 'sine';
    windLfo.frequency.value = 0.12;
    
    const windLfoGain = this.audioContext.createGain();
    windLfoGain.gain.value = 150;
    
    const windLfo2 = this.audioContext.createOscillator();
    windLfo2.type = 'sine';
    windLfo2.frequency.value = 0.07;
    
    const windLfo2Gain = this.audioContext.createGain();
    windLfo2Gain.gain.value = this.volume * 0.3;
    
    windLfo.connect(windLfoGain);
    windLfoGain.connect(windFilter.frequency);
    
    windNoise.connect(windFilter);
    windFilter.connect(windFilter2);
    windFilter2.connect(this.gainNode);
    
    windLfo2.connect(windLfo2Gain);
    windLfo2Gain.connect(this.gainNode.gain);
    
    this.gainNode.connect(this.audioContext.destination);
    
    windNoise.start();
    windLfo.start();
    windLfo2.start();
    
    this.buffers.push(windNoise);
    this.oscillators.push(windLfo, windLfo2);
    
    this.smoothStart(this.gainNode, this.volume);
    
    this.addBirdSounds();
    this.addCricketSounds();
    this.addLeavesRustle();
    this.addFrogSounds();
  }

  addBirdSounds() {
    if (!this.isPlaying) return;
    
    const birdGain = this.audioContext.createGain();
    
    const birdOsc = this.audioContext.createOscillator();
    birdOsc.type = 'sine';
    
    const birdFilter = this.audioContext.createBiquadFilter();
    birdFilter.type = 'highpass';
    birdFilter.frequency.value = 1500;
    
    birdOsc.connect(birdFilter);
    birdFilter.connect(birdGain);
    birdGain.connect(this.audioContext.destination);
    
    const now = this.audioContext.currentTime;
    const duration = 0.2;
    
    birdGain.gain.setValueAtTime(0, now);
    birdGain.gain.linearRampToValueAtTime(this.volume * 0.12, now + 0.02);
    birdGain.gain.linearRampToValueAtTime(this.volume * 0.08, now + duration / 2);
    birdGain.gain.exponentialRampToValueAtTime(0.0001, now + duration);
    
    const startFreq = 2500 + Math.random() * 800;
    birdOsc.frequency.setValueAtTime(startFreq, now);
    birdOsc.frequency.linearRampToValueAtTime(startFreq + 300 + Math.random() * 400, now + duration * 0.3);
    birdOsc.frequency.linearRampToValueAtTime(startFreq + 100, now + duration);
    
    birdOsc.start(now);
    birdOsc.stop(now + duration);
    
    this.oscillators.push(birdOsc);
    
    if (Math.random() > 0.5) {
    const timeoutId = setTimeout(() => this.addBirdSounds(), 150);
    this.timeouts.push(timeoutId);
    } else {
      const timeoutId2 = setTimeout(() => this.addBirdSounds(), 4000 + Math.random() * 6000);
      this.timeouts.push(timeoutId2);
    }
  }

  addCricketSounds() {
    if (!this.isPlaying) return;
    
    const cricketGain = this.audioContext.createGain();
    
    const cricketOsc = this.audioContext.createOscillator();
    cricketOsc.type = 'triangle';
    
    const cricketFilter = this.audioContext.createBiquadFilter();
    cricketFilter.type = 'bandpass';
    cricketFilter.frequency.value = 5000;
    cricketFilter.Q.value = 8;
    
    cricketOsc.connect(cricketFilter);
    cricketFilter.connect(cricketGain);
    cricketGain.connect(this.audioContext.destination);
    
    const now = this.audioContext.currentTime;
    const chirpDuration = 0.04;
    
    for (let i = 0; i < 4; i++) {
      const startTime = now + i * 0.08;
      cricketGain.gain.setValueAtTime(0, startTime);
      cricketGain.gain.linearRampToValueAtTime(this.volume * 0.06, startTime + 0.008);
      cricketGain.gain.exponentialRampToValueAtTime(0.0001, startTime + chirpDuration);
    }
    
    cricketOsc.frequency.value = 4500 + Math.random() * 1000;
    cricketOsc.start(now);
    cricketOsc.stop(now + 0.5);
    
    this.oscillators.push(cricketOsc);
    
    const timeoutId3 = setTimeout(() => this.addCricketSounds(), 800 + Math.random() * 1200);
    this.timeouts.push(timeoutId3);
  }

  addLeavesRustle() {
    if (!this.isPlaying) return;
    
    const leavesGain = this.audioContext.createGain();
    
    const leavesNoise = this.audioContext.createBufferSource();
    leavesNoise.buffer = this.createWhiteNoiseBuffer(0.3);
    
    const leavesFilter = this.audioContext.createBiquadFilter();
    leavesFilter.type = 'highpass';
    leavesFilter.frequency.value = 2000;
    
    const leavesFilter2 = this.audioContext.createBiquadFilter();
    leavesFilter2.type = 'lowpass';
    leavesFilter2.frequency.value = 6000;
    
    leavesNoise.connect(leavesFilter);
    leavesFilter.connect(leavesFilter2);
    leavesFilter2.connect(leavesGain);
    leavesGain.connect(this.audioContext.destination);
    
    const now = this.audioContext.currentTime;
    leavesGain.gain.setValueAtTime(0, now);
    leavesGain.gain.linearRampToValueAtTime(this.volume * 0.08, now + 0.05);
    leavesGain.gain.linearRampToValueAtTime(0, now + 0.3);
    
    leavesNoise.start(now);
    leavesNoise.stop(now + 0.3);
    
    this.buffers.push(leavesNoise);
    
    const timeoutId4 = setTimeout(() => this.addLeavesRustle(), 500 + Math.random() * 1000);
    this.timeouts.push(timeoutId4);
  }

  addFrogSounds() {
    if (!this.isPlaying) return;
    
    const frogGain = this.audioContext.createGain();
    
    const frogOsc = this.audioContext.createOscillator();
    frogOsc.type = 'square';
    
    const frogFilter = this.audioContext.createBiquadFilter();
    frogFilter.type = 'lowpass';
    frogFilter.frequency.value = 800;
    
    frogOsc.connect(frogFilter);
    frogFilter.connect(frogGain);
    frogGain.connect(this.audioContext.destination);
    
    const now = this.audioContext.currentTime;
    
    for (let i = 0; i < 3; i++) {
      const startTime = now + i * 0.15;
      frogGain.gain.setValueAtTime(0, startTime);
      frogGain.gain.linearRampToValueAtTime(this.volume * 0.1, startTime + 0.02);
      frogGain.gain.exponentialRampToValueAtTime(0.0001, startTime + 0.12);
    }
    
    frogOsc.frequency.value = 300 + Math.random() * 100;
    frogOsc.start(now);
    frogOsc.stop(now + 0.6);
    
    this.oscillators.push(frogOsc);
    
    const timeoutId5 = setTimeout(() => this.addFrogSounds(), 8000 + Math.random() * 12000);
    this.timeouts.push(timeoutId5);
  }
}

class WhiteNoiseSound extends SoundGenerator {
  play() {
    this.stop();
    this.isPlaying = true;
    
    this.gainNode = this.audioContext.createGain();
    this.gainNode.gain.value = 0;
    
    const noise = this.audioContext.createBufferSource();
    noise.buffer = this.createWhiteNoiseBuffer(8);
    noise.loop = true;
    
    const filter = this.audioContext.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.value = 8000;
    
    noise.connect(filter);
    filter.connect(this.gainNode);
    this.gainNode.connect(this.audioContext.destination);
    
    noise.start();
    this.buffers.push(noise);
    
    this.smoothStart(this.gainNode, this.volume * 0.6);
  }
}

class PinkNoiseSound extends SoundGenerator {
  play() {
    this.stop();
    this.isPlaying = true;
    
    this.gainNode = this.audioContext.createGain();
    this.gainNode.gain.value = 0;
    
    const noise = this.audioContext.createBufferSource();
    noise.buffer = this.createPinkNoiseBuffer(8);
    noise.loop = true;
    
    const filter = this.audioContext.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.value = 5000;
    
    noise.connect(filter);
    filter.connect(this.gainNode);
    this.gainNode.connect(this.audioContext.destination);
    
    noise.start();
    this.buffers.push(noise);
    
    this.smoothStart(this.gainNode, this.volume);
  }
}

class BrownNoiseSound extends SoundGenerator {
  play() {
    this.stop();
    this.isPlaying = true;
    
    this.gainNode = this.audioContext.createGain();
    this.gainNode.gain.value = 0;
    
    const noise = this.audioContext.createBufferSource();
    noise.buffer = this.createBrownNoiseBuffer(8);
    noise.loop = true;
    
    const filter = this.audioContext.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.value = 400;
    
    noise.connect(filter);
    filter.connect(this.gainNode);
    this.gainNode.connect(this.audioContext.destination);
    
    noise.start();
    this.buffers.push(noise);
    
    this.smoothStart(this.gainNode, this.volume);
  }
}

class VioletNoiseSound extends SoundGenerator {
  play() {
    this.stop();
    this.isPlaying = true;
    
    this.gainNode = this.audioContext.createGain();
    this.gainNode.gain.value = 0;
    
    const noise = this.audioContext.createBufferSource();
    noise.buffer = this.createVioletNoiseBuffer(8);
    noise.loop = true;
    
    const filter = this.audioContext.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.value = 10000;
    
    noise.connect(filter);
    filter.connect(this.gainNode);
    this.gainNode.connect(this.audioContext.destination);
    
    noise.start();
    this.buffers.push(noise);
    
    this.smoothStart(this.gainNode, this.volume * 0.4);
  }
}

class GreyNoiseSound extends SoundGenerator {
  play() {
    this.stop();
    this.isPlaying = true;
    
    this.gainNode = this.audioContext.createGain();
    this.gainNode.gain.value = 0;
    
    const noise = this.audioContext.createBufferSource();
    noise.buffer = this.createGreyNoiseBuffer(8);
    noise.loop = true;
    
    const filter = this.audioContext.createBiquadFilter();
    filter.type = 'peaking';
    filter.frequency.value = 2000;
    filter.Q.value = 0.5;
    filter.gain.value = 3;
    
    noise.connect(filter);
    filter.connect(this.gainNode);
    this.gainNode.connect(this.audioContext.destination);
    
    noise.start();
    this.buffers.push(noise);
    
    this.smoothStart(this.gainNode, this.volume);
  }
}

class FireSound extends SoundGenerator {
  play() {
    this.stop();
    this.isPlaying = true;
    
    this.gainNode = this.audioContext.createGain();
    this.gainNode.gain.value = 0;
    
    const roarNoise = this.audioContext.createBufferSource();
    roarNoise.buffer = this.createBrownNoiseBuffer(8);
    roarNoise.loop = true;
    
    const roarFilter = this.audioContext.createBiquadFilter();
    roarFilter.type = 'lowpass';
    roarFilter.frequency.value = 250;
    
    const roarFilter2 = this.audioContext.createBiquadFilter();
    roarFilter2.type = 'highpass';
    roarFilter2.frequency.value = 40;
    
    const roarLfo = this.audioContext.createOscillator();
    roarLfo.type = 'sine';
    roarLfo.frequency.value = 3;
    
    const roarLfoGain = this.audioContext.createGain();
    roarLfoGain.gain.value = 50;
    
    roarLfo.connect(roarLfoGain);
    roarLfoGain.connect(roarFilter.frequency);
    
    roarNoise.connect(roarFilter);
    roarFilter.connect(roarFilter2);
    roarFilter2.connect(this.gainNode);
    this.gainNode.connect(this.audioContext.destination);
    
    roarNoise.start();
    roarLfo.start();
    
    this.buffers.push(roarNoise);
    this.oscillators.push(roarLfo);
    
    this.smoothStart(this.gainNode, this.volume);
    
    this.addCracklesLayer1();
    this.addCracklesLayer2();
    this.addWoodPops();
  }

  addCracklesLayer1() {
    if (!this.isPlaying) return;
    
    const crackleGain = this.audioContext.createGain();
    
    const crackleNoise = this.audioContext.createBufferSource();
    crackleNoise.buffer = this.createWhiteNoiseBuffer(0.1);
    
    const crackleFilter = this.audioContext.createBiquadFilter();
    crackleFilter.type = 'highpass';
    crackleFilter.frequency.value = 1500;
    
    crackleNoise.connect(crackleFilter);
    crackleFilter.connect(crackleGain);
    crackleGain.connect(this.audioContext.destination);
    
    const now = this.audioContext.currentTime;
    crackleGain.gain.setValueAtTime(0, now);
    crackleGain.gain.linearRampToValueAtTime(this.volume * 0.25, now + 0.003);
    crackleGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.08);
    
    crackleNoise.start(now);
    crackleNoise.stop(now + 0.08);
    
    this.buffers.push(crackleNoise);
    
    const timeoutId = setTimeout(() => this.addCracklesLayer1(), 50 + Math.random() * 100);
    this.timeouts.push(timeoutId);
  }

  addCracklesLayer2() {
    if (!this.isPlaying) return;
    
    const crackleGain = this.audioContext.createGain();
    
    const crackleNoise = this.audioContext.createBufferSource();
    crackleNoise.buffer = this.createWhiteNoiseBuffer(0.15);
    
    const crackleFilter = this.audioContext.createBiquadFilter();
    crackleFilter.type = 'bandpass';
    crackleFilter.frequency.value = 800;
    crackleFilter.Q.value = 2;
    
    crackleNoise.connect(crackleFilter);
    crackleFilter.connect(crackleGain);
    crackleGain.connect(this.audioContext.destination);
    
    const now = this.audioContext.currentTime;
    crackleGain.gain.setValueAtTime(0, now);
    crackleGain.gain.linearRampToValueAtTime(this.volume * 0.15, now + 0.005);
    crackleGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.12);
    
    crackleNoise.start(now);
    crackleNoise.stop(now + 0.12);
    
    this.buffers.push(crackleNoise);
    
    const timeoutId = setTimeout(() => this.addCracklesLayer2(), 150 + Math.random() * 250);
    this.timeouts.push(timeoutId);
  }

  addWoodPops() {
    if (!this.isPlaying) return;
    
    const popGain = this.audioContext.createGain();
    
    const popNoise = this.audioContext.createBufferSource();
    popNoise.buffer = this.createWhiteNoiseBuffer(0.3);
    
    const popFilter = this.audioContext.createBiquadFilter();
    popFilter.type = 'lowpass';
    popFilter.frequency.value = 600;
    
    const popFilter2 = this.audioContext.createBiquadFilter();
    popFilter2.type = 'highpass';
    popFilter2.frequency.value = 100;
    
    popNoise.connect(popFilter);
    popFilter.connect(popFilter2);
    popFilter2.connect(popGain);
    popGain.connect(this.audioContext.destination);
    
    const now = this.audioContext.currentTime;
    popGain.gain.setValueAtTime(0, now);
    popGain.gain.linearRampToValueAtTime(this.volume * 0.35, now + 0.008);
    popGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.3);
    
    popNoise.start(now);
    popNoise.stop(now + 0.3);
    
    this.buffers.push(popNoise);
    
    const timeoutId = setTimeout(() => this.addWoodPops(), 3000 + Math.random() * 5000);
    this.timeouts.push(timeoutId);
  }
}

class WaveSound extends SoundGenerator {
  play() {
    this.stop();
    this.isPlaying = true;
    
    this.gainNode = this.audioContext.createGain();
    this.gainNode.gain.value = 0;
    
    const surfNoise = this.audioContext.createBufferSource();
    surfNoise.buffer = this.createPinkNoiseBuffer(8);
    surfNoise.loop = true;
    
    const surfFilter = this.audioContext.createBiquadFilter();
    surfFilter.type = 'lowpass';
    surfFilter.frequency.value = 800;
    
    const waveLfo = this.audioContext.createOscillator();
    waveLfo.type = 'sine';
    waveLfo.frequency.value = 0.08;
    
    const waveLfoGain = this.audioContext.createGain();
    waveLfoGain.gain.value = this.volume * 0.6;
    
    const waveLfo2 = this.audioContext.createOscillator();
    waveLfo2.type = 'sine';
    waveLfo2.frequency.value = 0.12;
    
    const waveLfo2Gain = this.audioContext.createGain();
    waveLfo2Gain.gain.value = 400;
    
    waveLfo2.connect(waveLfo2Gain);
    waveLfo2Gain.connect(surfFilter.frequency);
    
    waveLfo.connect(waveLfoGain);
    waveLfoGain.connect(this.gainNode.gain);
    
    surfNoise.connect(surfFilter);
    surfFilter.connect(this.gainNode);
    this.gainNode.connect(this.audioContext.destination);
    
    surfNoise.start();
    waveLfo.start();
    waveLfo2.start();
    
    this.buffers.push(surfNoise);
    this.oscillators.push(waveLfo, waveLfo2);
    
    this.smoothStart(this.gainNode, this.volume * 0.5);
    
    this.addWaveCrash();
  }

  addWaveCrash() {
    if (!this.isPlaying) return;
    
    const crashGain = this.audioContext.createGain();
    
    const crashNoise = this.audioContext.createBufferSource();
    crashNoise.buffer = this.createWhiteNoiseBuffer(1.5);
    
    const crashFilter = this.audioContext.createBiquadFilter();
    crashFilter.type = 'lowpass';
    crashFilter.frequency.value = 3000;
    
    crashNoise.connect(crashFilter);
    crashFilter.connect(crashGain);
    crashGain.connect(this.audioContext.destination);
    
    const now = this.audioContext.currentTime;
    crashGain.gain.setValueAtTime(0, now);
    crashGain.gain.linearRampToValueAtTime(this.volume * 0.2, now + 0.3);
    crashGain.gain.linearRampToValueAtTime(0, now + 1.5);
    
    crashFilter.frequency.setValueAtTime(1000, now);
    crashFilter.frequency.linearRampToValueAtTime(4000, now + 0.5);
    crashFilter.frequency.linearRampToValueAtTime(500, now + 1.5);
    
    crashNoise.start(now);
    crashNoise.stop(now + 1.5);
    
    this.buffers.push(crashNoise);
    
    const timeoutId = setTimeout(() => this.addWaveCrash(), 12000 + Math.random() * 8000);
    this.timeouts.push(timeoutId);
  }
}

class FanSound extends SoundGenerator {
  play() {
    this.stop();
    this.isPlaying = true;
    
    this.gainNode = this.audioContext.createGain();
    this.gainNode.gain.value = 0;
    
    const noise1 = this.audioContext.createBufferSource();
    noise1.buffer = this.createPinkNoiseBuffer(8);
    noise1.loop = true;
    
    const noise2 = this.audioContext.createBufferSource();
    noise2.buffer = this.createBrownNoiseBuffer(8);
    noise2.loop = true;
    
    const filter1 = this.audioContext.createBiquadFilter();
    filter1.type = 'lowpass';
    filter1.frequency.value = 300;
    
    const filter2 = this.audioContext.createBiquadFilter();
    filter2.type = 'bandpass';
    filter2.frequency.value = 120;
    filter2.Q.value = 3;
    
    const humOsc = this.audioContext.createOscillator();
    humOsc.type = 'sine';
    humOsc.frequency.value = 60;
    
    const humOsc2 = this.audioContext.createOscillator();
    humOsc2.type = 'sine';
    humOsc2.frequency.value = 120;
    
    const humGain = this.audioContext.createGain();
    humGain.gain.value = 0.1;
    
    const humGain2 = this.audioContext.createGain();
    humGain2.gain.value = 0.05;
    
    const mixGain = this.audioContext.createGain();
    mixGain.gain.value = 0.8;
    
    const motorLfo = this.audioContext.createOscillator();
    motorLfo.type = 'sine';
    motorLfo.frequency.value = 20;
    
    const motorLfoGain = this.audioContext.createGain();
    motorLfoGain.gain.value = 10;
    
    motorLfo.connect(motorLfoGain);
    motorLfoGain.connect(filter2.frequency);
    
    noise1.connect(filter1);
    noise2.connect(filter2);
    humOsc.connect(humGain);
    humOsc2.connect(humGain2);
    
    filter1.connect(mixGain);
    filter2.connect(mixGain);
    humGain.connect(mixGain);
    humGain2.connect(mixGain);
    
    mixGain.connect(this.gainNode);
    this.gainNode.connect(this.audioContext.destination);
    
    noise1.start();
    noise2.start();
    humOsc.start();
    humOsc2.start();
    motorLfo.start();
    
    this.buffers.push(noise1, noise2);
    this.oscillators.push(humOsc, humOsc2, motorLfo);
    
    this.smoothStart(this.gainNode, this.volume);
  }
}

class AirConditionerSound extends SoundGenerator {
  play() {
    this.stop();
    this.isPlaying = true;
    
    this.gainNode = this.audioContext.createGain();
    this.gainNode.gain.value = 0;
    
    const noise = this.audioContext.createBufferSource();
    noise.buffer = this.createPinkNoiseBuffer(8);
    noise.loop = true;
    
    const filter1 = this.audioContext.createBiquadFilter();
    filter1.type = 'lowpass';
    filter1.frequency.value = 500;
    
    const filter2 = this.audioContext.createBiquadFilter();
    filter2.type = 'bandpass';
    filter2.frequency.value = 250;
    filter2.Q.value = 5;
    
    const compressorOsc = this.audioContext.createOscillator();
    compressorOsc.type = 'sine';
    compressorOsc.frequency.value = 50;
    
    const compressorGain = this.audioContext.createGain();
    compressorGain.gain.value = 0.08;
    
    const mixGain = this.audioContext.createGain();
    mixGain.gain.value = 0.9;
    
    noise.connect(filter1);
    filter1.connect(filter2);
    filter2.connect(mixGain);
    compressorOsc.connect(compressorGain);
    compressorGain.connect(mixGain);
    mixGain.connect(this.gainNode);
    this.gainNode.connect(this.audioContext.destination);
    
    noise.start();
    compressorOsc.start();
    
    this.buffers.push(noise);
    this.oscillators.push(compressorOsc);
    
    this.smoothStart(this.gainNode, this.volume);
    
    this.addVentSounds();
  }

  addVentSounds() {
    if (!this.isPlaying) return;
    
    const ventGain = this.audioContext.createGain();
    
    const ventNoise = this.audioContext.createBufferSource();
    ventNoise.buffer = this.createWhiteNoiseBuffer(0.2);
    
    const ventFilter = this.audioContext.createBiquadFilter();
    ventFilter.type = 'highpass';
    ventFilter.frequency.value = 1500;
    
    ventNoise.connect(ventFilter);
    ventFilter.connect(ventGain);
    ventGain.connect(this.audioContext.destination);
    
    const now = this.audioContext.currentTime;
    ventGain.gain.setValueAtTime(0, now);
    ventGain.gain.linearRampToValueAtTime(this.volume * 0.05, now + 0.05);
    ventGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.2);
    
    ventNoise.start(now);
    ventNoise.stop(now + 0.2);
    
    this.buffers.push(ventNoise);
    
    const timeoutId = setTimeout(() => this.addVentSounds(), 1000 + Math.random() * 2000);
    this.timeouts.push(timeoutId);
  }
}

class CafeSound extends SoundGenerator {
  play() {
    this.stop();
    this.isPlaying = true;
    
    this.gainNode = this.audioContext.createGain();
    this.gainNode.gain.value = 0;
    
    const noise = this.audioContext.createBufferSource();
    noise.buffer = this.createPinkNoiseBuffer(8);
    noise.loop = true;
    
    const filter = this.audioContext.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.value = 1000;
    
    const filter2 = this.audioContext.createBiquadFilter();
    filter2.type = 'highpass';
    filter2.frequency.value = 200;
    
    noise.connect(filter);
    filter.connect(filter2);
    filter2.connect(this.gainNode);
    this.gainNode.connect(this.audioContext.destination);
    
    noise.start();
    this.buffers.push(noise);
    
    this.smoothStart(this.gainNode, this.volume * 0.7);
    
    this.addCoffeeSips();
    this.addDishes();
    this.addMurmurs();
    this.addCupPlace();
  }

  addCoffeeSips() {
    if (!this.isPlaying) return;
    
    const sipGain = this.audioContext.createGain();
    
    const sipNoise = this.audioContext.createBufferSource();
    sipNoise.buffer = this.createWhiteNoiseBuffer(0.3);
    
    const sipFilter = this.audioContext.createBiquadFilter();
    sipFilter.type = 'bandpass';
    sipFilter.frequency.value = 2000;
    sipFilter.Q.value = 3;
    
    sipNoise.connect(sipFilter);
    sipFilter.connect(sipGain);
    sipGain.connect(this.audioContext.destination);
    
    const now = this.audioContext.currentTime;
    sipGain.gain.setValueAtTime(0, now);
    sipGain.gain.linearRampToValueAtTime(this.volume * 0.1, now + 0.05);
    sipGain.gain.linearRampToValueAtTime(0, now + 0.3);
    
    sipNoise.start(now);
    sipNoise.stop(now + 0.3);
    
    this.buffers.push(sipNoise);
    
    const timeoutId = setTimeout(() => this.addCoffeeSips(), 5000 + Math.random() * 8000);
    this.timeouts.push(timeoutId);
  }

  addDishes() {
    if (!this.isPlaying) return;
    
    const dishGain = this.audioContext.createGain();
    
    const dishOsc = this.audioContext.createOscillator();
    dishOsc.type = 'sine';
    dishOsc.frequency.value = 3000 + Math.random() * 1000;
    
    dishOsc.connect(dishGain);
    dishGain.connect(this.audioContext.destination);
    
    const now = this.audioContext.currentTime;
    dishGain.gain.setValueAtTime(0, now);
    dishGain.gain.linearRampToValueAtTime(this.volume * 0.08, now + 0.005);
    dishGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.15);
    
    dishOsc.start(now);
    dishOsc.stop(now + 0.15);
    
    this.oscillators.push(dishOsc);
    
    const timeoutId2 = setTimeout(() => this.addDishes(), 8000 + Math.random() * 12000);
    this.timeouts.push(timeoutId2);
  }

  addMurmurs() {
    if (!this.isPlaying) return;
    
    const murmurGain = this.audioContext.createGain();
    
    const murmurOsc = this.audioContext.createOscillator();
    murmurOsc.type = 'sine';
    murmurOsc.frequency.value = 150 + Math.random() * 100;
    
    const murmurFilter = this.audioContext.createBiquadFilter();
    murmurFilter.type = 'lowpass';
    murmurFilter.frequency.value = 500;
    
    murmurOsc.connect(murmurFilter);
    murmurFilter.connect(murmurGain);
    murmurGain.connect(this.audioContext.destination);
    
    const now = this.audioContext.currentTime;
    const duration = 0.5 + Math.random() * 0.5;
    
    murmurGain.gain.setValueAtTime(0, now);
    murmurGain.gain.linearRampToValueAtTime(this.volume * 0.04, now + 0.1);
    murmurGain.gain.linearRampToValueAtTime(0, now + duration);
    
    murmurOsc.frequency.setValueAtTime(150 + Math.random() * 100, now);
    murmurOsc.frequency.linearRampToValueAtTime(200 + Math.random() * 150, now + duration);
    
    murmurOsc.start(now);
    murmurOsc.stop(now + duration);
    
    this.oscillators.push(murmurOsc);
    
    const timeoutId3 = setTimeout(() => this.addMurmurs(), 2000 + Math.random() * 4000);
    this.timeouts.push(timeoutId3);
  }

  addCupPlace() {
    if (!this.isPlaying) return;
    
    const cupGain = this.audioContext.createGain();
    
    const cupOsc = this.audioContext.createOscillator();
    cupOsc.type = 'triangle';
    cupOsc.frequency.value = 800;
    
    cupOsc.connect(cupGain);
    cupGain.connect(this.audioContext.destination);
    
    const now = this.audioContext.currentTime;
    cupGain.gain.setValueAtTime(0, now);
    cupGain.gain.linearRampToValueAtTime(this.volume * 0.1, now + 0.008);
    cupGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.1);
    
    cupOsc.start(now);
    cupOsc.stop(now + 0.1);
    
    this.oscillators.push(cupOsc);
    
    const timeoutId4 = setTimeout(() => this.addCupPlace(), 6000 + Math.random() * 10000);
    this.timeouts.push(timeoutId4);
  }
}

class ClockSound extends SoundGenerator {
  play() {
    this.stop();
    this.isPlaying = true;
    
    this.gainNode = this.audioContext.createGain();
    this.gainNode.gain.value = 0;
    this.gainNode.connect(this.audioContext.destination);
    
    this.tickCount = 0;
    this.doTick();
    
    this.smoothStart(this.gainNode, this.volume);
  }

  doTick() {
    if (!this.isPlaying) return;
    
    const tickGain = this.audioContext.createGain();
    
    const tickOsc = this.audioContext.createOscillator();
    tickOsc.type = 'sine';
    tickOsc.frequency.value = this.tickCount % 2 === 0 ? 2500 : 2000;
    
    const tickFilter = this.audioContext.createBiquadFilter();
    tickFilter.type = 'highpass';
    tickFilter.frequency.value = 1000;
    
    tickOsc.connect(tickFilter);
    tickFilter.connect(tickGain);
    tickGain.connect(this.audioContext.destination);
    
    const now = this.audioContext.currentTime;
    tickGain.gain.setValueAtTime(0, now);
    tickGain.gain.linearRampToValueAtTime(this.volume * 0.15, now + 0.002);
    tickGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.05);
    
    tickOsc.start(now);
    tickOsc.stop(now + 0.05);
    
    this.oscillators.push(tickOsc);
    this.tickCount++;
    
    const timeoutId = setTimeout(() => this.doTick(), 1000);
    this.timeouts.push(timeoutId);
  }
}

class UnderwaterSound extends SoundGenerator {
  play() {
    this.stop();
    this.isPlaying = true;
    
    this.gainNode = this.audioContext.createGain();
    this.gainNode.gain.value = 0;
    
    const noise = this.audioContext.createBufferSource();
    noise.buffer = this.createBrownNoiseBuffer(8);
    noise.loop = true;
    
    const filter1 = this.audioContext.createBiquadFilter();
    filter1.type = 'lowpass';
    filter1.frequency.value = 300;
    
    const filter2 = this.audioContext.createBiquadFilter();
    filter2.type = 'peaking';
    filter2.frequency.value = 150;
    filter2.Q.value = 2;
    filter2.gain.value = 6;
    
    const pressureLfo = this.audioContext.createOscillator();
    pressureLfo.type = 'sine';
    pressureLfo.frequency.value = 0.2;
    
    const pressureLfoGain = this.audioContext.createGain();
    pressureLfoGain.gain.value = 50;
    
    pressureLfo.connect(pressureLfoGain);
    pressureLfoGain.connect(filter1.frequency);
    
    noise.connect(filter1);
    filter1.connect(filter2);
    filter2.connect(this.gainNode);
    this.gainNode.connect(this.audioContext.destination);
    
    noise.start();
    pressureLfo.start();
    
    this.buffers.push(noise);
    this.oscillators.push(pressureLfo);
    
    this.smoothStart(this.gainNode, this.volume);
    
    this.addBubbles();
  }

  addBubbles() {
    if (!this.isPlaying) return;
    
    const bubbleGain = this.audioContext.createGain();
    
    const bubbleOsc = this.audioContext.createOscillator();
    bubbleOsc.type = 'sine';
    
    bubbleOsc.connect(bubbleGain);
    bubbleGain.connect(this.audioContext.destination);
    
    const now = this.audioContext.currentTime;
    const duration = 0.2 + Math.random() * 0.2;
    
    bubbleGain.gain.setValueAtTime(0, now);
    bubbleGain.gain.linearRampToValueAtTime(this.volume * 0.12, now + 0.03);
    bubbleGain.gain.exponentialRampToValueAtTime(0.0001, now + duration);
    
    bubbleOsc.frequency.setValueAtTime(300 + Math.random() * 200, now);
    bubbleOsc.frequency.exponentialRampToValueAtTime(800 + Math.random() * 400, now + duration);
    
    bubbleOsc.start(now);
    bubbleOsc.stop(now + duration);
    
    this.oscillators.push(bubbleOsc);
    
    const timeoutId = setTimeout(() => this.addBubbles(), 500 + Math.random() * 1000);
    this.timeouts.push(timeoutId);
  }
}

class RelaxMusicApp {
  constructor() {
    this.audioContext = null;
    this.sounds = {};
    this.activeSounds = new Set();
    this.timerInterval = null;
    this.remainingTime = 0;
    this.masterVolume = 0.7;
    
    this.soundConfigs = [
      { id: 'rain', name: '雨声', icon: '🌧️', class: RainSound },
      { id: 'stream', name: '溪流', icon: '💧', class: StreamSound },
      { id: 'forest', name: '森林', icon: '🌲', class: ForestSound },
      { id: 'fire', name: '篝火', icon: '🔥', class: FireSound },
      { id: 'wave', name: '海浪', icon: '🌊', class: WaveSound },
      { id: 'fan', name: '风扇', icon: '🌀', class: FanSound },
      { id: 'ac', name: '空调', icon: '❄️', class: AirConditionerSound },
      { id: 'cafe', name: '咖啡馆', icon: '☕', class: CafeSound },
      { id: 'underwater', name: '水底', icon: '🐠', class: UnderwaterSound },
      { id: 'clock', name: '时钟', icon: '⏰', class: ClockSound },
      { id: 'white', name: '白噪音', icon: '⚪', class: WhiteNoiseSound },
      { id: 'pink', name: '粉噪音', icon: '🌸', class: PinkNoiseSound },
      { id: 'brown', name: '棕噪音', icon: '🟤', class: BrownNoiseSound },
      { id: 'violet', name: '紫噪音', icon: '🟣', class: VioletNoiseSound },
      { id: 'grey', name: '灰噪音', icon: '⚫', class: GreyNoiseSound }
    ];
    
    this.init();
  }

  init() {
    this.renderSoundCards();
    this.bindEvents();
  }

  initAudioContext() {
    if (!this.audioContext) {
      this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
      
      this.soundConfigs.forEach(config => {
        this.sounds[config.id] = new config.class(this.audioContext);
        this.sounds[config.id].setVolume(0.5 * this.masterVolume);
      });
    }
    
    if (this.audioContext.state === 'suspended') {
      this.audioContext.resume();
    }
  }

  renderSoundCards() {
    const grid = document.getElementById('soundsGrid');
    
    this.soundConfigs.forEach(config => {
      const card = document.createElement('div');
      card.className = 'sound-card';
      card.id = `card-${config.id}`;
      
      card.innerHTML = `
        <div class="sound-header">
          <span class="sound-icon">${config.icon}</span>
          <span class="sound-name">${config.name}</span>
          <button class="play-btn" data-sound="${config.id}">▶</button>
        </div>
        <div class="volume-control">
          <label>音量</label>
          <input type="range" class="sound-volume" data-sound="${config.id}" min="0" max="100" value="50">
          <span class="volume-value" id="volume-${config.id}">50%</span>
        </div>
      `;
      
      grid.appendChild(card);
    });
  }

  bindEvents() {
    document.querySelectorAll('.play-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        this.initAudioContext();
        const soundId = e.target.dataset.sound;
        this.toggleSound(soundId);
      });
    });

    document.querySelectorAll('.sound-volume').forEach(slider => {
      slider.addEventListener('input', (e) => {
        const soundId = e.target.dataset.sound;
        const value = e.target.value / 100;
        document.getElementById(`volume-${soundId}`).textContent = `${e.target.value}%`;
        
        if (this.sounds[soundId]) {
          this.sounds[soundId].setVolume(value * this.masterVolume);
        }
      });
    });

    document.getElementById('masterVolume').addEventListener('input', (e) => {
      this.masterVolume = e.target.value / 100;
      document.getElementById('masterVolumeValue').textContent = `${e.target.value}%`;
      
      this.soundConfigs.forEach(config => {
        const slider = document.querySelector(`.sound-volume[data-sound="${config.id}"]`);
        const soundVolume = slider.value / 100;
        
        if (this.sounds[config.id]) {
          this.sounds[config.id].setVolume(soundVolume * this.masterVolume);
        }
      });
    });

    document.getElementById('stopAllBtn').addEventListener('click', () => {
      this.stopAllSounds();
    });

    document.querySelectorAll('.timer-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const minutes = parseInt(e.target.dataset.time);
        this.setTimer(minutes);
      });
    });
  }

  toggleSound(soundId) {
    const btn = document.querySelector(`.play-btn[data-sound="${soundId}"]`);
    const card = document.getElementById(`card-${soundId}`);
    
    if (this.activeSounds.has(soundId)) {
      this.sounds[soundId].stop();
      this.activeSounds.delete(soundId);
      btn.textContent = '▶';
      btn.classList.remove('playing');
      card.classList.remove('active');
    } else {
      this.sounds[soundId].play();
      this.activeSounds.add(soundId);
      btn.textContent = '⏸';
      btn.classList.add('playing');
      card.classList.add('active');
    }
  }

  stopAllSounds() {
    this.activeSounds.forEach(soundId => {
      this.sounds[soundId].stop();
      const btn = document.querySelector(`.play-btn[data-sound="${soundId}"]`);
      const card = document.getElementById(`card-${soundId}`);
      btn.textContent = '▶';
      btn.classList.remove('playing');
      card.classList.remove('active');
    });
    this.activeSounds.clear();
  }

  setTimer(minutes) {
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
      this.timerInterval = null;
    }

    document.querySelectorAll('.timer-btn').forEach(btn => {
      btn.classList.remove('active');
      if (parseInt(btn.dataset.time) === minutes && minutes > 0) {
        btn.classList.add('active');
      }
    });

    if (minutes === 0) {
      document.getElementById('timerDisplay').textContent = '定时关闭: 未设置';
      return;
    }

    this.initAudioContext();
    this.remainingTime = minutes * 60;
    this.updateTimerDisplay();

    this.timerInterval = setInterval(() => {
      this.remainingTime--;
      
      if (this.remainingTime <= 0) {
        this.stopAllSounds();
        clearInterval(this.timerInterval);
        this.timerInterval = null;
        document.getElementById('timerDisplay').textContent = '定时关闭: 已结束';
        document.querySelectorAll('.timer-btn').forEach(btn => btn.classList.remove('active'));
      } else {
        this.updateTimerDisplay();
      }
    }, 1000);
  }

  updateTimerDisplay() {
    const minutes = Math.floor(this.remainingTime / 60);
    const seconds = this.remainingTime % 60;
    document.getElementById('timerDisplay').textContent = 
      `定时关闭: ${minutes}:${seconds.toString().padStart(2, '0')}`;
  }
}

window.addEventListener('DOMContentLoaded', () => {
  new RelaxMusicApp();
});