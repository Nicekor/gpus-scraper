import { Router } from 'express';
import fetch from 'node-fetch';

const router = Router();

// status 9 => Esgotado
// status 1 => Disponivel
router.get('/', async (_req, res) => {
  try {
    // url for rtx2060
    const chip7Res = await fetch(
      'https://u751he4mak-dsn.algolia.net/1/indexes/*/queries?x-algolia-agent=Algolia%20for%20vanilla%20JavaScript%20(lite)%203.30.0%3Binstantsearch.js%202.10.4%3BJS%20Helper%202.26.1&x-algolia-application-id=U751HE4MAK&x-algolia-api-key=90b533bbec7e4b8e0864a26592e7ccfb',
      {
        credentials: 'omit',
        headers: {
          Accept: 'application/json',
          'Accept-Language': 'en-GB,en;q=0.5',
          'content-type': 'application/x-www-form-urlencoded',
          'Sec-GPC': '1',
          'Cache-Control': 'max-age=0',
        },
        referrer: 'https://www.chip7.pt/',
        body:
          '{"requests":[{"indexName":"product_price_asc","params":"query=rtx%202060&tagFilters=&maxValuesPerFacet=100&page=0&filters=available%20%3D%201&facets=%5B%22category_id%22%2C%22category_name%22%2C%22features.Capacidade%20da%20mem%C3%B3ria%20incorporada%22%2C%22features.Fabricante%20do%20processador%22%2C%22features.Capacidade%20do%20Disco%20R%C3%ADgido%22%2C%22features.Tamanho%20do%20disco%20r%C3%ADgido%22%2C%22features.Resolu%C3%A7%C3%A3o%22%2C%22features.N%C3%BAmero%20de%20cores%20de%20processador%22%2C%22features.Mem%C3%B3ria%20de%20placa%20gr%C3%A1fica%20discreta%22%2C%22features.Fam%C3%ADlia%20de%20processadores%20gr%C3%A1ficos%22%2C%22features.Modelo%20da%20placa%20gr%C3%A1fica%20discreto%22%2C%22features.Capacidade%20da%20drive%20SSD%22%2C%22features.Fam%C3%ADlia%20de%20chipset%20da%20placa-m%C3%A3e%22%2C%22price%22%2C%22status%22%2C%22brand%22%2C%22hierarchicalCategories.lvl0%22%2C%22hierarchicalCategories.lvl1%22%2C%22hierarchicalCategories.lvl2%22%2C%22hierarchicalCategories.lvl0%22%2C%22hierarchicalCategories.lvl1%22%2C%22hierarchicalCategories.lvl2%22%5D&facetFilters=%5B%5B%22status%3A1%22%2C%22status%3A9%22%5D%2C%5B%22hierarchicalCategories.lvl2%3AComponentes%20%3E%20Placas%20Gr%C3%A1ficas%20%3E%20Consumo%22%5D%5D"},{"indexName":"product_price_asc","params":"query=rtx%202060&tagFilters=&maxValuesPerFacet=100&page=0&filters=available%20%3D%201&hitsPerPage=1&attributesToRetrieve=%5B%5D&attributesToHighlight=%5B%5D&attributesToSnippet=%5B%5D&analytics=false&clickAnalytics=false&facets=status&facetFilters=%5B%5B%22hierarchicalCategories.lvl2%3AComponentes%20%3E%20Placas%20Gr%C3%A1ficas%20%3E%20Consumo%22%5D%5D"},{"indexName":"product_price_asc","params":"query=rtx%202060&tagFilters=&maxValuesPerFacet=100&page=0&filters=available%20%3D%201&hitsPerPage=1&attributesToRetrieve=%5B%5D&attributesToHighlight=%5B%5D&attributesToSnippet=%5B%5D&analytics=false&clickAnalytics=false&facets=%5B%22hierarchicalCategories.lvl0%22%2C%22hierarchicalCategories.lvl1%22%2C%22hierarchicalCategories.lvl2%22%5D&facetFilters=%5B%5B%22status%3A1%22%2C%22status%3A9%22%5D%2C%5B%22hierarchicalCategories.lvl1%3AComponentes%20%3E%20Placas%20Gr%C3%A1ficas%22%5D%5D"},{"indexName":"product_price_asc","params":"query=rtx%202060&tagFilters=&maxValuesPerFacet=100&page=0&filters=available%20%3D%201&hitsPerPage=1&attributesToRetrieve=%5B%5D&attributesToHighlight=%5B%5D&attributesToSnippet=%5B%5D&analytics=false&clickAnalytics=false&facets=%5B%22hierarchicalCategories.lvl0%22%5D&facetFilters=%5B%5B%22status%3A1%22%2C%22status%3A9%22%5D%5D"}]}',
        method: 'POST',
        mode: 'cors',
      }
    );
    if (chip7Res.ok) {
      const data = await chip7Res.json();
      const products = data.results[0].hits;
      const productsFormatted = products.map((product) => {
        return {
          shop: 'chip7',
          product: product.name,
          price: product.price.toString(),
          available: product.status === 9 ? 0 : 1,
          productUrl: product.url,
        };
      });
      res.json(productsFormatted);
    } else {
      res.sendStatus(chip7Res.status);
    }
  } catch (e) {
    console.error(e);
    res.sendStatus(500);
  }
});

export default router;
