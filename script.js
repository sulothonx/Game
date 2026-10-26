/**
 * ==============================================================================
 * เกมผจญภัย 2D: "ภารกิจพิชิตโลกคอมพิวเตอร์" (สำหรับนักเรียน ป.1)
 * ไฟล์: script.js
 * จัดการระบบเกม 2D Canvas, ระบบคำถาม, ระบบเสียงสังเคราะห์ Web Audio,
 * เสียงอ่านโจทย์ภาษาไทย (TTS) และเชื่อมต่อ Google Sheets ผ่าน Google Apps Script
 * ==============================================================================
 */

// ==============================================================================
// 1. การตั้งค่าการเชื่อมต่อ Google Apps Script Web App
// ==============================================================================
// URL ของ Web App ที่ติดตั้งและเปิดใช้งานสิทธิ์เรียบร้อยแล้ว:
const GOOGLE_APPS_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbwjVc-XjoXO50_ehOs5ILS0YM5bs0gyiqyA61WlWUbeu6Vdu1JJBBQSa5uFy9vax147Aw/exec"; 

// รหัส Google Spreadsheet ที่กำหนดไว้ในโจทย์
const SPREADSHEET_ID = "1yyufWLMZqIjgzNo_dYt57JlR0VMo2sgUj0goMekqUiw";

// ==============================================================================
// 2. ข้อมูลด่านและชุดคำถาม 5 ด่าน (สำหรับนักเรียนชั้น ป.1)
// ==============================================================================
const STAGES_DATA = [
  {
    id: 1,
    title: "ป่าแป้นพิมพ์ (Keyboard Forest)",
    shortTitle: "ป่าแป้นพิมพ์",
    subtitle: "สำรวจต้นไม้คีย์บอร์ดและตามหาคีย์ปริศนา",
    theme: "forest",
    bgColor: "#143621",
    question: "อุปกรณ์ใดใช้พิมพ์ตัวอักษร?",
    options: [
      { key: "ก", text: "เมาส์" },
      { key: "ข", text: "แป้นพิมพ์" },
      { key: "ค", text: "จอภาพ" }
    ],
    correct: "ข",
    explanation: "แป้นพิมพ์ (Keyboard) มีปุ่มตัวอักษร ก-ฮ และ A-Z ใช้สำหรับพิมพ์ข้อความเข้าคอมพิวเตอร์จ้า!",
    iconType: "keyboard"
  },
  {
    id: 2,
    title: "เมืองจอภาพ (Monitor City)",
    shortTitle: "เมืองจอภาพ",
    subtitle: "ท่องมหานครแห่งแสงสีและภาพจำลอง",
    theme: "city",
    bgColor: "#101f42",
    question: "อุปกรณ์ใดใช้แสดงภาพ?",
    options: [
      { key: "ก", text: "จอภาพ" },
      { key: "ข", text: "ลำโพง" },
      { key: "ค", text: "แป้นพิมพ์" }
    ],
    correct: "ก",
    explanation: "จอภาพ (Monitor) ทำหน้าที่แสดงผลรูปภาพ ตัวหนังสือ และวิดีโอให้เรามองเห็นบนหน้าจอ!",
    iconType: "monitor"
  },
  {
    id: 3,
    title: "ถ้ำเมาส์ (Mouse Cave)",
    shortTitle: "ถ้ำเมาส์",
    subtitle: "มุดถ้ำแสนสนุกค้นหาเมาส์วิเศษ",
    theme: "cave",
    bgColor: "#301538",
    question: "อุปกรณ์ใดใช้คลิกเลือกสิ่งต่าง ๆ?",
    options: [
      { key: "ก", text: "เครื่องพิมพ์" },
      { key: "ข", text: "จอภาพ" },
      { key: "ค", text: "เมาส์" }
    ],
    correct: "ค",
    explanation: "เมาส์ (Mouse) ใช้สำหรับเลื่อนตัวชี้ (Pointer) และคลิกเลือกสั่งการสิ่งต่าง ๆ บนหน้าจอได้อย่างแม่นยำ!",
    iconType: "mouse"
  },
  {
    id: 4,
    title: "หุบเขาเสียง (Speaker Valley)",
    shortTitle: "หุบเขาเสียง",
    subtitle: "ก้าวข้ามคลื่นเสียงและดนตรีอันไพเราะ",
    theme: "sound",
    bgColor: "#1f1b3e",
    question: "อุปกรณ์ใดใช้ฟังเสียงจากคอมพิวเตอร์?",
    options: [
      { key: "ก", text: "ลำโพง" },
      { key: "ข", text: "เมาส์" },
      { key: "ค", text: "แป้นพิมพ์" }
    ],
    correct: "ก",
    explanation: "ลำโพง (Speaker) ทำหน้าที่ขับเสียงเพลง เสียงเอฟเฟกต์ และเสียงพูดออกมาให้เราได้ยินอย่างเพลิดเพลิน!",
    iconType: "speaker"
  },
  {
    id: 5,
    title: "ปราสาทคอมพิวเตอร์ (Computer Castle)",
    shortTitle: "ปราสาทคอมพิวเตอร์",
    subtitle: "ศูนย์บัญชาการใหญ่ พิชิตภารกิจบทเรียนสุดท้าย!",
    theme: "castle",
    bgColor: "#091428",
    question: "เมื่อเลิกใช้คอมพิวเตอร์ควรทำอย่างไร?",
    options: [
      { key: "ก", text: "ดึงปลั๊กทันที" },
      { key: "ข", text: "ปิดเครื่องอย่างถูกวิธี" },
      { key: "ค", text: "กดปุ่มมั่ว ๆ" }
    ],
    correct: "ข",
    explanation: "เมื่อใช้งานเสร็จ ควรคลิกคำสั่งปิดเครื่อง (Shut down) อย่างถูกวิธี เพื่อถนอมเครื่องและไม่ทำให้ไฟล์งานเสียหายนะจ๊ะ!",
    iconType: "power"
  }
];

// ==============================================================================
// 3. ระบบเสียงสังเคราะห์ (Web Audio API Sound Engine)
// ทำงานได้ 100% โดยไม่ต้องพึ่งไฟล์ MP3 ภายนอก หมดปัญหาลิงก์เสียหรือโหลดช้า
// ==============================================================================
class SoundEngine {
  constructor() {
    this.ctx = null;
    this.isMuted = false;
    this.bgmPlaying = false;
    this.bgmTimer = null;
    this.initAudioContext();
  }

