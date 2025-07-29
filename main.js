/** in this file, chooses random videos, loads, and plays */

const videoElements = document.querySelectorAll(".my-video"); 
/** const videoList = ['video1.mp4', 'video2.mp4', 'video3.mp4', 'video4.mp4', 'video5.mp4']; */
const videoList = ['video1', 'video2', 'video3', 'video4', 'video5'];
let videoIndex = 0;
let remainingVids = videoList.slice()

function chooseNext() {
    if (remainingVids.length != 0) {
        newIndex = Math.floor(Math.random() * remainingVids.length);
        let currentVideo = document.getElementById(this.id);
        let nextVideo = document.getElementById(remainingVids[newIndex]);
        currentVideo.style.visibility = "hidden";
        nextVideo.style.visibility = "visible";
        nextVideo.play(); // doesn't like .play() without interaction in most browsers 
        videoIndex = newIndex;
        remainingVids.splice(videoIndex, 1);
        console.log(remainingVids);
    }
    else {
        remainingVids = videoList.slice();
        chooseNext();
    }
    console.log(remainingVids);
}

function startVideo() {
    newIndex = Math.floor(Math.random() * remainingVids.length);
    console.log(newIndex);
    let nextVideo = document.getElementById(remainingVids[newIndex]);
    nextVideo.style.visibility = "visible";
    nextVideo.addEventListener("click", function() {
        nextVideo.play();
    });
    remainingVids.splice(videoIndex, 1);
}

window.onload = startVideo();

videoElements.forEach(element => {
    element.addEventListener('ended', chooseNext);
    /** element.addEventListener('onclick', playPause); */
});
