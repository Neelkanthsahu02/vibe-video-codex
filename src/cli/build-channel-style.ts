import { Command } from 'commander';
import { join } from 'node:path';
import { readdir } from 'node:fs/promises';
import { readJson } from '../utils/fs.js';
import { buildChannelStyleProfile } from '../core/style/channel-style-builder.js';
import type { VideoAnalysis } from '../types/domain.js';

const program = new Command();
program.requiredOption('--channel <name>').option('--niche <text>', 'Channel niche', 'celebrity gossip documentary').option('--style-root <path>', 'Style root', 'style-library');
program.parse();
const opts = program.opts();
const slug = opts.channel.toLowerCase().replace(/\s+/g, '-');
const analysesDir = join(opts.styleRoot, slug, 'video_analyses');
const folders = await readdir(analysesDir);
const analyses: VideoAnalysis[] = [];
for (const folder of folders) {
  analyses.push(await readJson<VideoAnalysis>(join(analysesDir, folder, 'video_analysis.json')));
}
const outPath = join(opts.styleRoot, slug, 'channel_style_profile.json');
await buildChannelStyleProfile({ channelName: opts.channel, niche: opts.niche, analyses, outputPath: outPath });
console.log(`Channel style profile generated: ${outPath}`);
