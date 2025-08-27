/** js file that plays loaded videos in random order */

let videoList = [];
let remainingVids = [];
let videoElements = [];
let activeIndex = 0; // 0 or 1
let credits = [];
let credits_open = true;
const videoContainer = document.getElementById('my-container');
const pausedText = document.getElementById('pausedText');

// load videos from api
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

// initialize 2 video players
async function init() {
    try {
        videoList = await loadVideos();
        if (!videoList || videoList.length === 0) return;
        remainingVids = videoList.slice();
        credits = ['open.mp4', 'close.mp4'];

        // get the two video elements from HTML
        videoElements = [
            document.getElementById('video1'),
            document.getElementById('video2')
        ];

        videoElements.forEach(video => {
            video.controls = false;
            video.tabIndex = 0;
            video.addEventListener('ended', playNext);
            video.addEventListener('click', playPause);
            video.addEventListener('keydown', e => {
                if (e.key === ' ' || e.key === 'Enter') playPause();
            });
        });

        // show first video
        newVideo();
    } catch (err) {
        console.error('Error initializing player:', err);
    }
}

// play next video (triggered on video end)
function playNext() {
    newVideo();
}

// pause or resume the currently visible video safely
function playPause() {
    const currentVideo = videoElements[activeIndex];
    if (!currentVideo) return; // exit if video element is not ready
    try {
        if (currentVideo.paused) {
            currentVideo.play().catch(err => console.warn('Play error:', err));
            if (pausedText) pausedText.style.display = 'none';
        } else {
            currentVideo.pause();
            if (pausedText) pausedText.style.display = 'block';
        }
    } catch (err) {
        console.error('Error in playPause:', err);
    }
}

// play a new video with crossfade
function newVideo() {
    const nextIndex = 1 - activeIndex; // switch video element
    const currentVideo = videoElements[activeIndex];
    const nextVideo = videoElements[nextIndex];
    const newIndex = Math.floor(Math.random() * remainingVids.length);
    const nextVideoFile = remainingVids.splice(newIndex, 1)[0];
    console.log(remainingVids);
    console.log('videoList.length : ' + videoList.length);
    console.log('remainingVids.length : ' + remainingVids.length);

    // this is a bit of a cheat, still skipping first video
    // plus wont work if more than one clip per video
    // use % videoList.length

    if (remainingVids.length == videoList.length - 1) {

        nextVideo.src = 'credits/open.mp4';
        nextVideo.play().catch(err => console.warn('Play error:', err));

        // cross-fade
        currentVideo.classList.remove('active');
        nextVideo.classList.add('active');

        credits_open = false;

    } else if (remainingVids.length !== 0) {
        nextVideo.src = `videos/${nextVideoFile}`;
        nextVideo.play().catch(err => console.warn('Play error:', err));

        // cross-fade
        currentVideo.classList.remove('active');
        nextVideo.classList.add('active');

    } else if (remainingVids.length === 0) {   
        remainingVids = videoList.slice();   

        nextVideo.src = 'credits/close.mp4';
        nextVideo.play().catch(err => console.warn('Play error:', err));

        // cross-fade
        currentVideo.classList.remove('active');
        nextVideo.classList.add('active');
    }

    activeIndex = nextIndex;
}

init();
