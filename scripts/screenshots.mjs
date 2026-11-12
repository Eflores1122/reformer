import { spawn } from 'node:child_process';
import { mkdir } from 'node:fs/promises';
import { chromium } from 'playwright';

const port = 4173;
const base = `http://127.0.0.1:${port}/reformer/`;
const server = spawn(process.execPath, ['node_modules/vite/bin/vite.js', 'preview', '--host', '127.0.0.1', '--port', String(port), '--strictPort'], {
  stdio: 'inherit'
});

const stop = () => {
  if (server.exitCode === null) server.kill('SIGTERM');
};

async function waitForServer() {
  const deadline = Date.now() + 30000;
  while (Date.now() < deadline) {
    if (server.exitCode !== null) throw new Error('El preview terminó antes de responder.');
    try {
      const response = await fetch(base);
      if (response.ok) return;
    } catch {
      // El servidor todavía no acepta conexiones.
    }
    await new Promise(resolve => setTimeout(resolve, 300));
  }
  throw new Error('El preview no respondió a tiempo.');
}

try {
  await waitForServer();
  await mkdir('docs/screenshots', { recursive: true });
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1280, height: 900 }, reducedMotion: 'reduce' });
  await page.goto(base, { waitUntil: 'domcontentloaded' });
  await page.getByRole('heading', { name: 'Tu sesión' }).waitFor();
  await page.evaluate(() => document.fonts.ready);
  await page.screenshot({ path: 'docs/screenshots/crear.png' });

  await page.getByLabel('Tu intención de hoy').fill('Pecho y glúteos durante 25 minutos para principiantes');
  await page.getByRole('button', { name: 'Crear mi rutina', exact: true }).click();
  await page.getByRole('heading', { name: 'Pecho + Glúteos', exact: true }).waitFor();
  await page.evaluate(() => document.fonts.ready);
  await page.screenshot({ path: 'docs/screenshots/rutina.png' });

  await page.goto(`${base}#biblioteca`, { waitUntil: 'domcontentloaded' });
  await page.locator('.exercise-card').nth(12).waitFor();
  await page.evaluate(() => document.fonts.ready);
  await page.screenshot({ path: 'docs/screenshots/biblioteca.png' });
  await browser.close();
} finally {
  stop();
}
