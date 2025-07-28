/** in this file, interactivity with choosing random videos */

const videoElement = document.getElementById('myVideo'); 
const videoList = ['video1.mp4', 'video2.mp4', 'video3.mp4', 'video4.mp4', 'video5.mp4'];
var videoIndex = 0;
var remainingVids = videoList.slice()

function getRandomVideo() {
    randomIndex = Math.floor(Math.random() * remainingVids.length);
    return "/filepath/DANCE/videos/" + remainingVids[randomIndex];
}

function playNext() {
    if (remainingVids != []) {
        videoElement.src = getRandomVideo();
        videoElement.play();
        remainingVids.slice()
    }
    else remainingVids = videoList.splice()
}

window.onload = playNext();

videoElement.addEventListener('ended', playNext);