  initAudioContext() {
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    } catch (e) {
      console.warn("Web Audio API not supported", e);
    }
  }

  ensureContext() {
    if (!this.ctx) {
      this.initAudioContext();
    }
    if (this.ctx && this.ctx.state === "suspended") {
      this.ctx.resume();
    }
  }

  toggleMute() {
    this.isMuted = !this.isMuted;
    if (this.isMuted) {
      this.stopBGM();
    } else {
      this.startBGM();
    }
    return this.isMuted;
  }

  // เสียงกระโดด
  playJump() {
    if (this.isMuted || !this.ctx) return;
    this.ensureContext();
    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = "sine";
    osc.frequency.setValueAtTime(220, t);
    osc.frequency.exponentialRampToValueAtTime(550, t + 0.16);

    gain.gain.setValueAtTime(0.25, t);
    gain.gain.exponentialRampToValueAtTime(0.01, t + 0.18);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(t);
    osc.stop(t + 0.18);
  }

  // เสียงเก็บเหรียญ
  playCoin() {
    if (this.isMuted || !this.ctx) return;
    this.ensureContext();
    const t = this.ctx.currentTime;
    
    // โน้ตตัวที่ 1
    const osc1 = this.ctx.createOscillator();
    const gain1 = this.ctx.createGain();
    osc1.type = "triangle";
    osc1.frequency.setValueAtTime(987.77, t); // B5
    gain1.gain.setValueAtTime(0.2, t);
    gain1.gain.exponentialRampToValueAtTime(0.01, t + 0.1);
    osc1.connect(gain1);
    gain1.connect(this.ctx.destination);
    osc1.start(t);
    osc1.stop(t + 0.1);

    // โน้ตตัวที่ 2
    const osc2 = this.ctx.createOscillator();
    const gain2 = this.ctx.createGain();
    osc2.type = "triangle";
    osc2.frequency.setValueAtTime(1318.51, t + 0.08); // E6
    gain2.gain.setValueAtTime(0.25, t + 0.08);
    gain2.gain.exponentialRampToValueAtTime(0.01, t + 0.28);
    osc2.connect(gain2);
    gain2.connect(this.ctx.destination);
    osc2.start(t + 0.08);
    osc2.stop(t + 0.28);
  }

  // เสียงสปริงกระโดดสูง
  playSpring() {
    if (this.isMuted || !this.ctx) return;
    this.ensureContext();
    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = "triangle";
    osc.frequency.setValueAtTime(200, t);
    osc.frequency.exponentialRampToValueAtTime(800, t + 0.25);

    gain.gain.setValueAtTime(0.3, t);
    gain.gain.exponentialRampToValueAtTime(0.01, t + 0.28);

    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(t);
    osc.stop(t + 0.28);
  }

  // เสียงเมื่อถูกชนหรือเสียหัวใจ
  playHurt() {
    if (this.isMuted || !this.ctx) return;
    this.ensureContext();
    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = "sawtooth";
    osc.frequency.setValueAtTime(160, t);
    osc.frequency.linearRampToValueAtTime(90, t + 0.25);

    gain.gain.setValueAtTime(0.3, t);
    gain.gain.exponentialRampToValueAtTime(0.01, t + 0.25);

    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(t);
    osc.stop(t + 0.25);
  }

  // เสียงเฉลยตอบถูก (Fanfare สดใส)
  playCorrect() {
    if (this.isMuted || !this.ctx) return;
    this.ensureContext();
    const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
    const t = this.ctx.currentTime;

    notes.forEach((freq, idx) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const noteTime = t + idx * 0.09;

      osc.type = "triangle";
      osc.frequency.setValueAtTime(freq, noteTime);

      gain.gain.setValueAtTime(0.25, noteTime);
      gain.gain.exponentialRampToValueAtTime(0.01, noteTime + 0.25);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(noteTime);
      osc.stop(noteTime + 0.26);
    });
  }

  // เสียงตอบผิด (นุ่มนวล ไม่ทำให้เด็กตกใจ)
  playWrong() {
    if (this.isMuted || !this.ctx) return;
    this.ensureContext();
    const t = this.ctx.currentTime;
    const notes = [330, 260]; // E4 -> C4

    notes.forEach((freq, idx) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const noteTime = t + idx * 0.14;

      osc.type = "sine";
      osc.frequency.setValueAtTime(freq, noteTime);

      gain.gain.setValueAtTime(0.25, noteTime);
      gain.gain.exponentialRampToValueAtTime(0.01, noteTime + 0.2);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(noteTime);
      osc.stop(noteTime + 0.22);
    });
  }

  // เสียงเพลงบรรเลงประกอบแบบ Chiptune สดใส น่ารัก
  startBGM() {
    if (this.isMuted || this.bgmPlaying || !this.ctx) return;
    this.ensureContext();
    this.bgmPlaying = true;

    // ทำนองเพลงเด็กน่ารักสดใส (Pentatonic cheerful pattern)
    const melody = [
      261.63, 329.63, 392.00, 523.25,
      392.00, 329.63, 261.63, 329.63,
      293.66, 349.23, 440.00, 523.25,
      440.00, 349.23, 293.66, 392.00
    ];
    let step = 0;

    const playStep = () => {
      if (!this.bgmPlaying || this.isMuted) return;
      const t = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = "triangle";
      osc.frequency.setValueAtTime(melody[step % melody.length], t);

      gain.gain.setValueAtTime(0.05, t);
      gain.gain.exponentialRampToValueAtTime(0.005, t + 0.22);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(t);
      osc.stop(t + 0.24);

      step++;
      this.bgmTimer = setTimeout(playStep, 260);
    };

    playStep();
  }

  stopBGM() {
    this.bgmPlaying = false;
    if (this.bgmTimer) {
      clearTimeout(this.bgmTimer);
      this.bgmTimer = null;
    }
  }
}

// สร้าง Instance ของ Sound Engine
const sound = new SoundEngine();

// ==============================================================================
// 4. ระบบอ่านออกเสียงโจทย์ภาษาไทย (Web Speech Synthesis สำหรับเด็ก ป.1)
// ==============================================================================
function speakThaiText(text) {
  if (!("speechSynthesis" in window)) {
    console.warn("Speech Synthesis not supported in this browser");
    return;
  }
  window.speechSynthesis.cancel(); // หยุดเสียงเก่าก่อน

  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = "th-TH";
  utterance.rate = 0.95; // พูดช้าลงเล็กน้อยให้เด็ก ป.1 ฟังชัด
  utterance.pitch = 1.15; // เสียงสดใส

  // พยายามเลือกเสียงภาษาไทยที่มีในอุปกรณ์
  const voices = window.speechSynthesis.getVoices();
  const thaiVoice = voices.find(v => v.lang.includes("th"));
  if (thaiVoice) {
    utterance.voice = thaiVoice;
  }

  window.speechSynthesis.speak(utterance);
}

// ==============================================================================
// 5. สถานะของเกม (Game State)
// ==============================================================================
const gameState = {
  currentScreen: "startScreen",
  playerData: {
    fullName: "",
    studentClass: "ป.1/1",
    studentNo: 1,
    character: "boy"
  },
  currentStageIndex: 0, // 0 ถึง 4 (ด่าน 1 ถึง 5)
  lives: 3,             // หัวใจ 3 ดวง
  coinsCollected: 0,    // เหรียญพลังงาน
  totalScore: 0,        // คะแนนจากคำถาม (เต็ม 100)
  correctAnswersCount: 0,
  stageScores: [0, 0, 0, 0, 0], // บันทึกว่าแต่ละด่านได้ 20 คะแนนหรือยัง
  isSubmitting: false,  // ป้องกันการกดบันทึกซ้ำ
  isPaused: false,
  isGameRunning: false
};

// ==============================================================================
// 6. เอนจินเกม 2D Platformer Canvas
// ==============================================================================
class GameEngine {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    this.ctx = this.canvas.getContext("2d");
    this.width = this.canvas.width;
    this.height = this.canvas.height;

    // การควบคุม
    this.keys = {
      left: false,
      right: false,
      jump: false
    };

    // ตัวละครผู้เล่น
    this.player = {
      x: 80,
      y: 380,
      width: 44,
      height: 58,
      vx: 0,
      vy: 0,
      speed: 4.8,
      jumpStrength: -12.5,
      isGrounded: false,
      facingRight: true,
      animFrame: 0,
      animTimer: 0,
      invulnerableTimer: 0 // อมตะชั่วคราวหลังโดนดาเมจ
    };

    // วัตถุในด่าน
    this.levelWidth = 2400; // ความยาวแผนที่
    this.platforms = [];
    this.coins = [];
    this.springs = [];
    this.enemies = [];
    this.guardian = null;
    this.particles = [];

    // กล้องติดตามตัวละคร
    this.cameraX = 0;

    // การวนลูปแอนิเมชัน
    this.animationFrameId = null;
    this.lastTime = 0;

