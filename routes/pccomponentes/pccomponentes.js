import { Router } from 'express';
import fetch from 'node-fetch';
import cheerio from 'cheerio';

const router = Router();

router.get('/', async (_req, res) => {
  try {
    // this url includes rtx3060 and rtx3060ti
    const url = 'https://www.pccomponentes.pt/placas-graficas/geforce-rtx-3060';
    const globaldataRes = await fetch(url);
    if (globaldataRes.ok) {
      const html = await globaldataRes.text();
      const $ = cheerio.load(html);
      const products = $('article')
        .map((_i, el) => {
          const $el = $(el);
          const $productAnchor = $el.find('.c-product-card__title-link');
          return {
            shop: 'pccomponentes',
            product: $productAnchor.attr('data-name')?.trim(),
            price: $el
              .find('.c-product-card__prices-actual > span')
              .text()
              ?.trim(),
            available:
              $el.find('.c-product-card__availability').text()?.trim() ===
              'Nenhuma data'
                ? 0
                : 1,
            productUrl:
              'https://www.pccomponentes.pt/' +
              $productAnchor.attr('href')?.trim(),
          };
        })
        .get();
      res.json(products);
    } else {
      res.sendStatus(globaldataRes.status);
    }
  } catch (e) {
    console.error(e);
    res.sendStatus(500);
  }
});

export default router;
