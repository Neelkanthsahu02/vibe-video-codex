import { mkdir, writeFile, readFile } from 'node:fs/promises';
import { dirname } from 'node:path';

export async function writeJson(path: string, value: unknown): Promise<void> {
  await mkdir(dirname(path), { recursive: true });
  await writeFile(path, JSON.stringify(value, null, 2), 'utf-8');
}

export async function readJson<T>(path: string): Promise<T> {
  const raw = await readFile(path, 'utf-8');
  return JSON.parse(raw) as T;
}

export async function writeText(path: string, text: string): Promise<void> {
  await mkdir(dirname(path), { recursive: true });
  await writeFile(path, text, 'utf-8');
}
