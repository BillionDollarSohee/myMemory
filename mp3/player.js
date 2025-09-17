// 연도 표기
document.getElementById('year').textContent = new Date().getFullYear();

// navbar.html 불러오기
fetch("navBar.html")
  .then(res => res.text())
  .then(data => {
    document.getElementById("navbar-placeholder").innerHTML = data;
  });

// 기본 내장된 곡 목록
const songs = [ { title: "31km", src: "music/31km.mp3" },
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

// 드래그 앤 드롭 이벤트
const dropZone = document.getElementById("dropZone");

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

      // 내 리스트에 표시
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

      // 드롭된 첫 곡은 자동 재생
      currentIndex = songs.length - 1;
      loadSong(currentIndex);
      audio.play();
      isPlaying = true;
      setPlayIcon(true);
    }
  });
});


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
  nowPlaying.textContent = "지금 재생 중인 곡 : " + songs[index].title;
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
function updateVolumeSlider() {
  const value = volumeControl.value;
  const percent = (value - volumeControl.min) / (volumeControl.max - volumeControl.min) * 100;
  
  // 채워지는 부분
  volumeControl.style.background = `linear-gradient(to right, gold ${percent}%, #ccc ${percent}%)`;
  
  // 숫자 (0~100으로 변환)
  volumeValue.textContent = Math.round(value * 100);
}

volumeControl.addEventListener("input", (e) => {
  audio.volume = e.target.value;
  updateVolumeSlider();
});

// 초기 실행
updateVolumeSlider();

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

// 새로운 노래 추가 기능
const addSongForm = document.getElementById("addSongForm");
const songTitleInput = document.getElementById("songTitle");
const songSrcInput = document.getElementById("songSrc");
const myPlaylist = document.getElementById("myPlaylist");

// 새로운 곡 추가
addSongForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const title = songTitleInput.value.trim();
  const src = songSrcInput.value.trim();

  if (title && src) {
    // 곡 목록에 추가
    songs.push({ title, src });

    // 내 리스트에 표시
    const li = document.createElement("li");
    li.className = "list-group-item d-flex justify-content-between align-items-center";
    li.textContent = title;

    // ▶ 버튼 (해당 곡 재생)
    const playBtn = document.createElement("button");
    playBtn.textContent = "▶";
    playBtn.className = "btn btn-sm btn-outline-primary";
    playBtn.addEventListener("click", () => {
      currentIndex = songs.length - 1; // 방금 추가된 곡 인덱스
      loadSong(currentIndex);
      audio.play();
      isPlaying = true;
      setPlayIcon(true);
    });

    li.appendChild(playBtn);
    myPlaylist.appendChild(li);

    // 입력 초기화
    songTitleInput.value = "";
    songSrcInput.value = "";
  }
});
