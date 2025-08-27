Testing video player in HTML/JS.

This works in Chrome (video.play() not available in Safari)

To force Chrome to render in absolute pixels so screen recording can work as expected, use:

    open -a "Google Chrome" --args --force-device-scale-factor=1


