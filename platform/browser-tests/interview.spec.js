import { test, expect } from '@playwright/test';
import fs from 'node:fs/promises';

const firstAnswers = ['کافه و برشته‌کاری قهوه', 'رست تازه برای مشتریان شرق تهران', 'کسب‌وکار فعال', 'شرق تهران', 'افزایش سفارش‌های هفتگی', 'قهوه با رست هفتگی', 'تاریخ رست مشخص روی بسته'];
const getState = page => page.evaluate(() => JSON.parse(localStorage.getItem('dm_project_state')).state);
async function answer(page, text) {
  await page.getByRole('button', { name: /پاسخ اختصاصی خودم/ }).click();
  await page.getByRole('textbox', { name: 'دیدگاه، توضیحات یا راهبرد مدنظرتان' }).fill(text);
  await page.getByRole('button', { name: 'ثبت پاسخ اختصاصی و ادامه' }).click();
}
async function toFinance(page) {
  for (const text of firstAnswers) await answer(page, text);
  await expect(page.getByRole('form', { name: 'ثبت اعداد قیمت و هزینه' })).toBeVisible();
}
async function fillFinance(page, { price = '۱۰۰٬۰۰۰', costs = '۴۰٬۰۰۰', capacity = '۶۰۰' } = {}) {
  const form = page.getByRole('form', { name: 'ثبت اعداد قیمت و هزینه' });
  await form.getByRole('textbox', { name: 'واحد فروش', exact: true }).fill('فنجان');
  await form.getByRole('combobox', { name: 'واحد پول همه مبلغ‌ها' }).selectOption('TOMAN');
  await form.getByRole('textbox', { name: 'قیمت هر واحد', exact: true }).fill(price);
  await form.getByRole('textbox', { name: 'هزینه متغیر هر واحد', exact: true }).fill(costs);
  await form.getByRole('textbox', { name: 'هزینه ثابت ماهانه', exact: true }).fill('۲۰٬۰۰۰٬۰۰۰');
  await form.getByRole('textbox', { name: 'تعداد فروش ماهانه، اختیاری' }).fill('۵۰۰');
  await form.getByRole('textbox', { name: 'ظرفیت ماهانه، اختیاری' }).fill(capacity);
  await form.getByRole('combobox', { name: 'مبنای عددها' }).selectOption('false');
}
async function finishFoundation(page) {
  await toFinance(page); await fillFinance(page);
  await page.getByRole('button', { name: 'ثبت اعداد و ادامه' }).click();
  await answer(page, 'بودجه محدود ۵ میلیون تومان و دو نفر تیم');
  await expect(page.getByText('پاسخ‌های این فاز تکمیل شد')).toBeVisible();
}
async function noPageOverflow(page) {
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth + 1)).toBe(true);
}

test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => localStorage.setItem('engine_mode', 'local'));
  await page.goto('/');
});

