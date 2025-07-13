console.log("hello!");
const BASE_URL = "http://127.0.0.1:3000/songs/";

async function getSongs() {
  let response = await fetch("http://127.0.0.1:3000/songs/");
  let result = await response.text();
  // console.log(result);
  let div = document.createElement("div");
  div.innerHTML = result;
  // console.log(div);
  let a = div.getElementsByTagName("a");
  // console.log(a);
  let songs = [];
  for (let index = 0; index < a.length; index++) {
    const element = a[index];
    // console.log(element);
    if (element.href.endsWith(".mp3")) {
      songs.push(element.href.split("/songs/")[1]);
    }
  }
  return songs;
}

async function main() {
  let songs = await getSongs();
  console.log(songs);

  var audio = new Audio(songs[0]);
  //   audio.play();
    let songUL = document.querySelector(".songList").getElementsByTagName("ul")[0];
    for (const song of songs) {
        songUL.innerHTML = songUL.innerHTML + `<li>
                <img src="music.svg" alt="" />
                <div class="info">
                    <div>${song.replaceAll("%20", " ")}</div>
                    <div>harry</div>
                </div>
                <img src="playsongbtn.svg" alt="">
              </li>`;
    }
  audio.addEventListener("loadeddata", () => {
    let duration = audio.duration;
    console.log(duration);
  });
}

main();
