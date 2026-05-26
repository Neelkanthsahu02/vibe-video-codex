# Autonomous AI Video Editor (Local-First)

## Setup
1. `npm install`
2. `pip install -r python/requirements.txt`
3. Install local binaries: `ffmpeg`, `ffprobe`, `yt-dlp`
4. Set env vars:
   - `OPENROUTER_API_KEY`
   - `BRAVE_SEARCH_API_KEY`

## Pipeline

### Phase 1 — Style Library Builder
- Analyze reference video:
  - `npm run analyze:video -- --video /path/to/ref.mp4 --channel SpillRumors --sfx-dir asset-library/sfx`
- Build channel profile:
  - `npm run build:channel-style -- --channel SpillRumors`

### Phase 2 — Scene Planner
- `npm run plan:scene -- --script projects/p1/input/script.txt --voiceover projects/p1/input/voiceover.wav --profile style-library/spillrumors/channel_style_profile.json --out projects/p1/plan/scene_plan.json`

### Phase 3 — Asset Sourcing
- `npm run source:assets -- --project-root projects/p1`

### Phase 4 — Visual QC
- `npm run review:assets -- --project-root projects/p1`

### Phase 5 — Timeline Builder
- `npm run timeline:generate -- --scene-plan projects/p1/plan/scene_plan.json --approved-assets projects/p1/assets/approved/asset_review.json --voiceover projects/p1/input/voiceover.wav --out projects/p1/render/remotion_timeline.json`

### Phase 6 — Local Render
- `npm run render:video -- --entry src/remotion/index.ts --composition MainVideo --out projects/p1/exports/final.mp4`

## Core directories
- `style-library/<channel>/`
- `projects/<project-name>/input|plan|assets|render|exports`
- `asset-library/transitions|sfx|music|animated-backgrounds|lower-thirds|title-cards|motion-graphics`
