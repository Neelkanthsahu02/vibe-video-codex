import { Command } from 'commander';
import { renderWithRemotion } from '../core/render/local-renderer.js';

const program = new Command();
program.requiredOption('--entry <file>').requiredOption('--composition <id>').requiredOption('--out <file>');
program.parse();
const opts = program.opts();

await renderWithRemotion(opts.entry, opts.composition, opts.out);
console.log(`Rendered output: ${opts.out}`);
