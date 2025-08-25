#!/bin/bash

# Usage: ./split.sh [clip_length_in_seconds]
CLIP_LENGTH=${1:-10}  # Default to 10 seconds if no argument is provided

# Confirm running from root directory
cd "$(dirname "$0")"

# Clean up all existing mp4 in videos/
rm -f videos/*.mp4

# Find shortest video in src/
shortest_seconds=$(for f in src/*.mp4; do
    ffprobe -v error -select_streams v:0 -show_entries stream=duration \
            -of default=noprint_wrappers=1:nokey=1 "$f"
done | sort -n | head -1)

# Round down to integer
shortest_seconds=${shortest_seconds%.*}

# Ensure the shortest video is at least as long as the clip length
if (( shortest_seconds < CLIP_LENGTH )); then
    echo "Error: Shortest video ($shortest_seconds s) is shorter than clip length ($CLIP_LENGTH s)."
    exit 1
fi

# Calculate number of clips that will be made from each video
num_clips=$(( shortest_seconds / CLIP_LENGTH ))

# hard-coded for dev
num_clips=3

echo "Shortest video is $shortest_seconds seconds. Each video will produce $num_clips clips of $CLIP_LENGTH seconds."

# exit 

# Process each video in src/
for f in src/*.mp4; do
    name=$(basename "$f" .mp4)
    
    # Get total duration of this video in seconds
    total_seconds=$(ffprobe -v error -select_streams v:0 -show_entries stream=duration \
                    -of default=noprint_wrappers=1:nokey=1 "$f")
    total_seconds=${total_seconds%.*}

    # Skip video if it's shorter than clip length
    if (( total_seconds < CLIP_LENGTH )); then
        echo "Skipping $name: shorter than clip length ($total_seconds s)."
        continue
    fi

    echo "Processing $name..."

    # Remove old clips for this video
    rm -f "videos/${name}_"*.mp4

    for ((i=0; i<num_clips; i++)); do
        # Choose a random start time such that clip fits inside video
        max_start=$(( total_seconds - CLIP_LENGTH ))
        start=$(( RANDOM % (max_start + 1) ))

        # Output file
        output="videos/${name}_$(printf "%03d" $i).mp4"

        # Extract clip
        ffmpeg -y -ss "$start" -i "$f" -t "$CLIP_LENGTH" -c copy "$output"
    done

    echo "Done: $name"
done

echo "🔥 All eligible videos processed. Originals remain in src/"

# Open Chrome
open -a "Google Chrome" http://localhost:8080
