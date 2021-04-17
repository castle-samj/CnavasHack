"use strict";
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
  const results = {
    error: undefined,
    status: undefined,
    logicResults: undefined
  }

  const puppeteer = require('puppeteer');
  const browser = await puppeteer.launch({
    headless: true,
  });
  const page = await browser.newPage();
  await page.setRequestInterception(true);
  page.on('request', req => {
    (req.resourceType() == 'font' || req.resourceType() == 'stylesheet' || req.resourceType() == 'image') ? req.abort() : req.continue()
  });

  let failed;

  await page.goto(url,{timeout: 3000})
    .then(res => console.log(`Init navigation status: ${res.status()}`))
    .catch((err)=>{
      failed = true;
      console.log(err.toString());
    });

  if(failed){
    browser.close()
    results.error = `Failed to reach ${url}`;
    return results;
  }

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
        results.error = `Login Failed for ${url}`;
        return results;
      }
    }

    await page.waitForFunction(address => window.location.href === address, {timeout: 3000}, url).catch( (err) => {
      console.log(err.toString())
      failed = true
      });
  
    if(failed){
      browser.close()
      results.error = `Failed to reach ${url}`;
      return results;
    }
  }

  if (typeof logic === 'function') {
    await page.evaluate(logic).then(val => results.logicResults = val);
  }

  const statusCode = await page.evaluate((address) => fetch(address).then(res => res.status), url).catch(err => err.toString());
  browser.close()
  results.status = statusCode;
  return results
};

exports.scrape = scrape;