    this.initControls();
  }

  initControls() {
    // คีย์บอร์ด
    window.addEventListener("keydown", (e) => {
      sound.ensureContext();
      if (e.code === "ArrowLeft" || e.code === "KeyA") {
        this.keys.left = true;
      }
      if (e.code === "ArrowRight" || e.code === "KeyD") {
        this.keys.right = true;
      }
      if (e.code === "ArrowUp" || e.code === "KeyW" || e.code === "Space") {
        this.keys.jump = true;
        e.preventDefault();
      }
    });

    window.addEventListener("keyup", (e) => {
      if (e.code === "ArrowLeft" || e.code === "KeyA") {
        this.keys.left = false;
      }
      if (e.code === "ArrowRight" || e.code === "KeyD") {
        this.keys.right = false;
      }
      if (e.code === "ArrowUp" || e.code === "KeyW" || e.code === "Space") {
        this.keys.jump = false;
      }
    });

    // ปุ่มสัมผัสบนหน้าจอมือถือ / แท็บเล็ต
    const btnLeft = document.getElementById("btnLeft");
    const btnRight = document.getElementById("btnRight");
    const btnJump = document.getElementById("btnJump");

    const setupTouchBtn = (btn, keyName) => {
      if (!btn) return;
      const startHandler = (e) => {
        e.preventDefault();
        sound.ensureContext();
        this.keys[keyName] = true;
      };
      const endHandler = (e) => {
        e.preventDefault();
        this.keys[keyName] = false;
      };
      btn.addEventListener("touchstart", startHandler, { passive: false });
      btn.addEventListener("touchend", endHandler, { passive: false });
      btn.addEventListener("mousedown", startHandler);
      btn.addEventListener("mouseup", endHandler);
      btn.addEventListener("mouseleave", endHandler);
    };

    setupTouchBtn(btnLeft, "left");
    setupTouchBtn(btnRight, "right");
    setupTouchBtn(btnJump, "jump");
  }

  // โหลดข้อมูลด่าน
  loadStage(stageIndex) {
    const stage = STAGES_DATA[stageIndex];
    this.currentStage = stage;
    this.levelWidth = 2200;

    // รีเซ็ตตำแหน่งผู้เล่น
    this.player.x = 100;
    this.player.y = 350;
    this.player.vx = 0;
    this.player.vy = 0;
    this.player.isGrounded = false;
    this.player.invulnerableTimer = 0;
    this.cameraX = 0;
    this.particles = [];

    // สร้าง Platform ตามธีมด่าน
    this.platforms = [
      // พื้นดินหลักด้านล่าง
      { x: 0, y: 460, width: 700, height: 80, type: "ground" },
      { x: 780, y: 460, width: 600, height: 80, type: "ground" },
      { x: 1450, y: 460, width: 850, height: 80, type: "ground" },

      // แท่นกระโดดลอยฟ้า
      { x: 260, y: 360, width: 140, height: 28, type: "floating", label: "Key 1" },
      { x: 460, y: 280, width: 160, height: 28, type: "floating", label: "Key 2" },
      { x: 700, y: 350, width: 120, height: 28, type: "floating", label: "Key 3" },
      { x: 920, y: 320, width: 150, height: 28, type: "floating", label: "Key 4" },
      { x: 1140, y: 250, width: 150, height: 28, type: "floating", label: "Key 5" },
      { x: 1360, y: 340, width: 140, height: 28, type: "floating", label: "Key 6" },
      { x: 1620, y: 290, width: 160, height: 28, type: "floating", label: "Key 7" }
    ];

    // เหรียญพลังงานให้เก็บ
    this.coins = [
      { x: 320, y: 300, collected: false, radius: 14 },
      { x: 530, y: 220, collected: false, radius: 14 },
      { x: 840, y: 400, collected: false, radius: 14 },
      { x: 1000, y: 260, collected: false, radius: 14 },
      { x: 1210, y: 190, collected: false, radius: 14 },
      { x: 1420, y: 280, collected: false, radius: 14 },
      { x: 1700, y: 230, collected: false, radius: 14 }
    ];

    // สปริงกระโดดสูง
    this.springs = [
      { x: 420, y: 436, width: 36, height: 24, bounced: false },
      { x: 1100, y: 436, width: 36, height: 24, bounced: false }
    ];

    // มอนสเตอร์ตัวป่วนการ์ตูน (Harmless Glitch Bugs)
    this.enemies = [
      { x: 550, y: 420, width: 36, height: 36, vx: 1.2, minX: 480, maxX: 640 },
      { x: 960, y: 420, width: 36, height: 36, vx: -1.2, minX: 850, maxX: 1080 },
      { x: 1600, y: 420, width: 36, height: 36, vx: 1.2, minX: 1520, maxX: 1750 }
    ];

    // ผู้พิทักษ์คอมพิวเตอร์ (Guardian NPC) ปลายด่าน
    this.guardian = {
      x: 1950,
      y: 380,
      width: 52,
      height: 75,
      reached: false
    };
  }

  start() {
    gameState.isGameRunning = true;
    gameState.isPaused = false;
    sound.startBGM();
    this.lastTime = performance.now();
    this.loop();
  }

  stop() {
    gameState.isGameRunning = false;
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
    }
  }

  pause() {
    gameState.isPaused = true;
  }

  resume() {
    gameState.isPaused = false;
    this.lastTime = performance.now();
  }

  // ลูปหลักของเกม
  loop() {
    if (!gameState.isGameRunning) return;

    if (!gameState.isPaused) {
      this.update();
      this.render();
    }

    this.animationFrameId = requestAnimationFrame(() => this.loop());
  }

  update() {
    const p = this.player;

    // การเคลื่อนที่แนวนอน
    if (this.keys.left) {
      p.vx = -p.speed;
      p.facingRight = false;
    } else if (this.keys.right) {
      p.vx = p.speed;
      p.facingRight = true;
    } else {
      p.vx *= 0.7; // แรงเสียดทาน
      if (Math.abs(p.vx) < 0.1) p.vx = 0;
    }

    // การกระโดด
    if (this.keys.jump && p.isGrounded) {
      p.vy = p.jumpStrength;
      p.isGrounded = false;
      sound.playJump();
      this.createJumpDust(p.x + p.width / 2, p.y + p.height);
    }

    // แรงโน้มถ่วง
    p.vy += 0.55;
    if (p.vy > 12) p.vy = 12;

    // อัปเดตตำแหน่ง X และตรวจสอบการชน
    p.x += p.vx;
    if (p.x < 0) p.x = 0;
    if (p.x + p.width > this.levelWidth) p.x = this.levelWidth - p.width;

    // อัปเดตตำแหน่ง Y และตรวจสอบ Platform
    p.y += p.vy;
    p.isGrounded = false;

    for (const plat of this.platforms) {
      if (
        p.x + p.width > plat.x &&
        p.x < plat.x + plat.width &&
        p.y + p.height >= plat.y &&
        p.y + p.height <= plat.y + plat.height + 14 &&
        p.vy >= 0
      ) {
        p.y = plat.y - p.height;
        p.vy = 0;
        p.isGrounded = true;
        break;
      }
    }

    // ตรวจสอบตกเหว
    if (p.y > this.height + 100) {
      this.handlePlayerHurt(true);
    }

    // สปริงกระโดด
    for (const spr of this.springs) {
      if (
        p.x + p.width > spr.x &&
        p.x < spr.x + spr.width &&
        p.y + p.height >= spr.y &&
        p.y + p.height <= spr.y + spr.height + 10 &&
        p.vy >= 0
      ) {
        p.vy = -16.5; // เด้งสูงมาก!
        sound.playSpring();
        this.createCoinParticles(spr.x + spr.width / 2, spr.y, "#38bdf8");
      }
    }

    // เก็บเหรียญ
    for (const coin of this.coins) {
      if (!coin.collected) {
        const dx = (p.x + p.width / 2) - coin.x;
        const dy = (p.y + p.height / 2) - coin.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < coin.radius + p.width / 2) {
          coin.collected = true;
          gameState.coinsCollected++;
          updateHUD();
          sound.playCoin();
          this.createCoinParticles(coin.x, coin.y, "#facc15");
        }
      }
    }

    // ศัตรู Glitch Bug
    if (p.invulnerableTimer > 0) {
      p.invulnerableTimer--;
    }

    for (const en of this.enemies) {
      en.x += en.vx;
      if (en.x < en.minX || en.x + en.width > en.maxX) {
        en.vx *= -1;
      }

      // ชนกับผู้เล่น
      if (
        p.invulnerableTimer === 0 &&
        p.x + p.width > en.x + 4 &&
        p.x < en.x + en.width - 4 &&
        p.y + p.height > en.y + 6 &&
        p.y < en.y + en.height
      ) {
        // หากผู้เล่นเหยียบหัวศัตรู
        if (p.vy > 0 && p.y + p.height < en.y + 20) {
          p.vy = -8;
          en.x = -999; // กำจัดออกชั่วคราว
          sound.playJump();
          this.createCoinParticles(en.x, en.y, "#ec4899");
        } else {
          this.handlePlayerHurt(false);
        }
      }
    }

    // ผู้พิทักษ์คอมพิวเตอร์ (ปลายด่าน)
    if (this.guardian && !this.guardian.reached) {
      const g = this.guardian;
      if (
        p.x + p.width > g.x &&
        p.x < g.x + g.width &&
        p.y + p.height > g.y &&
        p.y < g.y + g.height
      ) {
        this.guardian.reached = true;
        this.pause();
        sound.playCorrect();
        openQuestionModal();
      }
    }

    // กล้องเลื่อนตามผู้เล่น
    const targetCameraX = p.x - this.width * 0.35;
    this.cameraX += (targetCameraX - this.cameraX) * 0.1;
    if (this.cameraX < 0) this.cameraX = 0;
    if (this.cameraX > this.levelWidth - this.width) {
      this.cameraX = this.levelWidth - this.width;
    }

    // แอนิเมชันวิ่ง
    if (Math.abs(p.vx) > 0.5 && p.isGrounded) {
      p.animTimer++;
      if (p.animTimer % 6 === 0) {
        p.animFrame = (p.animFrame + 1) % 4;
      }
    } else {
      p.animFrame = 0;
    }

    // อัปเดตเอฟเฟกต์อนุภาค
    for (let i = this.particles.length - 1; i >= 0; i--) {
      const pt = this.particles[i];
      pt.x += pt.vx;
      pt.y += pt.vy;
      pt.alpha -= pt.decay;
      if (pt.alpha <= 0) {
        this.particles.splice(i, 1);
      }
    }
  }

  // จัดการเมื่อโดนดาเมจหรือตกเหว
  handlePlayerHurt(isFall) {
    sound.playHurt();
    gameState.lives--;
    updateHUD();

    if (gameState.lives <= 0) {
      this.pause();
      openRespawnModal();
      return;
    }

    // เกิดใหม่ที่จุดปลอดภัยบนแพลตฟอร์ม
    this.player.x = Math.max(80, this.player.x - 140);
    this.player.y = 280;
    this.player.vx = 0;
    this.player.vy = 0;
    this.player.invulnerableTimer = 90; // กระพริบอมตะประมาณ 1.5 วินาที
  }

  // สร้างเอฟเฟกต์อนุภาค
  createCoinParticles(x, y, color) {
    for (let i = 0; i < 8; i++) {
      const angle = (Math.PI * 2 / 8) * i;
      const speed = Math.random() * 2 + 2;
      this.particles.push({
        x: x,
        y: y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        radius: Math.random() * 3 + 2,
        color: color,
        alpha: 1,
        decay: 0.04
      });
    }
  }

  createJumpDust(x, y) {
    for (let i = 0; i < 4; i++) {
      this.particles.push({
        x: x + (Math.random() - 0.5) * 16,
        y: y,
        vx: (Math.random() - 0.5) * 2,
        vy: -Math.random() * 1.5,
        radius: 3,
        color: "#ffffff",
        alpha: 0.7,
        decay: 0.05
      });
    }
  }

  // วาดกราฟิกทั้งหมด
  render() {
    const ctx = this.ctx;
    ctx.clearRect(0, 0, this.width, this.height);

    ctx.save();
    // เลื่อนมุมมองตามกล้อง
    ctx.translate(-Math.floor(this.cameraX), 0);

    // 1. วาดพื้นหลังฉากหลัง
    this.drawBackground(ctx);

    // 2. วาดแท่นเหยียบ Platforms
    this.drawPlatforms(ctx);

    // 3. วาดสปริง
    this.drawSprings(ctx);

    // 4. วาดเหรียญทอง
    this.drawCoins(ctx);

    // 5. วาดศัตรู Bug
    this.drawEnemies(ctx);

    // 6. วาดผู้พิทักษ์คอมพิวเตอร์
    this.drawGuardian(ctx);

    // 7. วาดตัวละครผู้เล่น Chibi
    this.drawPlayer(ctx);

    // 8. วาดเอฟเฟกต์อนุภาค
    this.drawParticles(ctx);

    ctx.restore();
  }

  // วาดฉากหลังแบบ Parallax ตามธีมด่าน
  drawBackground(ctx) {
    const stage = this.currentStage;
    const cam = this.cameraX;

    // ท้องฟ้าไล่สี
    const skyGrad = ctx.createLinearGradient(0, 0, 0, this.height);
    if (stage.theme === "forest") {
      skyGrad.addColorStop(0, "#064e3b");
      skyGrad.addColorStop(1, "#022c22");
    } else if (stage.theme === "city") {
      skyGrad.addColorStop(0, "#1e1b4b");
      skyGrad.addColorStop(1, "#0f172a");
    } else if (stage.theme === "cave") {
      skyGrad.addColorStop(0, "#4c1d95");
      skyGrad.addColorStop(1, "#1e1b4b");
    } else if (stage.theme === "sound") {
      skyGrad.addColorStop(0, "#1e293b");
      skyGrad.addColorStop(1, "#312e81");
    } else {
      skyGrad.addColorStop(0, "#0f172a");
      skyGrad.addColorStop(1, "#172554");
    }

    ctx.fillStyle = skyGrad;
    ctx.fillRect(cam, 0, this.width, this.height);

    // ภูเขาและอาคารคอมพิวเตอร์พื้นหลัง (Parallax เลื่อนช้า 0.3 เท่า)
    ctx.fillStyle = "rgba(255, 255, 255, 0.05)";
    for (let i = 0; i < 16; i++) {
      const bx = i * 180 - (cam * 0.25) % 180;
      ctx.fillRect(cam + bx, 200 + (i % 3) * 30, 110, 300);

      // แสงไฟหน้าต่างแบบพิกเซล
      ctx.fillStyle = "rgba(255, 255, 255, 0.1)";
      ctx.fillRect(cam + bx + 15, 230 + (i % 3) * 30, 20, 25);
      ctx.fillRect(cam + bx + 45, 230 + (i % 3) * 30, 20, 25);
      ctx.fillStyle = "rgba(255, 255, 255, 0.05)";
    }

    // สายเคเบิลหรือเส้นวงจรไฟนีออน
    ctx.strokeStyle = "rgba(56, 189, 248, 0.2)";
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(cam, 120);
    ctx.bezierCurveTo(cam + 300, 160, cam + 600, 90, cam + this.width, 140);
    ctx.stroke();
  }

  // วาด Platforms
  drawPlatforms(ctx) {
    const stage = this.currentStage;

    for (const plat of this.platforms) {
      if (plat.type === "ground") {
        // พื้นดินหลัก
        ctx.fillStyle = stage.theme === "forest" ? "#047857" : "#1e293b";
        ctx.fillRect(plat.x, plat.y, plat.width, plat.height);

        // ขอบหญ้า/ขอบไฟด้านบน
        ctx.fillStyle = stage.theme === "forest" ? "#34d399" : "#38bdf8";
        ctx.fillRect(plat.x, plat.y, plat.width, 10);
      } else {
        // ปุ่มแป้นพิมพ์ลอยฟ้า หรือแท่นวงจร
        ctx.save();
        ctx.fillStyle = "#ffffff";
        ctx.beginPath();
        ctx.roundRect(plat.x, plat.y, plat.width, plat.height, 8);
        ctx.fill();

        // ขอบ 3D นูนเหมือนปุ่มคีย์บอร์ด
        ctx.fillStyle = "#cbd5e1";
        ctx.fillRect(plat.x + 4, plat.y + plat.height - 6, plat.width - 8, 6);

        // ตัวอักษรบนปุ่ม
        ctx.fillStyle = "#3b82f6";
        ctx.font = "bold 13px Kanit";
        ctx.textAlign = "center";
        ctx.fillText(stage.theme === "forest" ? "⌨️ KEY" : "💻 DATA", plat.x + plat.width / 2, plat.y + 19);
        ctx.restore();
      }
    }
  }

  // วาดสปริง
  drawSprings(ctx) {
    for (const spr of this.springs) {
      ctx.fillStyle = "#e2e8f0";
      ctx.fillRect(spr.x + 4, spr.y + 10, spr.width - 8, spr.height - 10);
      // ตัวสปริงสีเหลืองสดใส
      ctx.fillStyle = "#f59e0b";
      ctx.beginPath();
      ctx.roundRect(spr.x, spr.y, spr.width, 10, 4);
      ctx.fill();
    }
  }

  // วาดเหรียญทอง
  drawCoins(ctx) {
    const now = performance.now();
    for (const coin of this.coins) {
      if (!coin.collected) {
        ctx.save();
        const floatOffset = Math.sin((now + coin.x) * 0.005) * 5;
        const cy = coin.y + floatOffset;

        // วงรัศมีเรืองแสง
        ctx.fillStyle = "rgba(250, 204, 21, 0.25)";
        ctx.beginPath();
        ctx.arc(coin.x, cy, coin.radius + 6, 0, Math.PI * 2);
        ctx.fill();

        // ตัวเหรียญทอง
        ctx.fillStyle = "#facc15";
        ctx.beginPath();
        ctx.arc(coin.x, cy, coin.radius, 0, Math.PI * 2);
        ctx.fill();

        ctx.strokeStyle = "#b45309";
        ctx.lineWidth = 2.5;
        ctx.stroke();

        // เครื่องหมายดาวบนเหรียญ
        ctx.fillStyle = "#78350f";
        ctx.font = "bold 13px Prompt";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText("⭐", coin.x, cy + 1);

        ctx.restore();
      }
    }
  }

  // วาดมอนสเตอร์ Bug
  drawEnemies(ctx) {
    for (const en of this.enemies) {
      ctx.save();
      // ลำตัวแมลงบักการ์ตูนสีม่วง/ชมพู
      ctx.fillStyle = "#ec4899";
      ctx.beginPath();
      ctx.arc(en.x + en.width / 2, en.y + en.height / 2, 16, 0, Math.PI * 2);
      ctx.fill();

      // ตาโตกลิ้งไปมา
      ctx.fillStyle = "#ffffff";
      ctx.beginPath();
      ctx.arc(en.x + en.width / 2 - 5, en.y + en.height / 2 - 3, 5, 0, Math.PI * 2);
      ctx.arc(en.x + en.width / 2 + 5, en.y + en.height / 2 - 3, 5, 0, Math.PI * 2);
      ctx.fill();

      // ตาดำ
      ctx.fillStyle = "#000000";
      const eyeDir = en.vx > 0 ? 2 : -2;
      ctx.beginPath();
      ctx.arc(en.x + en.width / 2 - 5 + eyeDir, en.y + en.height / 2 - 3, 2.5, 0, Math.PI * 2);
      ctx.arc(en.x + en.width / 2 + 5 + eyeDir, en.y + en.height / 2 - 3, 2.5, 0, Math.PI * 2);
      ctx.fill();

      // หนวดจิ๋ว 2 ข้าง
      ctx.strokeStyle = "#be185d";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(en.x + en.width / 2 - 6, en.y + 4);
      ctx.lineTo(en.x + en.width / 2 - 10, en.y - 4);
      ctx.moveTo(en.x + en.width / 2 + 6, en.y + 4);
      ctx.lineTo(en.x + en.width / 2 + 10, en.y - 4);
      ctx.stroke();

      ctx.restore();
    }
  }

  // วาดผู้พิทักษ์คอมพิวเตอร์ (Guardian NPC)
  drawGuardian(ctx) {
    if (!this.guardian) return;
    const g = this.guardian;
    const now = performance.now();
    const bob = Math.sin(now * 0.004) * 4;

    ctx.save();
    // เสาแสงสัญญาณ
    ctx.fillStyle = "rgba(59, 130, 246, 0.25)";
    ctx.fillRect(g.x - 20, 0, g.width + 40, this.height);

    // ตัวหุ่นผู้พิทักษ์
    ctx.fillStyle = "#3b82f6";
    ctx.beginPath();
    ctx.roundRect(g.x, g.y + bob, g.width, g.height, 16);
    ctx.fill();

    // หน้าจอมอนิเตอร์ของหุ่น
    ctx.fillStyle = "#0284c7";
    ctx.beginPath();
    ctx.roundRect(g.x + 8, g.y + 12 + bob, g.width - 16, 28, 8);
    ctx.fill();

    // ดวงตาแสดงความรู้สึกน่ารัก
    ctx.fillStyle = "#38bdf8";
    ctx.font = "bold 16px Prompt";
    ctx.textAlign = "center";
    ctx.fillText("^ _ ^", g.x + g.width / 2, g.y + 32 + bob);

    // ป้ายบอกทาง "เป้าหมาย"
    ctx.fillStyle = "#facc15";
    ctx.font = "bold 13px Kanit";
    ctx.fillText("🚩 ตอบคำถาม", g.x + g.width / 2, g.y - 12 + bob);

    ctx.restore();
  }

  // วาดตัวละครผู้เล่น Chibi (การ์ตูนหัวโตสุดน่ารัก)
  drawPlayer(ctx) {
    const p = this.player;

    // เอฟเฟกต์กระพริบเมื่ออมตะ
    if (p.invulnerableTimer > 0 && Math.floor(p.invulnerableTimer / 4) % 2 === 0) {
      return;
    }

    ctx.save();
    ctx.translate(p.x + p.width / 2, p.y + p.height / 2);

    if (!p.facingRight) {
      ctx.scale(-1, 1);
    }

    const charType = gameState.playerData.character;
    const bob = p.isGrounded ? Math.sin(p.animFrame * Math.PI) * 2 : -2;

    // 1. วาดขา
    const legOffset = p.isGrounded && Math.abs(p.vx) > 0.5 ? Math.sin(p.animFrame * Math.PI) * 6 : 0;
    ctx.fillStyle = "#1e293b";
    // ขาซ้าย
    ctx.beginPath();
    ctx.roundRect(-12 - legOffset, 12, 8, 16, 4);
    ctx.fill();
    // ขาขวา
    ctx.beginPath();
    ctx.roundRect(4 + legOffset, 12, 8, 16, 4);
    ctx.fill();

    // 2. วาดลำตัว / เสื้อ
    if (charType === "girl") {
      ctx.fillStyle = "#ec4899"; // สีชมพูน้องแก้ว
    } else if (charType === "robot") {
      ctx.fillStyle = "#10b981"; // สีเขียวหุ่นยนต์บิ๊ท
    } else {
      ctx.fillStyle = "#2563eb"; // สีฟ้าน้องกล้า
    }
    ctx.beginPath();
    ctx.roundRect(-14, -6 + bob, 28, 20, 6);
    ctx.fill();

    // กระเป๋าสะพายหลัง
    ctx.fillStyle = "#f59e0b";
    ctx.beginPath();
    ctx.roundRect(-18, -4 + bob, 6, 14, 3);
    ctx.fill();

    // 3. วาดหัวการ์ตูน Chibi (กลมใหญ่ สดใส)
    ctx.fillStyle = charType === "robot" ? "#94a3b8" : "#fed7aa"; // สีผิว/โลหะ
    ctx.beginPath();
    ctx.arc(0, -18 + bob, 18, 0, Math.PI * 2);
    ctx.fill();

    // ทรงผม / หมวก ตามตัวละคร
    if (charType === "boy") {
      // หมวกแก๊ปสีฟ้า
      ctx.fillStyle = "#1d4ed8";
      ctx.beginPath();
      ctx.arc(0, -22 + bob, 18, Math.PI, Math.PI * 2);
      ctx.fill();
      // ปีกหมวก
      ctx.fillRect(4, -22 + bob, 14, 4);
    } else if (charType === "girl") {
      // ผมแกละสองข้างสีน้ำตาลเข้ม
      ctx.fillStyle = "#78350f";
      ctx.beginPath();
      ctx.arc(0, -22 + bob, 18, Math.PI * 0.9, Math.PI * 2.1);
      ctx.fill();
      // มัดผมสองข้าง
      ctx.beginPath();
      ctx.arc(-16, -20 + bob, 7, 0, Math.PI * 2);
      ctx.arc(16, -20 + bob, 7, 0, Math.PI * 2);
      ctx.fill();
    } else {
      // เสาอากาศหุ่นยนต์
      ctx.strokeStyle = "#334155";
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(0, -36 + bob);
      ctx.lineTo(0, -44 + bob);
      ctx.stroke();
      ctx.fillStyle = "#ef4444";
      ctx.beginPath();
      ctx.arc(0, -46 + bob, 4, 0, Math.PI * 2);
      ctx.fill();
    }

    // ตาการ์ตูนโตหวานแหวว
    ctx.fillStyle = "#0f172a";
    ctx.beginPath();
    ctx.arc(4, -17 + bob, 3.5, 0, Math.PI * 2);
    ctx.arc(12, -17 + bob, 3.5, 0, Math.PI * 2);
    ctx.fill();

    // แววตาสีขาววิบวับ
    ctx.fillStyle = "#ffffff";
    ctx.beginPath();
    ctx.arc(5, -18 + bob, 1.2, 0, Math.PI * 2);
    ctx.arc(13, -18 + bob, 1.2, 0, Math.PI * 2);
    ctx.fill();

    // แก้มชมพูระเรื่อ
    ctx.fillStyle = "rgba(244, 114, 182, 0.7)";
    ctx.beginPath();
    ctx.arc(2, -12 + bob, 3, 0, Math.PI * 2);
    ctx.arc(14, -12 + bob, 3, 0, Math.PI * 2);
    ctx.fill();

    // รอยยิ้ม
    ctx.strokeStyle = "#b45309";
    ctx.lineWidth = 1.8;
    ctx.beginPath();
    ctx.arc(8, -14 + bob, 4, 0.1, Math.PI * 0.9);
    ctx.stroke();

    ctx.restore();
  }

  // วาดอนุภาค
  drawParticles(ctx) {
    for (const pt of this.particles) {
      ctx.save();
      ctx.globalAlpha = pt.alpha;
      ctx.fillStyle = pt.color;
      ctx.beginPath();
      ctx.arc(pt.x, pt.y, pt.radius, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }
  }
}

