import { Router } from 'express';
import fetch from 'node-fetch';
import cheerio from 'cheerio';
import fs from 'fs/promises';

const router = Router();

router.get('/', async (_req, res) => {
  try {
    const productsUrls = JSON.parse(
      await fs.readFile(new URL('./urls.json', import.meta.url))
    );
    const products = await Promise.all(
      productsUrls.map(async (productUrl) => {
        const mhrRes = await fetch(productUrl);
        if (mhrRes.ok) {
          const html = await mhrRes.text();
          const $ = cheerio.load(html);
          const availability = $('.buttons_bottom_block.no-print > span')
            .attr('title')
            ?.trim();
          return {
            shop: 'mhr',
            product: $('.titulo-prod').text()?.trim(),
            price: $('.our_price_display').text()?.trim(),
            available:
              availability === 'Esgotado' || availability === 'Por Encomenda'
                ? 0
                : 1,
            productUrl,
          };
        } else {
          return null;
        }
      })
    );
    res.json(products);
  } catch (e) {
    console.error(e);
    res.sendStatus(500);
  }
});

export default router;
