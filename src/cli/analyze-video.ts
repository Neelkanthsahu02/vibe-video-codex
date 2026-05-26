import { Command } from 'commander';
import { join, basename } from 'node:path';
import { analyzeVideo } from '../core/analysis/video-analyzer.js';

const program = new Command();
program
  .requiredOption('--video <path>')
  .requiredOption('--channel <name>')
  .option('--sfx-dir <path>', 'SFX pack directory', 'asset-library/sfx')
  .option('--style-root <path>', 'Style library root', 'style-library');

program.parse();
const opts = program.opts();

const slug = opts.channel.toLowerCase().replace(/\s+/g, '-');
const outDir = join(opts.styleRoot, slug, 'video_analyses', basename(opts.video).replace(/\.[^.]+$/, ''));

await analyzeVideo({ videoPath: opts.video, outputDir: outDir, sfxDir: opts.sfxDir });
console.log(`Analysis completed: ${outDir}`);
