import argparse
import json
from scenedetect import open_video, SceneManager
from scenedetect.detectors import ContentDetector


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument('--video', required=True)
    parser.add_argument('--threshold', type=float, default=28.0)
    args = parser.parse_args()

    video = open_video(args.video)
    manager = SceneManager()
    manager.add_detector(ContentDetector(threshold=args.threshold))
    manager.detect_scenes(video)
    scenes = manager.get_scene_list()

    results = []
    for s, e in scenes:
      start = s.get_seconds()
      end = e.get_seconds()
      results.append({
          'start': start,
          'end': end,
          'duration': max(0.0, end - start)
      })
    print(json.dumps(results))

if __name__ == '__main__':
    main()
