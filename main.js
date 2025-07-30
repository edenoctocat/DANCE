/** in this file, chooses random videos, loads, and plays */

const videoElements = document.querySelectorAll(".my-video"); 
const videoList = ['video1', 'video2', 'video3', 'video4', 'video5'];
let remainingVids = videoList.slice()

function playNext() {
    let currentVideo = document.getElementById(this.id);
    if (remainingVids.length == 0) {
        remainingVids = videoList.slice();
    }
    newVideo();
    currentVideo.style.visibility = "hidden";
    console.log(remainingVids);
}

function newVideo() {
    newIndex = Math.floor(Math.random() * remainingVids.length);
    console.log(newIndex);
    let nextVideo = document.getElementById(remainingVids[newIndex]);
    nextVideo.style.visibility = "visible";
    nextVideo.play();
    remainingVids.splice(newIndex, 1);
}

function playPause() {
    let currentVideo = document.getElementById(this.id);
    if ((currentVideo.currentTime <= 0 || currentVideo.paused || currentVideo.ended) && currentVideo.readyState > 2) {
        console.log("playing");
        currentVideo.play();
    }
    else {
        console.log("pausing");
        currentVideo.pause();
    }
}

window.onload = newVideo();

videoElements.forEach(element => {
    element.addEventListener('ended', playNext);
    element.addEventListener('click', playPause);
});
