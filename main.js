/** js file that plays loaded videos in random order */

const pausedText = document.getElementById('pausedText');
const videoContainer = document.getElementById('my-container');
const videoDirectoryPath = 'videos/';
let videoElements = [];

// group video state object
const state = {
  videoList: [],      // all videos
  remainingVids: [],  // videos left to play
  nextFile: null,    // filename of video playing up next
  currentIndex: null,  // index of video player in use
  playing: false      // keep track of playing
};


// initialize by getting video list from api, choosing 2, and showing loading screen
async function init() {
    const loading = document.getElementById("loading");

    try {
        loading.style.display = "block";
        videoContainer.style.display = "none";

        // fetch all video file names from server
        const res = await fetch('/videolist');
        const videos = await res.json();
        console.log('video files from server:', videos);

        if (!videos || videos.length === 0) return;

        state.videoList = videos;
        state.remainingVids = videos.slice(); // remainingVids set as copy of all videos

        videoElements = [
            document.getElementById('video1'),
            document.getElementById('video2')
        ];

        // add video player interaction
        videoElements.forEach(element => {
            element.addEventListener('ended', playNext);
            element.addEventListener('click', playPause);
            element.addEventListener('keydown', e => {
                    if (e.key === ' ' || e.key === 'Enter') playPause();
                });
        }); 

        // initialize video player
        state.currentIndex = 1;
        state.nextFile = newVideo();
        let video1 = document.getElementById('video1');
        video1.src = `videos/${state.nextFile}`;

        // hide loading once videos are ready
        loading.style.display = "none";
        videoContainer.style.display = "block";

        // load window with new video
        window.onload = playNext();

    } catch (err) {
        loading.textContent = "Error loading videos";
        console.error('Error:', err);
    }
}

// functions for video interaction 

function playNext(event) {
    let currentVideo = videoElements[state.currentIndex];
    let nextIndex = 1 - state.currentIndex;
    let nextVideo = videoElements[nextIndex];
    state.currentIndex = nextIndex; // update index

    // play next video and hide current video
    console.log("playing", state.nextFile, "on video player", state.currentIndex);
    nextVideo.style.visibility = "visible";
    nextVideo.play().catch(err => console.warn('Play error:', err));
    currentVideo.style.visibility = "hidden";

    if (state.remainingVids.length == 0) {
        console.log("end of video list")
        state.remainingVids = state.videoList.slice(); // reload all videos if done
        const indexOfFile = state.remainingVids.indexOf(state.nextFile);
        if (indexOfFile > -1) { 
            state.remainingVids.splice(indexOfFile, 1); // avoid repeating videos directly
        }
    }
    
    console.log("remaining videos:", state.remainingVids);

    // load video that will play after next (to help speed)
    state.nextFile = newVideo();
    let videoAfter = currentVideo;
    videoAfter.src = `videos/${state.nextFile}`; // will play after nextVideo
    videoAfter.pause(); // make sure it is paused at beginning
    videoAfter.currentTime = 0; // rewind video

    console.log("playing video after:", state.nextFile);
}

function newVideo() {
    // function to choose random video from remaining videos
    let newIndex = Math.floor(Math.random() * state.remainingVids.length);
    return state.remainingVids.splice(newIndex, 1)[0];
}

function playPause(event) {
    let currentVideo = videoElements[state.currentIndex];
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

init();