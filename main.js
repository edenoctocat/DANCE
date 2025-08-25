/** js file that plays loaded videos in random order */

const pausedText = document.getElementById('pausedText');
const videoContainer = document.getElementById('my-container');
const videoDirectoryPath = 'videos/';
let videoList = [];
let remainingVids = [];
let videoElement; // single video element

// load video filenames from api
async function loadVideos() {
    try {
        const res = await fetch('/videolist');
        const videos = await res.json();
        console.log('video files from server:', videos);
        return videos;
    } catch (err) {
        console.error('Error loading videos:', err);
        return [];
    }
}

// init video player
async function init() {
    try {
        videoList = await loadVideos();
        if (!videoList || videoList.length === 0) {
            console.warn('No videos found.');
            return;
        }

        remainingVids = videoList.slice();

        // create ONE video element and append to container
        videoElement = document.createElement('video');
        videoElement.classList.add('my-video');

        // note syntax below --
        // more modern & easier to read to do without setAttribute
        // videoElement.setAttribute('autoplay', '');

        // no need for autoplay since play() is called in newVideo()
        // videoElement.autoplay = true;
        videoElement.tabIndex = 0;
        videoElement.controls = false;
        videoContainer.appendChild(videoElement);

        // load first random video
        newVideo();

        // add event listeners
        videoElement.addEventListener('ended', playNext);
        videoElement.addEventListener('click', playPause);
        videoElement.addEventListener('keydown', playPause);

    } catch (err) {
        console.error('Error initializing player:', err);
    }
}

/*
    the functions that follow are inherently global in scope so
    should be outside of init()
*/

// play next random video
function playNext() {
    if (remainingVids.length === 0) {
        // reset the pool when we've played all videos
        remainingVids = videoList.slice();
    }
    newVideo();
}

// load new random video into the video player
function newVideo() {
    const newIndex = Math.floor(Math.random() * remainingVids.length);
    const nextVideoFile = remainingVids[newIndex];
    console.log("Now playing:", nextVideoFile);

    // swap video source
    videoElement.src = videoDirectoryPath + nextVideoFile;
    videoElement.load();

    // attempt autoplay (requires user interaction first due to browser policy)
    videoElement.play().catch(() => {
        console.log("Autoplay blocked until user interacts.");
    });

    // Remove played video from the remaining list
    remainingVids.splice(newIndex, 1);
}

// toggle play/pause on click or keydown
function playPause() {
    if (videoElement.paused || videoElement.currentTime <= 0) {
        console.log("Playing");
        pausedText.classList.add('hidden');
        videoElement.play();
    } else {
        console.log("Pausing");
        pausedText.classList.remove('hidden');
        videoElement.pause();
    }
}

init();
