import { launch } from '../launch.mjs'

let links = []
const existSelector = (page, selector) => {
  return page.evaluate((selectorDom) => {
    return !!document.querySelector(selectorDom)
  }, selector)
}
const existNextButon = async (page) => {
  await page.waitForTimeout(500)
  return existSelector(page, 'a.s-pagination-item.s-pagination-next.s-pagination-button.s-pagination-separator')
}
const scrollToBottom = async (page) => new Promise(async resolve => {
  while (!await existSelector(page, 'span.action-inner')) {
    await page.evaluate(() => window.scrollBy(0, window.innerHeight))
    await scrollToBottom(page)
  }
  return resolve()
})
let contator = 0
const getLinks = async (page) => new Promise(async resolve => {
  contator++
  await page.waitForSelector('a.a-link-normal.s-no-outline')
  while (await existNextButon(page)) {
    process.send({ msg: `change page ${contator}` })
    await scrollToBottom(page)
    const linksLocal = await page.evaluate(() => Array.from(document.getElementsByClassName('a-size-base a-link-normal s-underline-text s-underline-link-text s-link-style a-text-normal')).map(e => ({
      link: e.href,
      price: e.querySelector('span.a-price>span.a-offscreen').innerText
    })))
    links = [...linksLocal, ...links]
    await page.click('a.s-pagination-item.s-pagination-next.s-pagination-button.s-pagination-separator')
    await getLinks(page)
  }
  return resolve(links)
})
const getDataFromLinks = (array) => array.filter(link => !link.link.includes('slredirect'))
  .map(({
    link,
    price
  }) => {
    const [, , , name, , id] = link.split('/')
    return {
      name: decodeURI(name),
      idPlatform: id,
      renewed: name.includes('Renewed'),
      plugin: 'amazon',
      date: new Date().toDateString(),
      prices: {
        date: new Date().toDateString(),
        price
      },
      link
    }
  })

export const amazon = async (keyword,headless, end = 'exit') => {
  const {
    page,
    browser
  } = await launch(headless)
  await page.goto('https://amazon.com.mx')
  await page.reload()
  await page.waitForSelector('#twotabsearchtextbox')
  await page.type('#twotabsearchtextbox', keyword)
  await page.waitForSelector('#nav-search-submit-button')
  await page.click('#nav-search-submit-button')
  process.send({ msg: 'Extrayendo links' })
  process.send({ data: getDataFromLinks(await getLinks(page)) })
  await browser.close()
  if (end === 'exit') process.exit(0)
}

