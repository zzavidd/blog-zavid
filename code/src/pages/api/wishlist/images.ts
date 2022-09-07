import type { NextApiRequest, NextApiResponse } from 'next';
import puppeteer from 'puppeteer';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<any>,
): Promise<void> {
  if (req.method !== 'GET') return res.send(405);

  try {
    const url = String(req.query.url);

    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();
    await page.goto(url, { waitUntil: 'networkidle0' });
    const images = await page.$$eval('img', (a) => a.map((a) => a.src));
    await browser.close();

    res.status(200).json({ images });
  } catch (e) {
    res.status(400).json(e);
  }
}
