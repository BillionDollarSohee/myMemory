// ====================== 기본 세팅 ======================
// 연도 표기
document.getElementById("year").textContent = new Date().getFullYear();

// navbar.html 불러오기
fetch("navBar.html")
  .then(res => res.text())
  .then(data => {
    document.getElementById("navbar-placeholder").innerHTML = data;
  });

// === 브라우저 기본 드롭 동작 막기 ===
document.addEventListener("dragover", (e) => e.preventDefault());
document.addEventListener("drop", (e) => e.preventDefault());

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
const bgImages = [
  "image/cassette.jpg",
  "image/dodiunsplash.jpg",
  "image/pexels-pixabay-164853.jpg",
  "image/pexelsaaronsvd12544.jpg",
  "image/pexelspixabay164967.jpg",
  "image/pixabay159613.jpg",
  "image/unsplash.jpg"
];

let currentIndex = 0;   // 초기 인덱스
let isPlaying = false;  // 재생 상태
let isShuffle = false;
let isRepeat = false;

let currentImage = null;
let targetImage = null;
let fadeAlpha = 0;
let fadeSpeed = 0.05;       // 크로스페이드 속도 (0.01 ~ 0.1 사이 추천)

// ====================== 배경 이미지별 색상 매핑 ======================
let currentBgIndex = 0; // 현재 배경 이미지 인덱스
let barColor = "#ffffff7e"; // 기본 바 색상
const imageColors = {
  "image/cassette.jpg": "#ff578175",      
  "image/dodiunsplash.jpg": "#9a32b465",  
  "image/pexels-pixabay-164853.jpg": "#3f502d", 
  "image/pexelsaaronsvd12544.jpg": "#b6b6b659",   
  "image/pexelspixabay164967.jpg": "#dabf6883",   
  "image/pixabay159613.jpg": "#40847273", 
  "image/unsplash.jpg": "#ff408091"       
};

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
// 드래그 앤 드롭
const dropZone = document.getElementById("dropZone");
const myPlaylist = document.getElementById("myPlaylist");

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

// ====================== 보조 함수 ======================
function hexToRgb(hex) {
  hex = hex.replace("#", "");
  const bigint = parseInt(hex, 16);
  const r = (bigint >> 16) & 255;
  const g = (bigint >> 8) & 255;
  const b = bigint & 255;
  return [r, g, b];
}

function lerp(a, b, t) {
  return a + (b - a) * t;
}

// ====================== 상태 변수 보강 ======================
let prevBarColor = barColor;
let targetBarColor = barColor;

// ====================== 함수 ======================
// 곡 로드
function loadSong(index) {
  audio.src = songs[index].src;
  nowPlaying.textContent = "지금 재생 중인 곡 : " + songs[index].title;

  // 🎨 배경 이미지 로드
  currentBgIndex = index % bgImages.length;  // 현재 배경 인덱스 저장
  const img = new Image();
  img.src = bgImages[currentBgIndex];
  img.onload = () => {
    targetImage = img;
    fadeAlpha = 0;

    // 새로운 색상 목표값 설정
    const imgSrc = bgImages[currentBgIndex].split("?")[0];
    prevBarColor = barColor;
    targetBarColor = imageColors[imgSrc] || "#91919180";

    if (!currentImage) {
      currentImage = img;
      // 매핑된 색상으로 교체
      barColor = targetBarColor;
    }
  };
}