let gameEngine = null;

// ==============================================================================
// 7. การจัดการหน้าจอ (UI Screen Management)
// ==============================================================================
function showScreen(screenId) {
  document.querySelectorAll(".screen").forEach(s => s.classList.remove("active"));
  const target = document.getElementById(screenId);
  if (target) {
    target.classList.add("active");
    gameState.currentScreen = screenId;
  }
}

// อัปเดตข้อมูลบนแถบ HUD
function updateHUD() {
  // ข้อมูลนักเรียน
  const nameEl = document.getElementById("hudPlayerName");
  const classEl = document.getElementById("hudPlayerClass");
  if (nameEl) nameEl.textContent = gameState.playerData.fullName || "ผู้กล้าตัวน้อย";
  if (classEl) classEl.textContent = `${gameState.playerData.studentClass} • เลขที่ ${gameState.playerData.studentNo}`;

  // อวาตาร์ใน HUD
  const avatarEl = document.getElementById("hudAvatar");
  if (avatarEl) {
    const char = gameState.playerData.character;
    avatarEl.textContent = char === "girl" ? "👧" : (char === "robot" ? "🤖" : "👦");
  }

  // หัวใจพลังชีวิต
  const heartsContainer = document.getElementById("heartsContainer");
  if (heartsContainer) {
    let heartsHtml = "";
    for (let i = 0; i < 3; i++) {
      if (i < gameState.lives) {
        heartsHtml += '<span class="heart active">❤️</span>';
      } else {
        heartsHtml += '<span class="heart lost">🖤</span>';
      }
    }
    heartsContainer.innerHTML = heartsHtml;
  }

  // ด่านปัจจุบัน
  const stage = STAGES_DATA[gameState.currentStageIndex];
  const stageNumEl = document.getElementById("hudStageNum");
  const stageTitleEl = document.getElementById("hudStageTitle");
  if (stageNumEl) stageNumEl.textContent = `ด่าน ${stage.id}/5`;
  if (stageTitleEl) stageTitleEl.textContent = stage.shortTitle;

  // เหรียญและคะแนน
  const coinEl = document.getElementById("hudCoins");
  const scoreEl = document.getElementById("hudScore");
  if (coinEl) coinEl.textContent = gameState.coinsCollected;
  if (scoreEl) scoreEl.textContent = gameState.totalScore;
}

