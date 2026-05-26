import argparse
import json
import os
import librosa
import numpy as np


def load_mono(path, sr=22050):
    y, _ = librosa.load(path, sr=sr, mono=True)
    return y


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument('--video', required=True)
    parser.add_argument('--sfx-dir', required=True)
    args = parser.parse_args()

    video_audio, sr = librosa.load(args.video, sr=22050, mono=True)
    matches = []

    for name in os.listdir(args.sfx_dir):
        p = os.path.join(args.sfx_dir, name)
        if not os.path.isfile(p):
            continue
        try:
            sfx = load_mono(p, sr)
            if len(sfx) < 2048:
                continue
            corr = np.correlate(video_audio[: min(len(video_audio), 22050 * 600)], sfx[: min(len(sfx), 22050 * 5)], mode='valid')
            peak = int(np.argmax(corr))
            conf = float(np.max(corr) / (np.linalg.norm(sfx) + 1e-6))
            matches.append({
                'matched_filename': name,
                'timestamp': peak / sr,
                'confidence': min(1.0, conf / 1000.0),
                'reason': 'Cross-correlation peak against SFX fingerprint window'
            })
        except Exception:
            continue

    print(json.dumps(sorted(matches, key=lambda x: x['confidence'], reverse=True)[:200]))


if __name__ == '__main__':
    main()
