// ====================== 기본 세팅 ======================
// 연도 표기
document.getElementById("year").textContent = new Date().getFullYear();

// navbar.html 불러오기
fetch("navBar.html")
  .then(res => res.text())
  .then(data => {
    document.getElementById("navbar-placeholder").innerHTML = data;
  });

// ====================== 곡 목록 ======================
const songs = [
  { title: "31km", src: "music/31km.mp3" },
  { title: "109", src: "music/109.mp3" },
  { title: "airplay", src: "music/airplay.mp3" },
  { title: "Always", src: "music/Always.mp3" },
  { title: "BUSSTOP", src: "music/BUSSTOP.mp3" },
  { title: "Can_I_Love", src: "music/Can_I_Love.mp3" },
  { title: "Can't_Stop_Loving_You", src: "music/Can't_Stop_Loving_You.mp3" },
  { title: "Charcoal_Just_for_you", src: "music/Charcoal_Just_for_you.mp3" },
  { title: "CherryBerry", src: "music/CherryBerry.mp3" },
  { title: "chungchun", src: "music/chungchun.mp3" },
  { title: "dogundogun", src: "music/dogundogun.mp3" },
  { title: "Dream", src: "music/Dream.mp3" },
  { title: "goodByestar", src: "music/goodByestar.mp3" },
  { title: "HOLIDAY", src: "music/HOLIDAY.mp3" },
  { title: "HONEY", src: "music/HONEY.mp3" },
  { title: "How_I_Feel", src: "music/How_I_Feel.mp3" },
  { title: "IKNOW", src: "music/IKNOW.mp3" },
  { title: "Ipray", src: "music/Ipray.mp3" },
  { title: "letsGoSeeStar", src: "music/letsGoSeeStar.mp3" },
  { title: "likelastday", src: "music/likelastday.mp3" },
  { title: "living", src: "music/living.mp3" },
  { title: "missyounight", src: "music/missyounight.mp3" },
  { title: "MoonMoon", src: "music/MoonMoon.mp3" },
  { title: "morning", src: "music/morning.mp3" },
  { title: "mrKim", src: "music/mrKim.mp3" },
  { title: "mung", src: "music/mung.mp3" },
  { title: "neednangman", src: "music/neednangman.mp3" },
  { title: "NightOff_sleep", src: "music/NightOff_sleep.mp3" },
  { title: "onlyIKnow", src: "music/onlyIKnow.mp3" },
  { title: "passible", src: "music/passible.mp3" },
  { title: "PerhapsLove", src: "music/PerhapsLove.mp3" },
  { title: "pullpush", src: "music/pullpush.mp3" },
  { title: "RIDE", src: "music/RIDE.mp3" },
  { title: "SAGA", src: "music/SAGA.mp3" },
  { title: "sal", src: "music/sal.mp3" },
  { title: "someDay", src: "music/someDay.mp3" },
  { title: "starOne", src: "music/starOne.mp3" },
  { title: "Stars", src: "music/Stars.mp3" },
  { title: "sweety", src: "music/sweety.mp3" }
];

// ====================== 상태 변수 ======================
let currentIndex = 0;
let isPlaying = false;
let isShuffle = false;
let isRepeat = false;

// ====================== DOM 요소 ======================
const audio = document.getElementById("audio");
const nowPlaying = document.getElementById("nowPlaying");
const playPauseBtn = document.getElementById("playPauseBtn");
const prevBtn = document.getElementById("prevBtn");
const nextBtn = document.getElementById("nextBtn");
const playIcon = document.getElementById("playIcon");
const volumeControl = document.getElementById("volumeControl");
const volumeValue = document.getElementById("volumeValue");
const shuffleBtn = document.getElementById("shuffleBtn");
const repeatBtn = document.getElementById("repeatBtn");

// ====================== 오디오 비주얼라이저 ======================
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

// ====================== 함수 ======================
// 곡 로드
function loadSong(index) {
  audio.src = songs[index].src;
  nowPlaying.textContent = "지금 재생 중인 곡 : " + songs[index].title;
}

// 아이콘 전환
function setPlayIcon(playing) {
  if (playing) {
    playIcon.textContent = "pause"; // ⏸
  } else {
    playIcon.textContent = "play_arrow"; // ▶
  }
}

// 랜덤 인덱스
function getRandomIndex() {
  let randomIndex;
  do {
    randomIndex = Math.floor(Math.random() * songs.length);
  } while (randomIndex === currentIndex);
  return randomIndex;
}

// 볼륨 슬라이더 UI
function updateVolumeSlider() {
  const value = volumeControl.value;
  const percent = (value - volumeControl.min) / (volumeControl.max - volumeControl.min) * 100;
  volumeControl.style.background = `linear-gradient(to right, gold ${percent}%, #ccc ${percent}%)`;
  volumeValue.textContent = Math.round(value * 100);
}

// ====================== 이벤트 리스너 ======================
// ▶ / ⏸
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

// 🔀 셔플
shuffleBtn.addEventListener("click", () => {
  isShuffle = !isShuffle;
  shuffleBtn.classList.toggle("active", isShuffle);
});

// 🔁 반복
repeatBtn.addEventListener("click", () => {
  isRepeat = !isRepeat;
  repeatBtn.classList.toggle("active", isRepeat);
});

// 곡 종료 이벤트
audio.addEventListener("ended", () => {
  if (isRepeat) {
    audio.currentTime = 0;
    audio.play();
  } else if (isShuffle) {
    currentIndex = getRandomIndex();
    loadSong(currentIndex);
    audio.play();
  } else {
    nextBtn.click();
  }
});

// 🔊 볼륨 컨트롤
volumeControl.addEventListener("input", (e) => {
  audio.volume = e.target.value;
  updateVolumeSlider();
});

// ====================== 비주얼라이저 ======================
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

// ====================== 초기화 ======================
loadSong(currentIndex);
updateVolumeSlider();
