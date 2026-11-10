import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

const axe = (page: import('@playwright/test').Page) => new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21aa']).analyze();

test('cada ficha tiene inicio, final y un video, y la biblioteca pasa axe', async ({ page }) => {
  await page.goto('#biblioteca');
  const cards = page.locator('.exercise-card');
  await expect(cards).toHaveCount(13);
  const rows = await cards.evaluateAll(nodes => nodes.map(node => ({
    video: node.getAttribute('data-video-id'),
    figures: node.querySelectorAll('svg.exercise-figure').length
  })));
  expect(rows).toHaveLength(13);
  for (const row of rows) {
    expect(row.video).toMatch(/^[A-Za-z0-9_-]{11}$/);
    expect(row.figures).toBe(2);
  }
  expect((await axe(page)).violations).toEqual([]);
  await page.getByLabel('Filtrar por resorte').selectOption('correas');
  await expect(page.locator('.exercise-card')).toHaveCount(8);
  await expect(page.getByRole('heading', { name: 'Abrazo al árbol', exact: true })).toBeVisible();
  await page.getByLabel('Filtrar por resorte').selectOption('');
  await page.locator('.exercise-card').filter({ hasText: 'Extensión de brazos sentado' }).click();
  const dialog = page.getByRole('dialog');
  await expect(dialog.getByRole('img', { name: /Inicio de Extensión de brazos sentado/ })).toBeVisible();
  await expect(dialog.getByRole('img', { name: /Final de Extensión de brazos sentado/ })).toBeVisible();
  await expect(dialog.getByRole('button', { name: 'Ver demostración', exact: true })).toBeVisible();
  await expect(dialog.locator('iframe')).toHaveCount(0);
  await expect(dialog.locator('img.video-thumb')).toHaveAttribute('src', /Erl0o3VseOU/);
  expect((await axe(page)).violations).toEqual([]);
  await page.keyboard.press('Escape');
  await page.locator('.exercise-card').filter({ hasText: 'Hundred con rodillas flexionadas' }).click();
  await expect(page.getByRole('dialog').locator('img.video-thumb')).toHaveAttribute('src', /akFkx5vzXgs/);
  await expect(page.getByRole('dialog').locator('iframe')).toHaveCount(0);
});

test('el temporizador muestra el dibujo del movimiento y pasa axe', async ({ page }) => {
  await page.goto('');
  await page.getByLabel('Tu intención de hoy').fill('Movilidad suave durante 10 minutos');
  await page.getByRole('button', { name: 'Crear mi rutina', exact: true }).click();
  await expect(page.locator('.routine-item .item-figure svg').first()).toBeVisible();
  await page.getByRole('button', { name: 'Preparar entrenamiento' }).click();
  await page.getByRole('button', { name: 'Entrar al entrenamiento' }).click();
  await expect(page.locator('.stage-figure svg.exercise-figure').first()).toBeVisible();
  await page.getByRole('button', { name: 'Iniciar temporizador' }).click();
  await expect(page.getByRole('timer')).toBeVisible();
  expect((await axe(page)).violations).toEqual([]);
});
