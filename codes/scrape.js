'use strict'
/**
 * Opens a headless browser, navigates to url, and fetches http status code from domain. 
 * @async
 * @param {string} url - Fully qualified domain url : "http://www.example.com"
 * @param {function} [logic] - Callback to evaluate inside browser context (optional)
 * @param {boolean} [isAuthRequired] - Set true if there is a login redirect (optional)
 * @param {{'usernameHtmlTagID':'username', 'passwordHtmlTagID':'password'}} [auth] - The keys of this object are the html tag ids for the username and password fields of the login page (optional)
 * @param {boolean} [checkFailedLogin] - Set true to check for a failed login (optional)
 * @returns {number|string} The http status code from domain of url passed in | Failed login msg. 
 */
const scrape = async (url, logic, isAuthRequired, auth, checkFailedLogin) => {
  const puppeteer = require('puppeteer');
  const browser = await puppeteer.launch({
    headless: true,
  });
  const page = await browser.newPage();
  await page.setRequestInterception(true);
  page.on('request', req => {
    (req.resourceType() == 'font' || req.resourceType() == 'stylesheet' || req.resourceType() == 'image') ? req.abort() : req.continue()
  });

  await page.goto(url)

  if (isAuthRequired) {
    const tags = Object.keys(auth);
    const username = auth[tags[0]];
    const password = auth[tags[1]];
    await page.type(`#${tags[0]}`, username);
    await page.type(`#${tags[1]}`, password);
    await page.keyboard.press('Enter');

    if (checkFailedLogin) {
      await page.waitForTimeout(2000);
      const currentUrl = await page.evaluate(() => window.location.href);
      if (currentUrl != url) {
        browser.close();
        return `Login Failed for ${url}`
      }
    }
  }

  await page.waitForFunction(address => window.location.href === address, {}, url);

  if (typeof logic === 'function') {
    await page.exposeFunction("myFunc", logic);
    await page.evaluate(() => myFunc());
  }

  const status = await page.evaluate((address) => fetch(address).then(res => res.status), url);
  browser.close()
  return status
};

exports.scrape = scrape;
