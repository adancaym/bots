import {launch} from "../launch.mjs";
import {emit, proof} from "../comunication.mjs";


const URL = 'https://www.walmart.com.mx/';
const NEXT_SELECTOR = 'span.pagination_nextPage__2zUiQ';
const PAGINATOR_SELECTOR_BOTOM = 'div.pagination_container__kZQhf';
const CONTAINER_SELECTOR_FOR_WAIT_SEARCH = '.grid_product__30OQa';
const INPUT_SEARCH = 'input[data-automation-id="search-bar"]';
const BUTTON_SEARCH = 'button[data-automation-id="search-icon"]';
const CONTAINER_TO_SCRAP = 'div[data-testid="products-grid"]';
const PLUGIN = 'walmart'


let links = [];

const existSelector = (page, selector) => {
  return page.evaluate((selectorDom) => {
    return !!document.querySelector(selectorDom)
  }, selector)
}

const existNextButon = async (page) => {
  await page.waitForTimeout(2000);
  return existSelector(page, NEXT_SELECTOR);
}


const scrollToBottom = async (page) => new Promise(async resolve => {
  while (!await existSelector(page, PAGINATOR_SELECTOR_BOTOM)) {
    await page.evaluate(() => window.scrollBy(0, window.innerHeight));
    await scrollToBottom(page)
  }
  return resolve();
})

let contador = 0;
const getLinks = async (page) => new Promise(async resolve => {
  contador++;
  await page.waitForSelector(CONTAINER_SELECTOR_FOR_WAIT_SEARCH);

  while (await existNextButon(page)) {
    emit(`Scaning page ${contador}`);
    await scrollToBottom(page);
    // @ts-ignore
    proof(
      await page.evaluate((container, plugin) => Array.from(document.querySelectorAll(container)).map(el => ({
            // @ts-ignore
            name: el.querySelector('a').href.split('/')[6].split('_')[0].replace(/-/g, ' '),
            // @ts-ignore
            idPlatform: el.querySelector('a').href.split('/')[6].split('_')[1],
            plugin,
            // @ts-ignore
            link: el.querySelector('a').href,
            renewed: true,
            date: new Date().toDateString(),
            // @ts-ignore
            prices: {
              date: new Date().toDateString(),
              price: el.querySelector("p[data-automation-id='sale-price']").innerText
            }
          }
        ))
        , CONTAINER_SELECTOR_FOR_WAIT_SEARCH, PLUGIN));

    await page.click(NEXT_SELECTOR);
    await getLinks(page)
  }
  contador = 0;
  return resolve();
});


export const walmart = async (end = 'kill') => {
  const {page, browser, getData} = await launch();
  const {object: {keyword}} = getData();
  await page.goto(URL);
  await page.waitForSelector(INPUT_SEARCH);
  await page.type(INPUT_SEARCH, keyword);
  await page.waitForSelector(BUTTON_SEARCH);
  await page.click(BUTTON_SEARCH);
  await page.waitForSelector(CONTAINER_TO_SCRAP);
  await emit('Extrayendo links')
  await getLinks(page);
  await browser.close();
  if (end === 'kill') process.kill(process.pid)
};