// 아이콘 전환
function setPlayIcon(playing) {
  if (playing) {
    playIcon.textContent = "pause"; // ⏸
  } else {
    playIcon.textContent = "play_arrow"; // ▶
  }
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
function updateVolumeSlider() {
  const value = parseFloat(volumeControl.value);
  const percent = (value - volumeControl.min) / (volumeControl.max - volumeControl.min) * 100;

  // 차분한 핑크 계열
  const startColor = "#f7aac9"; // 연한 핑크
  const endColor   = "#d94f8c"; // 차분한 진핑크

  // 채워진 부분만 색상, 나머지는 투명
  volumeControl.style.background = `linear-gradient(to right, 
    ${startColor} 0%, 
    ${endColor} ${percent}%, 
    transparent ${percent}%, 
    transparent 100%)`;

  volumeValue.textContent = Math.round(value * 100);
}

volumeControl.addEventListener("input", (e) => {
  audio.volume = parseFloat(e.target.value);
  updateVolumeSlider();
});


// ====================== 드래그 앤 드롭 ======================
dropZone.addEventListener("dragover", (e) => {
  e.preventDefault();
  dropZone.classList.add("dragover");
});

dropZone.addEventListener("dragleave", () => {
  dropZone.classList.remove("dragover");
});

dropZone.addEventListener("drop", (e) => {
  e.preventDefault();
  dropZone.classList.remove("dragover");

  const files = e.dataTransfer.files;
  Array.from(files).forEach((file) => {
    if (file.type === "audio/mp3" || file.name.endsWith(".mp3")) {
      const url = URL.createObjectURL(file);
      const title = file.name.replace(".mp3", "");

      const newSong = { title, src: url };
      songs.push(newSong);

      // 🔽 하단 리스트에 표시
      const li = document.createElement("li");
      li.className = "list-group-item d-flex justify-content-between align-items-center";
      li.textContent = title;

      const playBtn = document.createElement("button");
      playBtn.textContent = "▶";
      playBtn.className = "btn btn-sm btn-outline-primary";
      playBtn.addEventListener("click", () => {
        currentIndex = songs.indexOf(newSong);
        loadSong(currentIndex);
        audio.play();
        isPlaying = true;
        setPlayIcon(true);
      });

      li.appendChild(playBtn);
      myPlaylist.appendChild(li);

      // 드롭한 첫 곡 자동 재생
      currentIndex = songs.length - 1;
      loadSong(currentIndex);
      audio.play();
      isPlaying = true;
      setPlayIcon(true);
    }
  });
});

// ====================== 비주얼라이저 ======================
function draw() {
  requestAnimationFrame(draw);
  analyser.getByteFrequencyData(dataArray);

  // 현재 배경 그리기
  if (currentImage) {
    ctx.globalAlpha = 1;
    ctx.drawImage(currentImage, 0, 0, canvas.width, canvas.height);
  } else {
    ctx.fillStyle = "#111";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }

    // 페이드 효과
    if (targetImage) {
    fadeAlpha += 0.02;
    if (fadeAlpha >= 1) {
        fadeAlpha = 1;
        currentImage = targetImage;
        targetImage = null;

        // ✅ 배경 이미지 경로 기준으로 색상 지정
        const imgSrc = bgImages[currentBgIndex];
        barColor = imageColors[imgSrc] || "#fff"; 
    }
    ctx.globalAlpha = fadeAlpha;
    ctx.drawImage(currentImage, 0, 0, canvas.width, canvas.height);
    ctx.globalAlpha = 1;
    }

    // EQ 막대
    const barWidth = (canvas.width / bufferLength) * 1.5;
    let x = 0;

    // 현재 배경 이미지 확인
    let imgSrc = bgImages[currentBgIndex] || "";
    // 혹시 전체 경로나 캐시 파라미터(#, ?)가 붙으면 파일명만 추출
    imgSrc = imgSrc.split("?")[0]; 
    // 매핑된 색상 (없으면 기본 흰색)
    const currentBarColor = imageColors[imgSrc] || "#fff";

    for (let i = 0; i < bufferLength; i++) {
    const barHeight = dataArray[i];
    ctx.fillStyle = currentBarColor;
    ctx.fillRect(
        x,
        canvas.height - barHeight / 2,
        barWidth,
        barHeight / 2
    );
    x += barWidth + 1;
    }
}

// ====================== 초기화 ======================
loadSong(currentIndex);
updateVolumeSlider();
draw();