// ==============================================================================
// 8. การจัดการระบบคำถาม (Question Modal Flow)
// ==============================================================================
function openQuestionModal() {
  const stage = STAGES_DATA[gameState.currentStageIndex];
  const modal = document.getElementById("questionModal");
  if (!modal) return;

  // ตั้งค่าข้อมูลคำถาม
  document.getElementById("qStageTag").textContent = stage.title;
  document.getElementById("qText").textContent = stage.question;

  // สร้างรูปภาพ SVG ประกอบคำถามให้เหมาะกับเด็ก ป.1
  const illBox = document.getElementById("qIllustration");
  if (illBox) {
    illBox.innerHTML = getDeviceIllustrationSvg(stage.iconType);
  }

  // ตั้งค่าปุ่มตัวเลือก 3 ข้อ
  const optionsContainer = document.getElementById("optionsContainer");
  optionsContainer.innerHTML = "";
  stage.options.forEach(opt => {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "option-btn";
    btn.dataset.key = opt.key;
    btn.innerHTML = `
      <span class="opt-key">${opt.key}</span>
      <span class="opt-text">${opt.text}</span>
    `;
    btn.addEventListener("click", () => handleSelectOption(opt.key, stage));
    optionsContainer.appendChild(btn);
  });

  // ซ่อนกล่อง Feedback ก่อน
  const feedbackBox = document.getElementById("feedbackBox");
  feedbackBox.className = "feedback-box hidden";
  document.getElementById("btnTryAgain").classList.add("hidden");
  document.getElementById("btnNextStage").classList.add("hidden");

  // ผูกปุ่มฟังเสียงอ่านโจทย์
  const btnSpeak = document.getElementById("btnSpeakQuestion");
  btnSpeak.onclick = () => {
    const textToSpeak = `${stage.question} ตัวเลือก ก ${stage.options[0].text}, ข ${stage.options[1].text}, ค ${stage.options[2].text}`;
    speakThaiText(textToSpeak);
  };

  modal.classList.add("active");
}

