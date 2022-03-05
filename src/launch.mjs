import puppeteer from 'puppeteer-extra'
import StealthPlugin from 'puppeteer-extra-plugin-stealth'
import AdBlockerPlugin from 'puppeteer-extra-plugin-adblocker'
import minmaxPlugin from 'puppeteer-extra-plugin-minmax'
import userDataDir from 'puppeteer-extra-plugin-user-data-dir'
import userAgent from 'puppeteer-extra-plugin-anonymize-ua'

puppeteer.use(StealthPlugin())
puppeteer.use(AdBlockerPlugin({
  useCache: true,
  blockTrackers: true
}))
puppeteer.use(minmaxPlugin())
puppeteer.use(userDataDir())
puppeteer.use(userAgent())

export const launch = async (headless) => {
  const browser = await puppeteer.launch({
    ignoreDefaultArgs: ['--enable-automation', '--enable-blink-features=IdleDetection'],
    ignoreHTTPSErrors: true,
    headless: headless,
    args: [
      '--no-sandbox',
      '--lang=en-US,en',
      '--start-maximized',
      '--disable-infobars',
      '--lang=en-US,en;q=0.9',
      '--disable-web-security',
      '--window-position = 0,0',
      '--disable-setuid-sandbox',
      '--ignore-certificate-errors',
      '--no-default-puppeteer-check',
      '--disable-background-networking',
      ' --ignore-certificate-errors-skip-list ',
      '--disable-features=IsolateOrigins,site-per-process',
      '--flag-switches-begin --disable-site-isolation-trials --flag-switches-end',
    ]
  })
  const page = await browser.newPage()
  process.on('disconect', () => {
    console.log('se muere?', browser.process().kill('SIGTERM'))
  });
  process.on('exit', () => {
    console.log('se muere en exit?', browser.process().kill('SIGTERM'))
  })
  return {
    browser,
    page
  }
}

export default launch

