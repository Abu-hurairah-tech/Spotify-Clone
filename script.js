console.log("hello!");
const BASE_URL = "http://127.0.0.1:3000/songs/";
let currentSong = new Audio();

async function getSongs() {
  let response = await fetch(BASE_URL);
  let result = await response.text();

  let div = document.createElement("div");
  div.innerHTML = result;
  let a = div.getElementsByTagName("a");

  let songs = [];
  for (let index = 0; index < a.length; index++) {
    const element = a[index];
    if (element.href.endsWith(".mp3")) {
      songs.push(element.href.split("/songs/")[1]);
    }
  }
  return songs;
}

function secondsToMinutes(seconds) {
  if (isNaN(seconds) || seconds < 0) {
    return "00:00";
  }

  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);
  const formattedMinutes = String(minutes).padStart(2, "0");
  const formattedSeconds = String(remainingSeconds).padStart(2, "0");

  return `${formattedMinutes}:${formattedSeconds}`;
}

const playMusic = (songName, pause = false) => {
  currentSong.src = "/songs/" + songName;
  if (!pause) {
    currentSong.play();
    play.src = "pause.svg";
  }
  document.querySelector(".songInfo").innerText = decodeURI(songName);
  document.querySelector(".songTime").innerText = "00:00 / 00:00";
};

async function main() {
  let songs = await getSongs();
  playMusic(songs[0], true);

  let songUL = document
    .querySelector(".songList")
    .getElementsByTagName("ul")[0];
  for (const song of songs) {
    songUL.innerHTML =
      songUL.innerHTML +
      `<li>
                <img src="music.svg" alt="" />
                <div class="info">
                    <div>${song.replaceAll("%20", " ")}</div>
                    <div>harry</div>
                </div>
                <img class="libraryPlayIcon" src="playsongbtn.svg" alt="">
      </li>`;
  }

  Array.from(
    document.querySelector(".songList").getElementsByTagName("li")
  ).forEach((e) => {
    e.addEventListener("click", (element) => {
      // console.log(e.getElementsByTagName("div")[1].innerText);
      playMusic(e.getElementsByTagName("div")[1].innerText.trim());
    });
  });

  play.addEventListener("click", (e) => {
    if (currentSong.paused) {
      currentSong.play();
      play.src = "pause.svg";
    } else {
      currentSong.pause();
      play.src = "playsongbtn.svg";
    }
  });

  currentSong.addEventListener("timeupdate", () => {
    // console.log(currentSong.currentTime, currentSong.duration);
    document.querySelector(".songTime").innerHTML = `${secondsToMinutes(
      currentSong.currentTime
    )} / ${secondsToMinutes(currentSong.duration)}`;
    document.querySelector(".circle").style.left =
      (currentSong.currentTime / currentSong.duration) * 100 + "%";
  });

  document.querySelector(".seekbar").addEventListener("click", (e) => {
    // console.log(e.offsetX, e.target.getBoundingClientRect());
    //update the circle where the mouse is clicked
    let percent = (e.offsetX / e.target.getBoundingClientRect().width) * 100;
    document.querySelector(".circle").style.left = percent + "%";

    //update the music current time according where the seekbar is
    currentSong.currentTime = (currentSong.duration * percent) / 100;
  });

  //Add event listener for hamburger
  document.querySelector(".hamburger").addEventListener("click", (e) => {
    document.querySelector(".left").style.left = 0 + "%";
  });

  //Add event listener for close
  document.querySelector(".close").addEventListener("click", (e) => {
    document.querySelector(".left").style.left = -200 + "%";
  });
}

main();
