import { Router } from 'express';
import fetch from 'node-fetch';
import cheerio from 'cheerio';

const router = Router();

router.get('/', async (_req, res) => {
  try {
    // this url includes rtx2060, rtx3060 and rtx3060ti
    const url =
      'https://www.globaldata.pt/componentes/placas-graficas?price-range=1%3B2750&price[min]=&price[max]=&placagrafica[]=GeForce+RTX+3060&placagrafica[]=GeForce+RTX+3060+Ti&placagrafica[]=GeForce+RTX+2060&sort=Ordenar+por+relev%C3%A2ncia';
    const globaldataRes = await fetch(url, {
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/74.0.3729.169 Safari/537.36',
      },
    });
    if (globaldataRes.ok) {
      const html = await globaldataRes.text();
      const $ = cheerio.load(html);
      const products = $('article')
        .map((_i, el) => {
          const $el = $(el);
          const $product = $el.find('h6 > a');
          return {
            shop: 'globaldata',
            product: $product.text()?.trim(),
            price: $el.find('.price__amount').text()?.trim(),
            available:
              $el.find('.availability-text > span').text()?.trim() ===
              'Indisponível'
                ? 0
                : 1,
            productUrl:
              'https://www.globaldata.pt' + $product.attr('href')?.trim(),
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