test('financial form, invalid input, reload, and downloaded calculations', async ({ page }, testInfo) => {
  const errors = []; page.on('pageerror', error => errors.push(error.message));
  await toFinance(page); await fillFinance(page, { price: '۱۰۰ هزار' });
  await page.getByRole('button', { name: 'ثبت اعداد و ادامه' }).click();
  await expect(page.getByRole('alert')).toContainText('عدد نامنفی');
  expect((await getState(page)).answerRecords.filter(a => a.questionId === 'unit_economics')).toHaveLength(0);
  await fillFinance(page); await noPageOverflow(page);
  await page.screenshot({ path: testInfo.outputPath('financial-form.png'), fullPage: true });
  await page.getByRole('button', { name: 'ثبت اعداد و ادامه' }).click();
  await answer(page, 'بودجه محدود ۵ میلیون تومان و دو نفر تیم');
  await page.reload();
  await page.getByRole('button', { name: 'مشاهده سند خروجی فاز' }).click();
  const dialog = page.getByRole('dialog');
  await expect(dialog).toContainText('۳۳۴ واحد کامل');
  await expect(dialog).toContainText('۱۰٬۰۰۰٬۰۰۰ تومان');
  await noPageOverflow(page);
  const downloadPromise = page.waitForEvent('download');
  await dialog.getByRole('button', { name: /دانلود/ }).click();
  const download = await downloadPromise;
  const output = await fs.readFile(await download.path(), 'utf8');
  expect(output).toContain('۳۳۴ واحد کامل'); expect(output).toContain('[CALCULATION]');
  expect(output).toContain((await getState(page)).answerRecords.find(a => a.questionId === 'unit_economics').id);
  await page.screenshot({ path: testInfo.outputPath('financial-report.png'), fullPage: true });
  await dialog.getByRole('button', { name: 'بستن سند' }).click();
  await page.getByRole('button', { name: 'بازبینی پاسخ‌های این فاز' }).click();
  for (const text of firstAnswers) await answer(page, text);
  await expect(page.getByRole('textbox', { name: 'قیمت هر واحد', exact: true })).toHaveValue('100000');
  expect(errors).toEqual([]);
});

test('complete eight phases and download one consistent master book', async ({ page }) => {
  await finishFoundation(page);
  for (let phase = 2; phase <= 8; phase++) {
    await page.getByRole('main').getByRole('button', { name: `ورود به فاز ${phase}`, exact: true }).click();
    let steps = 0;
    while (!(await getState(page)).completedPhases[phase]) {
      expect(++steps).toBeLessThan(16);
      const options = page.getByRole('radio');
      await expect(options.first()).toBeVisible();
      await options.first().click();
      await page.getByRole('button', { name: 'تأیید پاسخ و ادامه به گام بعدی' }).click();
    }
  }
  await page.getByRole('main').getByRole('button', { name: 'مشاهده کتابچه جامع استراتژی', exact: true }).click();
  const dialog = page.getByRole('dialog');
  await expect(dialog).toContainText('۳۳۴ واحد کامل');
  const s = await getState(page);
  expect(Object.values(s.completedPhases).every(Boolean)).toBe(true);
  const downloadPromise = page.waitForEvent('download');
  await dialog.getByRole('button', { name: /دانلود/ }).click();
  const download = await downloadPromise;
  const output = await fs.readFile(await download.path(), 'utf8');
  expect(output).toContain('قهوه با رست هفتگی');
  expect(output).toContain(s.phaseData[8].leadFunnel);
  expect(output).toContain('CONFIRMED');
  for (let p = 1; p <= 8; p++) expect(output).toContain(`## فاز ${p}:`);
});

test('changed finances invalidate a later phase and replace its numeric evidence', async ({ page }) => {
  await finishFoundation(page);
  await page.getByRole('main').getByRole('button', { name: 'ورود به فاز 2', exact: true }).click();
  await answer(page, 'دو کافه نزدیک دانشگاه');
  await page.getByTitle('مشاهده پیش‌نویس یا سند رسمی فاز').click();
  const dialog = page.getByRole('dialog');
  await dialog.getByRole('button', { name: 'فاز 1', exact: true }).click();
  await dialog.getByRole('button', { name: 'ویرایش پاسخ‌های این فاز' }).click();
  for (const text of firstAnswers) await answer(page, text);
  await fillFinance(page, { costs: '۱۲۰٬۰۰۰' });
  await page.getByRole('button', { name: 'ثبت اعداد و ادامه' }).click();
  await expect(page.locator('#strategic-question-heading')).toContainText('قیمت هر واحد از هزینه متغیر بیشتر نیست');
  expect((await getState(page)).phaseStatus[2]).toBe('INVALIDATED');
  await page.getByTitle('مشاهده پیش‌نویس یا سند رسمی فاز').click();
  await expect(page.getByRole('dialog')).toContainText('حاشیه مشارکت غیرمثبت');
  await expect(page.getByRole('dialog')).not.toContainText('۳۳۴ واحد کامل');
});
