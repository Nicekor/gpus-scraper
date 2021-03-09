import { Router } from 'express';
import fetch from 'node-fetch';
import fs from 'fs/promises';
import sqlPromise from '../db/index.js';
import lodash from 'lodash/array.js';
import nodemailer from 'nodemailer';
import { nanoid } from 'nanoid';

const router = Router();

const sendEmail = (newProducts, emailId) => {
  const transporter = nodemailer.createTransport({
    service: process.env.EMAIL_SERVICE,
    auth: {
      user: process.env.AUTH_EMAIL,
      pass: process.env.AUTH_PASS,
    },
  });

  transporter.sendMail(
    {
      from: process.env.AUTH_EMAIL,
      to: process.env.TO_EMAIL,
      subject: `New GPUs floating around... | REF: ${emailId}`,
      html: `<h2>There are new GPUs, go check them out</h2>
            <h4>New GPUs:</h4>
            <ul>
                ${newProducts
                  .map(
                    ({ product, productUrl, price }) =>
                      `<li><a href="${productUrl}">${product}</a> | Price: ${price}</li>`
                  )
                  .join('')}
            </ul>
        `,
    },
    (err, info) => {
      if (err) {
        console.error(err);
      } else {
        console.log('Email sent: ' + info.response);
      }
    }
  );
};

// this route returns all available in stock gpus as a json but will only send an email for the ones that are NEW
// NEW as now in stock, a change of price or an actual new product
router.get('/', async (req, res) => {
  try {
    const serverUrl = req.protocol + '://' + req.get('host') + '/';
    const shops = JSON.parse(
      await fs.readFile(new URL('../shops.json', import.meta.url))
    );
    const allProducts = await Promise.all(
      shops.map(async (shop) => {
        const response = await fetch(serverUrl + shop);
        if (response.ok) {
          return await response.json();
        } else {
          console.warn(`Failed to load ${shop}`);
        }
      })
    );
    const availableProducts = allProducts
      .flat()
      .filter((el) => el && el.available);
    const sql = await sqlPromise;
    const [databaseProducts] = await sql.query(
      'SELECT * FROM products WHERE available = TRUE'
    );
    const newProducts = lodash.differenceBy(
      availableProducts,
      databaseProducts,
      (obj) =>
        (obj.product && obj.price) ||
        obj.available ||
        (obj.product && obj.shop) ||
        obj.product
    );

    if (newProducts.length) {
      await sql.query('TRUNCATE TABLE products');
      await sql.query(
        'INSERT INTO products(shop, product, price, available, product_url) VALUES ?',
        [newProducts.map((el) => Object.values(el))]
      );
      sendEmail(newProducts, nanoid(10));
    }

    res.json(availableProducts);
  } catch (e) {
    console.error(e);
    res.sendStatus(500);
  }
});

export default router;
