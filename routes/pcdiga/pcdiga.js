import { Router } from 'express';
import fetch from 'node-fetch';
import cheerio from 'cheerio';
import fs from 'fs/promises';

const router = Router();

// I tried scraping the search results but it won't work because there might be some late javascript/server side rendering going on
const _scraping = async () => {
  const rtx2060Res = await fetch(
    'https://www.pcdiga.com/#/embedded/query=rtx%202060&page=1&filter%5Bcategories%5D%5B0%5D=Placas%20Gr%C3%A1ficas&query_name=match_and&sort%5B0%5D%5Bbest_price%5D=asc'
  );
  const html = await rtx2060Res.text();
  const $ = cheerio.load(html);
  return $('.df-card')
    .map((_i, el) => {
      const $el = $(el);
      const product = $el.find('.df-card__title').text();
      const newPrice = $el.find('.df-card__price--new').text().trim();
      const price = newPrice || $el.find('.df-card__price').text().trim();
      const link = $el.find('a:first-child').attr('href');
      return { product, price, link };
    })
    .get();
};

router.get('/', async (_req, res) => {
  try {
    const productsUrls = JSON.parse(
      await fs.readFile(new URL('./urls.json', import.meta.url))
    );
    const products = await Promise.all(
      productsUrls.map(async (productUrl) => {
        const pcDigaRes = await fetch(productUrl);
        if (pcDigaRes.ok) {
          const html = await pcDigaRes.text();
          const $ = cheerio.load(html);
          const availability = $('#skrey_estimate_date_product_page_wrapper')
            .text()
            ?.trim();
          return {
            shop: 'pcdiga',
            product: $('.product-info-main .page-title').text()?.trim(),
            price: $('[data-price-type="finalPrice"]').text()?.trim(),
            available: availability && availability === 'Sem stock' ? 0 : 1,
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