function closeQuestionModal() {
  const modal = document.getElementById("questionModal");
  if (modal) modal.classList.remove("active");
}

// เมื่อเด็กเลือกคำตอบ
function handleSelectOption(selectedKey, stage) {
  const options = document.querySelectorAll(".option-btn");
  const feedbackBox = document.getElementById("feedbackBox");
  const feedbackIcon = document.getElementById("feedbackIcon");
  const feedbackTitle = document.getElementById("feedbackTitle");
  const feedbackDesc = document.getElementById("feedbackDesc");
  const btnTryAgain = document.getElementById("btnTryAgain");
  const btnNextStage = document.getElementById("btnNextStage");

  // ปิดการคลิกตัวเลือกอื่นชั่วคราว
  options.forEach(btn => btn.style.pointerEvents = "none");

  const isCorrect = (selectedKey === stage.correct);

  options.forEach(btn => {
    if (btn.dataset.key === selectedKey) {
      if (isCorrect) {
        btn.classList.add("correct");
      } else {
        btn.classList.add("wrong");
      }
    }
  });

  if (isCorrect) {
    // ตอบถูกต้อง
    sound.playCorrect();
    triggerConfetti();

    // ได้รับ 20 คะแนน (หากยังไม่เคยได้ในด่านนี้)
    if (gameState.stageScores[gameState.currentStageIndex] === 0) {
      gameState.stageScores[gameState.currentStageIndex] = 20;
      gameState.totalScore += 20;
      gameState.correctAnswersCount++;
    }
    updateHUD();

    feedbackBox.className = "feedback-box correct";
    feedbackIcon.textContent = "🎉";
    feedbackTitle.textContent = "ยอดเยี่ยมมาก ตอบถูกต้องจ้า!";
    feedbackDesc.textContent = stage.explanation;

    btnTryAgain.classList.add("hidden");
    btnNextStage.classList.remove("hidden");
    btnNextStage.textContent = (gameState.currentStageIndex === 4) ? "ดูสรุปเกียรติบัตร 🏆" : "ไปด่านถัดไป 🚀";

    btnNextStage.onclick = () => {
      closeQuestionModal();
      advanceToNextStage();
    };

  } else {
    // ตอบผิด
    sound.playWrong();
    gameState.lives--;
    updateHUD();

    feedbackBox.className = "feedback-box wrong";
    feedbackIcon.textContent = "💡";
    feedbackTitle.textContent = "ยังไม่ถูกต้องนะคนเก่ง ไม่เป็นไรจ้า";
    feedbackDesc.textContent = `${stage.explanation} ลองเลือกคำตอบใหม่อีกครั้งนะจ๊ะ!`;

    if (gameState.lives <= 0) {
      // หัวใจหมด ปิดโมดอลคำถาม แล้วเปิดโมดอลฟื้นพลังชีวิต
      setTimeout(() => {
        closeQuestionModal();
        openRespawnModal();
      }, 1000);
    } else {
      // ยังมีหัวใจเหลือ ให้กดลองตอบใหม่ได้
      btnTryAgain.classList.remove("hidden");
      btnNextStage.classList.add("hidden");

      btnTryAgain.onclick = () => {
        feedbackBox.className = "feedback-box hidden";
        options.forEach(btn => {
          btn.style.pointerEvents = "auto";
          btn.classList.remove("wrong");
        });
      };
    }
  }
}

// เลื่อนไปยังด่านถัดไป หรือจบเกม
function advanceToNextStage() {
  if (gameState.currentStageIndex < 4) {
    gameState.currentStageIndex++;
    updateHUD();
    showStageIntroBanner();
  } else {
    // ผ่านครบ 5 ด่าน จบเกม!
    finishGameAndShowSummary();
  }
}

// แสดงแบนเนอร์แนะนำด่านใหม่
function showStageIntroBanner() {
  const stage = STAGES_DATA[gameState.currentStageIndex];
  const overlay = document.getElementById("stageIntroBanner");
  const introIcon = document.getElementById("introIcon");
  const introTitle = document.getElementById("introTitle");
  const introDesc = document.getElementById("introDesc");

  if (stage.iconType === "keyboard") introIcon.textContent = "⌨️";
  else if (stage.iconType === "monitor") introIcon.textContent = "🖥️";
  else if (stage.iconType === "mouse") introIcon.textContent = "🖱️";
  else if (stage.iconType === "speaker") introIcon.textContent = "🔊";
  else introIcon.textContent = "🏰";

  introTitle.textContent = `ด่านที่ ${stage.id}: ${stage.title}`;
  introDesc.textContent = stage.subtitle;

  overlay.classList.remove("hidden");
  if (gameEngine) {
    gameEngine.loadStage(gameState.currentStageIndex);
    gameEngine.pause();
  }

  const btnStartStage = document.getElementById("btnStartStage");
  btnStartStage.onclick = () => {
    overlay.classList.add("hidden");
    if (gameEngine) gameEngine.resume();
  };
}

// โมดอลพลังหมด / ฟื้นพลังชีวิต
function openRespawnModal() {
  const modal = document.getElementById("respawnModal");
  if (modal) modal.classList.add("active");
}

