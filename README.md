# Autonomous AI Video Editor (Local-First)

Phase 1 implementation for Channel Style Library Builder.

## Setup

1. Install Node dependencies: `npm install`
2. Install Python dependencies: `pip install -r python/requirements.txt`
3. Ensure `ffmpeg`, `ffprobe`, and `python3` are available.
4. Set `OPENROUTER_API_KEY`.

## Folder Structure

- `style-library/<channel>/video_analyses/*`
- `asset-library/{transitions,sfx,music,animated-backgrounds,lower-thirds,title-cards,motion-graphics}`
- `projects/` for future project runs

## Phase 1 Commands

- Analyze one reference video:
  `npm run analyze:video -- --video /path/to/video.mp4 --channel SpillRumors --sfx-dir asset-library/sfx`

- Build channel style profile from multiple analyses:
  `npm run build:channel-style -- --channel SpillRumors`

## Additional Deliverables Included

- Scene planner scaffold using style profile:
  `npm run plan:scene -- --script ./projects/p1/input/script.txt --voiceover-seconds 600 --profile style-library/spillrumors/channel_style_profile.json --out projects/p1/plan/scene_plan.json`

- Basic Remotion timeline JSON generator:
  `npm run timeline:generate -- --scene-plan projects/p1/plan/scene_plan.json --approved-assets projects/p1/assets/approved/assets.json --out projects/p1/render/remotion_timeline.json`
