console.log("hello!");
// const BASE_URL = `http://127.0.0.1:3000/${folder}/`;
let currentSong = new Audio();
let songs;
let currFolder;
const cardContainer = document.querySelector(".cardContainer");

async function getSongs(folder) {
  currFolder = folder;
  let response = await fetch(`http://127.0.0.1:3000/${currFolder}`);
  let result = await response.text();
  let resultJson;
  let div = document.createElement("div");
  div.innerHTML = result;
  let a = div.getElementsByTagName("a");

  let infoResponse = await fetch(
    `http://127.0.0.1:3000/${currFolder}/info.json`
  );
  let folderInfo = {}; // Initialize as empty object
  try {
    folderInfo = await infoResponse.json(); // Parse the JSON
  } catch (error) {
    console.error(
      `Error fetching or parsing info.json for ${currFolder}:`,
      error
    );
    // Fallback: if info.json is not found or invalid, Artist will be undefined
    // You might want to set a default Artist here if no info.json exists.
    folderInfo.Artist = "Unknown Artist"; // Default artist if file not found/valid
  }

  const artistName = folderInfo.Artist || "Unknown Artist";

  songs = [];
  for (let index = 0; index < a.length; index++) {
    const element = a[index];
    if (element.href.endsWith(".mp3")) {
      songs.push(element.href.split(`/${folder}/`)[1]);
    }
  }

  let songUL = document
    .querySelector(".songList")
    .getElementsByTagName("ul")[0];
  songUL.innerHTML = "";
  for (const song of songs) {
    songUL.innerHTML =
      songUL.innerHTML +
      `<li>
                <img src="img/music.svg" alt="" />
                <div class="info">
                    <div>${song.replaceAll("%20", " ")}</div>
                    <div>${artistName}</div>
                </div>
                <img class="libraryPlayIcon" src="img/playsongbtn.svg" alt="">
      </li>`;
  }

  Array.from(
    document.querySelector(".songList").getElementsByTagName("li")
  ).forEach((e) => {
    e.addEventListener("click", (element) => {
      playMusic(e.querySelector(".info div:first-child").innerText.trim());
    });
  });
  return songs; // Return songs to be used in the main function
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
  currentSong.src = `http://127.0.0.1:3000/${currFolder}/` + songName; // Ensure full path for src
  if (!pause) {
    currentSong.play();
    play.src = "img/pause.svg";
  }
  document.querySelector(".songInfo").innerText = decodeURI(songName);
  document.querySelector(".songTime").innerText = "00:00 / 00:00";
};

async function displaySongs() {
  let response = await fetch(`http://127.0.0.1:3000/songs/`);
  let result = await response.text();

  let div = document.createElement("div");
  div.innerHTML = result;
  let anchors = div.getElementsByTagName("a");
  let array = Array.from(anchors);


  for (let index = 0; index < array.length; index++) {
    const e = array[index];
    if (e.href.includes("/songs/")) {
      let folderName = e.href.split("/").slice(-2)[0];
      //Get Metadata of the folder
      let infoResponse = await fetch(
        `http://127.0.0.1:3000/songs/${folderName}/info.json`
      );
      let infoResult = await infoResponse.json();
      cardContainer.innerHTML +=
        `<div data-folder= ${folderName} class="card card-rect">
                <img class="coverImage" src="/songs/${folderName}/cover.jpeg" alt="" />
                <div class="playIcon">
                  <img src="img/play-iconbutton.svg" alt="" />
                </div>
                <h3>${infoResult.title}</h3>
                <p>${infoResult.Artist}</p>
              </div>`;
    }
  }
  //add event listener for folder to load
  Array.from(document.getElementsByClassName("card")).forEach((e) => {
    e.addEventListener("click", async (item) => {
      songs = await getSongs(`songs/${item.currentTarget.dataset.folder}`);
      playMusic(songs[0]); // Play the first song of the newly loaded folder
    });
  });
}

async function main() {
  displaySongs();

  
  // Define previous and next elements
  const previous = document.getElementById("previous");
  const next = document.getElementById("next");
  const play = document.getElementById("play");
  const volumeSlider = document.getElementById("volumeSlider");
  
  songs = await getSongs(`songs/afsos`); // Assign the returned songs to the global 'songs' variable
  playMusic(songs[0], true);

  play.addEventListener("click", (e) => {
    if (currentSong.paused) {
      currentSong.play();
      play.src = "img/pause.svg";
    } else {
      currentSong.pause();
      play.src = "img/playsongbtn.svg";
    }
  });

  currentSong.addEventListener("timeupdate", () => {
    document.querySelector(".songTime").innerHTML = `${secondsToMinutes(
      currentSong.currentTime
    )} / ${secondsToMinutes(currentSong.duration)}`;
    document.querySelector(".circle").style.left =
      (currentSong.currentTime / currentSong.duration) * 100 + "%";
  });

  document.querySelector(".seekbar").addEventListener("click", (e) => {
    //update the circle where the mouse is clicked
    let percent = (e.offsetX / e.target.getBoundingClientRect().width) * 100;
    document.querySelector(".circle").style.left = percent + "%";

    //update the music current time according where the seekbar is
    currentSong.currentTime = (currentSong.duration * percent) / 100;
  });

  //Add event listener for previous and next buttons
  previous.addEventListener("click", (e) => {
    console.log("previous Clicked");
    let currentSongName = currentSong.src.split("/").pop(); // Get just the song file name
    let index = songs.indexOf(currentSongName);
    if (index - 1 >= 0) {
      playMusic(songs[index - 1]);
    }
  });

  next.addEventListener("click", (e) => {
    console.log("next Clicked");
    let currentSongName = currentSong.src.split("/").pop(); // Get just the song file name
    let index = songs.indexOf(currentSongName);
    if (index + 1 < songs.length) {
      playMusic(songs[index + 1]);
    }
  });

  //Add event listener for hamburger
  document.querySelector(".hamburger").addEventListener("click", (e) => {
    document.querySelector(".left").style.left = 0 + "%";
  });

  //Add event listener for close buttons
  document.querySelector(".close").addEventListener("click", (e) => {
    document.querySelector(".left").style.left = -200 + "%";
  });

  //Add event listener for Volume Update
  volumeSlider.addEventListener("change", (e) => {
    currentSong.volume = parseInt(e.target.value) / 100;
  });

  //add event listener to mute the music
  document.querySelector(".volumeIcon").addEventListener("click", (e) => {
    if (e.target.src.includes("img/volume.svg")) {
      e.target.src = e.target.src.replace("img/volume.svg", "img/mute.svg");
      currentSong.volume = 0;
      volumeSlider.value = 0;
    } else {
      e.target.src = e.target.src.replace("img/mute.svg", "img/volume.svg");
      currentSong.volume = 0.1;
      volumeSlider.value = 10;
    }
  });
}

main();
