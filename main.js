/** js file that plays loaded videos in random order */

const pausedText = document.getElementById('pausedText');
const videoContainer = document.getElementById('my-container');
const videoDirectoryPath = 'videos/';
var videoList = [];
var remainingVids = [];

// use api from server.js to get video list

async function loadVideos() {
    try {
        const res = await fetch('/videolist');
        videos = await res.json();
        console.log('video files from server:', videos);
        return videos;

    } catch (err) {
        console.error('Error:', err);
    }
}

async function init() {
    videoList = await loadVideos();
    console.log('vids:', videoList);

    // update index.html with videos from file
    // ** better to make only a few videoElements and swap source **

    /*       
        Option 1 — Use .src and .load() ✅ 

        const videoElement = document.querySelector('.my-video');

        // Swap video source
        videoElement.src = videoDirectoryPath + 'newVideo.mp4';

        // Force the browser to load the new video
        videoElement.load();

        // Optional: autoplay it immediately
        videoElement.
    */

    videoList.forEach(video => {
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

    const videoElements = document.querySelectorAll(".my-video"); 
    remainingVids = videoList.slice();
    console.log('remaining video list:', remainingVids);

    // functions for video interaction 

    function playNext() {
        let currentVideo = document.getElementById(this.id);
        if (remainingVids.length == 0) {
            remainingVids = videoList.slice();
        }
        newVideo();
        // currentVideo.style.visibility = "hidden";
        currentVideo.style.opacity = "0.0";
        console.log(remainingVids);
    }

    function newVideo() {
        let newIndex = Math.floor(Math.random() * remainingVids.length);
        console.log(remainingVids[newIndex]);
        let nextVideo = document.getElementById(remainingVids[newIndex]);
        // nextVideo.style.visibility = "visible";
        nextVideo.style.opacity = "1.0";
        nextVideo.play();
        remainingVids.splice(newIndex, 1);
    }

    function playPause() {
        let currentVideo = document.getElementById(this.id);
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

    // Because newVideo() is inside init(), this line won’t actually work 
    // the way you expect — window.onload is being set before init() 
    // even runs, so the function isn’t in scope yet.
    // window.onload = newVideo();

    videoElements.forEach(element => {
        element.addEventListener('ended', playNext);
        element.addEventListener('click', playPause);
        element.addEventListener('keydown', playPause);
    });

    newVideo(); 
}

init();
