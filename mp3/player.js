// 연도 표기
document.getElementById('year').textContent = new Date().getFullYear();

// navbar.html 불러오기
fetch("navBar.html")
  .then(res => res.text())
  .then(data => {
    document.getElementById("navbar-placeholder").innerHTML = data;
  });

// 곡 목록
const songs = [
  { title: "31km", src: "music/31km.mp3" },
  { title: "109", src: "music/109.mp3" },
  { title: "airplay", src: "music/airplay.mp3" },
  { title: "Always", src: "music/Always.mp3" },
  // ... (기존 리스트 그대로)
];

// 오디오 관련 변수
let currentIndex = 0;
let isPlaying = false;

const audio = document.getElementById("audio");
const nowPlaying = document.getElementById("nowPlaying");
const playPauseBtn = document.getElementById("playPauseBtn");
const prevBtn = document.getElementById("prevBtn");
const nextBtn = document.getElementById("nextBtn");
const playIcon = document.getElementById("playIcon");
const volumeControl = document.getElementById("volumeControl");

// AudioContext + 비주얼라이저
const canvas = document.getElementById("visualizer");
const ctx = canvas.getContext("2d");
const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
const analyser = audioCtx.createAnalyser();
const source = audioCtx.createMediaElementSource(audio);
source.connect(analyser);
analyser.connect(audioCtx.destination);

analyser.fftSize = 256;
const bufferLength = analyser.frequencyBinCount;
const dataArray = new Uint8Array(bufferLength);

// 아이콘 토글
function setPlayIcon(playing) {
  if (playing) {
    playIcon.innerHTML = `<path d="M6 5h4v14H6zM14 5h4v14h-4z"></path>`; // ⏸
  } else {
    playIcon.innerHTML = `<path d="M8 5v14l11-7z"></path>`; // ▶
  }
}

// 곡 로드
function loadSong(index) {
  audio.src = songs[index].src;
  nowPlaying.textContent = "지금 재생 중: " + songs[index].title;
}

// ▶ / ⏸ 버튼
playPauseBtn.addEventListener("click", async () => {
  try {
    await audioCtx.resume();
    if (audio.paused) {
      await audio.play();
      isPlaying = true;
    } else {
      audio.pause();
      isPlaying = false;
    }
    setPlayIcon(isPlaying);
  } catch (err) {
    console.error("재생 실패:", err);
  }
});

// ⏮ 이전곡
prevBtn.addEventListener("click", () => {
  currentIndex = (currentIndex - 1 + songs.length) % songs.length;
  loadSong(currentIndex);
  audio.play();
  isPlaying = true;
  setPlayIcon(isPlaying);
});

// ⏭ 다음곡
nextBtn.addEventListener("click", () => {
  currentIndex = (currentIndex + 1) % songs.length;
  loadSong(currentIndex);
  audio.play();
  isPlaying = true;
  setPlayIcon(isPlaying);
});

// 곡이 끝났을 때 자동 다음곡
audio.addEventListener("ended", () => {
  nextBtn.click();
});

// 🔊 볼륨 컨트롤
volumeControl.addEventListener("input", (e) => {
  audio.volume = e.target.value;
});

// 비주얼라이저
function draw() {
  const bgImage = new Image();
  bgImage.src = "image/unsplash.jpg";

  requestAnimationFrame(draw);
  analyser.getByteFrequencyData(dataArray);

  if (bgImage.complete) {
    ctx.drawImage(bgImage, 0, 0, canvas.width, canvas.height);
  } else {
    ctx.fillStyle = "#111";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }

  const barWidth = (canvas.width / bufferLength) * 2.5;
  let x = 0;

  for (let i = 0; i < bufferLength; i++) {
    const barHeight = dataArray[i];
    ctx.fillStyle = `rgba(${barHeight + 100},50,150,0.7)`;
    ctx.fillRect(x, canvas.height - barHeight / 2, barWidth, barHeight / 2);
    x += barWidth + 1;
  }
}
draw();

// 첫 곡 로드
loadSong(currentIndex);