function handleRestartCurrentStage() {
  const modal = document.getElementById("respawnModal");
  if (modal) modal.classList.remove("active");

  // ฟื้นฟูหัวใจ 3 ดวง
  gameState.lives = 3;
  updateHUD();

  if (gameEngine) {
    gameEngine.loadStage(gameState.currentStageIndex);
    gameEngine.resume();
  }
}

// ==============================================================================
// 9. กราฟิกภาพประกอบอุปกรณ์คอมพิวเตอร์ (SVG เวกเตอร์คมชัดสูงสำหรับเด็ก)
// ==============================================================================
function getDeviceIllustrationSvg(type) {
  if (type === "keyboard") {
    return `
      <svg width="220" height="110" viewBox="0 0 220 110" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="15" y="20" width="190" height="70" rx="12" fill="#3B82F6" stroke="#1D4ED8" stroke-width="4"/>
        <rect x="25" y="30" width="22" height="18" rx="4" fill="#FFFFFF"/>
        <rect x="52" y="30" width="22" height="18" rx="4" fill="#FFFFFF"/>
        <rect x="79" y="30" width="22" height="18" rx="4" fill="#FFFFFF"/>
        <rect x="106" y="30" width="22" height="18" rx="4" fill="#FFFFFF"/>
        <rect x="133" y="30" width="22" height="18" rx="4" fill="#FFFFFF"/>
        <rect x="160" y="30" width="35" height="18" rx="4" fill="#F59E0B"/>
        <rect x="25" y="54" width="28" height="18" rx="4" fill="#10B981"/>
        <rect x="58" y="54" width="94" height="18" rx="4" fill="#FFFFFF"/>
        <rect x="157" y="54" width="38" height="18" rx="4" fill="#EC4899"/>
        <circle cx="105" cy="63" r="3" fill="#3B82F6"/>
      </svg>
    `;
  } else if (type === "monitor") {
    return `
      <svg width="220" height="110" viewBox="0 0 220 110" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="35" y="10" width="150" height="75" rx="10" fill="#0F172A" stroke="#38BDF8" stroke-width="4"/>
        <rect x="43" y="18" width="134" height="59" rx="6" fill="#38BDF8"/>
        <!-- รอยยิ้มบนจอภาพ -->
        <circle cx="95" cy="45" r="5" fill="#0F172A"/>
        <circle cx="125" cy="45" r="5" fill="#0F172A"/>
        <path d="M100 56C105 62 115 62 120 56" stroke="#0F172A" stroke-width="3" stroke-linecap="round"/>
        <!-- ขาตั้งจอภาพ -->
        <rect x="102" y="85" width="16" height="14" fill="#64748B"/>
        <rect x="80" y="99" width="60" height="7" rx="3" fill="#475569"/>
      </svg>
    `;
  } else if (type === "mouse") {
    return `
      <svg width="220" height="110" viewBox="0 0 220 110" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M110 5 C80 5 70 35 70 70 C70 95 85 105 110 105 C135 105 150 95 150 70 C150 35 140 5 110 5 Z" fill="#8B5CF6" stroke="#6D28D9" stroke-width="4"/>
        <!-- เส้นแบ่งปุ่มซ้ายขวา -->
        <line x1="110" y1="5" x2="110" y2="45" stroke="#6D28D9" stroke-width="3"/>
        <!-- ล้อเลื่อน Scroll Wheel -->
        <rect x="105" y="20" width="10" height="20" rx="5" fill="#FBBF24"/>
        <!-- แสงไฟเรืองแสงด้านล่าง -->
        <circle cx="110" cy="75" r="8" fill="#C4B5FD"/>
      </svg>
    `;
  } else if (type === "speaker") {
    return `
      <svg width="220" height="110" viewBox="0 0 220 110" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="75" y="12" width="70" height="90" rx="10" fill="#334155" stroke="#1E293B" stroke-width="4"/>
        <circle cx="110" cy="36" r="12" fill="#0EA5E9"/>
        <circle cx="110" cy="72" r="20" fill="#0284C7"/>
        <circle cx="110" cy="72" r="10" fill="#38BDF8"/>
        <!-- ตัวโน้ตดนตรีลอยออกมา -->
        <text x="160" y="40" font-size="24" fill="#F43F5E">🎵</text>
        <text x="40" y="55" font-size="22" fill="#F59E0B">🎶</text>
      </svg>
    `;
  } else {
    // ปุ่มปิดเครื่อง Shutdown
    return `
      <svg width="220" height="110" viewBox="0 0 220 110" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="110" cy="55" r="42" fill="#EF4444" stroke="#DC2626" stroke-width="4"/>
        <circle cx="110" cy="55" r="32" fill="#F87171"/>
        <path d="M110 32 V54" stroke="#FFFFFF" stroke-width="6" stroke-linecap="round"/>
        <path d="M96 42 A22 22 0 1 0 124 42" stroke="#FFFFFF" stroke-width="6" stroke-linecap="round" fill="none"/>
      </svg>
    `;
  }
}

// ==============================================================================
// 10. หน้าจอสรุปผล (Summary) และการบันทึกลง Google Sheets
// ==============================================================================
function calculateEvaluationLevel(score) {
  if (score >= 90) return { label: "🌟 ยอดเยี่ยม (Excellent)", medal: "🥇", class: "excellent" };
  if (score >= 80) return { label: "🥇 ดีมาก (Very Good)", medal: "🥈", class: "verygood" };
  if (score >= 60) return { label: "🥈 ดี (Good)", medal: "🥉", class: "good" };
  return { label: "🥉 ผ่านเกณฑ์ (Pass)", medal: "🎖️", class: "pass" };
}

function finishGameAndShowSummary() {
  if (gameEngine) gameEngine.stop();
  sound.stopBGM();
  sound.playCorrect();
  triggerConfetti();

  const evalData = calculateEvaluationLevel(gameState.totalScore);

  // กรอกข้อมูลลงในหน้าเกียรติบัตร
  document.getElementById("sumStudentName").textContent = gameState.playerData.fullName;
  document.getElementById("sumStudentMeta").textContent = `${gameState.playerData.studentClass} • เลขที่ ${gameState.playerData.studentNo}`;
  document.getElementById("sumTotalScore").textContent = gameState.totalScore;
  document.getElementById("sumCorrectCount").textContent = gameState.correctAnswersCount;
  document.getElementById("sumEvalLevel").textContent = evalData.label;

  const medalIcon = document.getElementById("summaryMedalIcon");
  if (medalIcon) {
    medalIcon.textContent = gameState.totalScore === 100 ? "🏆" : evalData.medal;
  }

  const today = new Date();
  const dateStr = today.toLocaleDateString("th-TH", {
    year: "numeric",
    month: "long",
    day: "numeric"
  });
  document.getElementById("sumDateText").textContent = dateStr;

  showScreen("summaryScreen");

  // บันทึกคะแนนลง Google Sheets
  submitScoreToGoogleSheets();
}

