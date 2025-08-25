/** js file that plays loaded videos in random order */

const pausedText = document.getElementById('pausedText');
const videoContainer = document.getElementById('my-container');
const videoDirectoryPath = 'videos/';

// group video state object
const state = {
  videoList: [],      // all videos
  remainingVids: [],  // videos left to play
  currentVideoId: null,  // the one playing right now
  playing: false        // keep track of playing
};

// use api from server.js to get video list

async function loadVideos() {
    try {
        const res = await fetch('/videolist');
        const videos = await res.json();
        console.log('video files from server:', videos);
        return videos;

    } catch (err) {
        console.error('Error:', err);
    }
}

async function init() {
    state.videoList = await loadVideos();
    console.log('vids:', state.videoList);
    state.remainingVids = state.videoList.slice(); // remainingVids set as copy of all videos

    renderVideos(state);
    setupVideoInteractions(state);
}

function renderVideos(state) {
    // update index.html with videos from file

    state.videoList.forEach(video => {
        const videoElement = document.createElement('video');
        videoElement.setAttribute('id', video); // id is same as file name
        console.log('id:', video.slice(0, -4));
        videoElement.setAttribute('class', 'my-video');
        videoElement.setAttribute('src', videoDirectoryPath + video);
        videoElement.setAttribute('autoplay', '');
        videoElement.setAttribute('tabindex', '0');
        // videoElement.setAttribute('type', 'video/mp4');
        videoContainer.appendChild(videoElement);
    }); 

}

function setupVideoInteractions(state) {
    // functions for video interaction 

    function playNext(event) {
        let currentVideo = event.target;
        if (state.remainingVids.length == 0) {
            state.remainingVids = state.videoList.slice();
            state.remainingVids.splice(state.currentIndex, 1); // avoid repeating videos
        }
        newVideo();
        currentVideo.style.visibility = "hidden";
        // currentVideo.setAttribute('tabindex', '1');
        currentVideo.currentTime = 0; // rewind video
        console.log("remaining videos:", state.remainingVids);
    }

    function newVideo() {
        let newIndex = Math.floor(Math.random() * state.remainingVids.length);
        console.log("next video:", state.remainingVids[newIndex]);
        let nextVideo = document.getElementById(state.remainingVids[newIndex]);
        nextVideo.style.visibility = "visible";
        // nextVideo.setAttribute('tabindex', '0');
        nextVideo.play();
        // update state
        state.currentVideoId = state.remainingVids[newIndex];
        state.remainingVids.splice(newIndex, 1);
        console.log("state:", state);
    }

    function playPause(event) {
        // let currentVideo = event.target;
        let currentVideo = document.getElementById(state.currentVideoId);
        if ((currentVideo.currentTime <= 0 || currentVideo.paused || currentVideo.ended) && currentVideo.readyState > 2) {
            console.log("playing");
            pausedText.classList.add('hidden');
            currentVideo.play();
        }
        else {
            console.log("pausing");
            pausedText.classList.remove('hidden');
            currentVideo.pause();
        }
    }

    // adding event listeners to videos

    const videoElements = document.querySelectorAll(".my-video"); 

    videoElements.forEach(element => {
        element.addEventListener('ended', playNext);
        element.addEventListener('click', playPause);
        element.addEventListener('keydown', playPause);
    }); 

    // load window with new video
    window.onload = newVideo();

}

init();