import { Command } from 'commander';
import { sourceAssetsForProject } from '../core/sourcing/asset-sourcer.js';

const program = new Command();
program.requiredOption('--project-root <path>');
program.parse();
const opts = program.opts();

const out = await sourceAssetsForProject(opts.projectRoot);
console.log(`Asset candidates saved: ${out}`);