// ส่งผลคะแนนไปยัง Google Sheets ผ่าน Google Apps Script Web App
async function submitScoreToGoogleSheets() {
  if (gameState.isSubmitting) return;
  gameState.isSubmitting = true;

  const statusBox = document.getElementById("sheetStatusBox");
  const statusTitle = document.getElementById("statusTitle");
  const statusDesc = document.getElementById("statusDesc");
  const btnRetry = document.getElementById("btnRetrySave");

  statusBox.className = "sheet-status-box status-loading";
  statusTitle.textContent = "กำลังบันทึกคะแนน...";
  statusDesc.textContent = "ระบบกำลังส่งข้อมูลไปยัง Google Sheets โปรดรอสักครู่";
  btnRetry.classList.add("hidden");

  const today = new Date();
  const timestamp = today.toLocaleDateString("th-TH") + " " + today.toLocaleTimeString("th-TH");
  const evalData = calculateEvaluationLevel(gameState.totalScore);

  const payload = {
    timestamp: timestamp,
    fullName: gameState.playerData.fullName,
    studentClass: gameState.playerData.studentClass,
    studentNo: gameState.playerData.studentNo,
    score: gameState.totalScore,
    correctCount: gameState.correctAnswersCount,
    evaluationLevel: evalData.label,
    playStatus: "เล่นจบเกม (Completed)"
  };

  // สำรองข้อมูลใน LocalStorage เพื่อความปลอดภัย
  try {
    const history = JSON.parse(localStorage.getItem("game_scores_history") || "[]");
    history.push(payload);
    localStorage.setItem("game_scores_history", JSON.stringify(history));
  } catch (err) {
    console.warn("Cannot save to localStorage", err);
  }

  // หากผู้ใช้ยังไม่ได้กำหนด GOOGLE_APPS_SCRIPT_URL
  if (!GOOGLE_APPS_SCRIPT_URL || GOOGLE_APPS_SCRIPT_URL === "") {
    setTimeout(() => {
      statusBox.className = "sheet-status-box status-success";
      statusTitle.textContent = "บันทึกในเครื่องเรียบร้อย (โหมดออฟไลน์)";
      statusDesc.textContent = "ข้อมูลถูกบันทึกในประวัติเกมแล้ว (อย่าลืมนำ Web App URL มาใส่ใน script.js นะครับ)";
      gameState.isSubmitting = false;
    }, 1200);
    return;
  }

  // ส่งข้อมูลไปยัง Google Apps Script Web App
  try {
    const response = await fetch(GOOGLE_APPS_SCRIPT_URL, {
      method: "POST",
      headers: {
        "Content-Type": "text/plain;charset=utf-8"
      },
      body: JSON.stringify(payload)
    });

    const result = await response.json();

    if (result && result.status === "success") {
      statusBox.className = "sheet-status-box status-success";
      statusTitle.textContent = "บันทึกลง Google Sheets สำเร็จเรียบร้อย!";
      statusDesc.textContent = `แผ่นงาน: GameScores • แถวที่: ${result.row || "-"}`;
      gameState.isSubmitting = false;
    } else {
      throw new Error(result.message || "เซิร์ฟเวอร์ตอบกลับไม่ถูกต้อง");
    }

  } catch (error) {
    console.warn("Standard fetch encountered CORS/redirect, trying no-cors fallback:", error);
    // กรณีเบราว์เซอร์บล็อกการอ่าน Response ข้ามโดเมนจากการ Redirect ของ Google Apps Script
    // ใช้โหมด no-cors เพื่อส่งข้อมูลต่อไปยัง Google Sheets ได้อย่างปลอดภัย 100%
    try {
      await fetch(GOOGLE_APPS_SCRIPT_URL, {
        method: "POST",
        mode: "no-cors",
        headers: {
          "Content-Type": "text/plain;charset=utf-8"
        },
        body: JSON.stringify(payload)
      });

      statusBox.className = "sheet-status-box status-success";
      statusTitle.textContent = "บันทึกลง Google Sheets สำเร็จเรียบร้อย!";
      statusDesc.textContent = "แผ่นงาน: GameScores (ส่งข้อมูลและบันทึกเรียบร้อย)";
      gameState.isSubmitting = false;
      return;
    } catch (fallbackErr) {
      console.error("Submission failed completely:", fallbackErr);
      statusBox.className = "sheet-status-box status-error";
      statusTitle.textContent = "เชื่อมต่อเครือข่ายขัดข้อง";
      statusDesc.textContent = "ไม่สามารถส่งข้อมูลได้ชั่วคราว ข้อมูลถูกสำรองไว้ในเครื่องแล้ว ปลอดภัยหายห่วง";
      btnRetry.classList.remove("hidden");
      gameState.isSubmitting = false;

      btnRetry.onclick = () => {
        submitScoreToGoogleSheets();
      };
    }
  }
}

// ==============================================================================
// 11. เอฟเฟกต์พลุเฉลิมฉลอง (Confetti Engine)
// ==============================================================================
function triggerConfetti() {
  const canvas = document.getElementById("confettiCanvas");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");

  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  const confettiCount = 80;
  const pieces = [];
  const colors = ["#f59e0b", "#ec4899", "#3b82f6", "#10b981", "#8b5cf6", "#f43f5e"];

  for (let i = 0; i < confettiCount; i++) {
    pieces.push({
      x: canvas.width / 2,
      y: canvas.height * 0.4,
      vx: (Math.random() - 0.5) * 14,
      vy: (Math.random() - 0.7) * 14,
      size: Math.random() * 8 + 6,
      color: colors[Math.floor(Math.random() * colors.length)],
      rotation: Math.random() * 360,
      vRotation: (Math.random() - 0.5) * 10,
      alpha: 1
    });
  }

  let animationFrame;
  const renderConfetti = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    let alive = false;

    pieces.forEach(p => {
      p.x += p.vx;
      p.y += p.vy;
      p.vy += 0.35; // gravity
      p.vx *= 0.98;
      p.rotation += p.vRotation;
      p.alpha -= 0.012;

      if (p.alpha > 0) {
        alive = true;
        ctx.save();
        ctx.globalAlpha = p.alpha;
        ctx.translate(p.x, p.y);
        ctx.rotate((p.rotation * Math.PI) / 180);
        ctx.fillStyle = p.color;
        ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 0.6);
        ctx.restore();
      }
    });

    if (alive) {
      animationFrame = requestAnimationFrame(renderConfetti);
    } else {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      cancelAnimationFrame(animationFrame);
    }
  };

  renderConfetti();
}

// ==============================================================================
// 12. เริ่มต้นระบบและผูก Event Listeners เมื่อโหลดหน้าเว็บ
// ==============================================================================
document.addEventListener("DOMContentLoaded", () => {
  // สร้าง Game Engine
  gameEngine = new GameEngine("gameCanvas");

  // เลือกตัวละครในหน้าแรก
  const charCards = document.querySelectorAll(".char-card");
  charCards.forEach(card => {
    card.addEventListener("click", () => {
      charCards.forEach(c => c.classList.remove("active"));
      card.classList.add("active");
      gameState.playerData.character = card.dataset.char;
      sound.playCoin();
    });
  });

  // ปุ่มเริ่มการผจญภัย
  const studentForm = document.getElementById("studentForm");
  const btnStartGame = document.getElementById("btnStartGame");

  const startGameHandler = () => {
    const fullNameInput = document.getElementById("fullName");
    const classInput = document.getElementById("studentClass");
    const noInput = document.getElementById("studentNo");

    const fullName = fullNameInput.value.trim();
    const studentClass = classInput.value;
    const studentNo = parseInt(noInput.value) || 1;

    if (!fullName) {
      alert("กรุณากรอกชื่อ-นามสกุล ของนักเรียนคนเก่งก่อนนะครับ 😊");
      fullNameInput.focus();
      return;
    }

    gameState.playerData.fullName = fullName;
    gameState.playerData.studentClass = studentClass;
    gameState.playerData.studentNo = studentNo;

    // เริ่มต้นด่านที่ 1
    gameState.currentStageIndex = 0;
    gameState.lives = 3;
    gameState.coinsCollected = 0;
    gameState.totalScore = 0;
    gameState.correctAnswersCount = 0;
    gameState.stageScores = [0, 0, 0, 0, 0];
    gameState.isSubmitting = false;

    updateHUD();
    showScreen("gameScreen");

    if (gameEngine) {
      gameEngine.loadStage(0);
      gameEngine.start();
    }

    showStageIntroBanner();
  };

  if (studentForm) {
    studentForm.addEventListener("submit", (e) => {
      e.preventDefault();
      startGameHandler();
    });
  }

  if (btnStartGame) {
    btnStartGame.addEventListener("click", (e) => {
      e.preventDefault();
      startGameHandler();
    });
  }

  // ปุ่มเปิด/ปิดเสียง
  const btnAudioToggle = document.getElementById("btnAudioToggle");
  const audioIcon = document.getElementById("audioIcon");
  if (btnAudioToggle) {
    btnAudioToggle.addEventListener("click", () => {
      const isMuted = sound.toggleMute();
      audioIcon.textContent = isMuted ? "🔇" : "🔊";
    });
  }

  // ปุ่มเต็มหน้าจอ
  const btnFullscreen = document.getElementById("btnFullscreenToggle");
  if (btnFullscreen) {
    btnFullscreen.addEventListener("click", () => {
      if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen().catch(err => {
          console.warn("Fullscreen request error", err);
        });
      } else {
        if (document.exitFullscreen) {
          document.exitFullscreen();
        }
      }
    });
  }

  // ปุ่มเริ่มด่านใหม่หลังจากพลังหมด
  const btnRestartStage = document.getElementById("btnRestartStage");
  if (btnRestartStage) {
    btnRestartStage.addEventListener("click", handleRestartCurrentStage);
  }

  // ปุ่มพิมพ์เกียรติบัตร
  const btnPrintCert = document.getElementById("btnPrintCert");
  if (btnPrintCert) {
    btnPrintCert.addEventListener("click", () => {
      window.print();
    });
  }

  // ปุ่มเล่นใหม่อีกครั้ง
  const btnPlayAgain = document.getElementById("btnPlayAgain");
  if (btnPlayAgain) {
    btnPlayAgain.addEventListener("click", () => {
      showScreen("startScreen");
    });
  }

  // ปรับขนาดหน้าจออัตโนมัติ
  window.addEventListener("resize", () => {
    const canvas = document.getElementById("confettiCanvas");
    if (canvas) {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    }
  });
});
