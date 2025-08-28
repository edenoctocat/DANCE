/** js file that plays loaded videos in random order */

let videoList = [];
let remainingVids = [];
let videoElements = [];
let activeIndex = 0; // 0 or 1
let show_credits_open = true;
let show_credits_close = false;
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

        // show video
        playNext();
    } catch (err) {
        console.error('Error initializing player:', err);
    }
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

// safe playback in chrome and other browsers
async function safePlay(video) {
    console.log('** safePlay called **');
    video.playbackRate = 5.0;     // ** dev **

    // wait until video is ready to play
    if (video.readyState < 3) {
        await new Promise(resolve => {
            const onReady = () => {
                video.removeEventListener("canplay", onReady);
                resolve();
            };
            video.addEventListener("canplay", onReady);
        });
    }

    // attempt play, handle chrome autoplay restrictions
    try {
        await video.play();
        console.log("Playback started:", video.src);
    } catch (err) {
        console.warn("Playback blocked:", err);
    }
}

// play next video with crossfade
function playNext() {
    console.log('** newVideo called **');
    console.log(remainingVids);
    console.log('videoList.length : ' + videoList.length);
    console.log('remainingVids.length : ' + remainingVids.length);

    // swap html video elements
    const nextIndex = 1 - activeIndex; // switch video element
    const currentVideo = videoElements[activeIndex];
    const nextVideo = videoElements[nextIndex];

    // this is a bit of a cheat, still skipping first video
    // plus wont work if more than one clip per video
    // use % videoList.length

    if (remainingVids.length % videoList.length === 0 && show_credits_open) {
        
        // play opening credit
        nextVideo.src = 'credits/open.mp4'; 
        show_credits_open = false;

    } else if (remainingVids.length % videoList.length === 0 && show_credits_close) {

        // play closing credit
        nextVideo.src = 'credits/close.mp4'; 
        remainingVids = videoList.slice(); // reset remaining video list
        show_credits_open = true;
        show_credits_close = false;

    } else {

        // play next random video
        const newIndex = Math.floor(Math.random() * remainingVids.length);
        const nextVideoFile = remainingVids.splice(newIndex, 1)[0];
        nextVideo.src = `videos/${nextVideoFile}`;
        show_credits_close = true;
    }
        
    safePlay(nextVideo);
        
    // cross-fade
    currentVideo.classList.remove('active');
    nextVideo.classList.add('active');

    activeIndex = nextIndex;
}

init();
