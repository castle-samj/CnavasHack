const test = (() => {

  const scrape = async (url, logic, isAuthRequired, auth, checkFailedLogin) => {
    const sc = require('./scrape');
    const result = await sc.scrape(url, logic, isAuthRequired, auth, checkFailedLogin).catch((err) => err.toString());
    return result
  }

  const msgModule = async (urlString, content, username, avatar_url) => {
    const mm = require('./msgModule');
    return await mm.send(urlString, content, username, avatar_url);
  }

  const ping = async (ip) => {
    const pi = require('./ping');
    return await pi.ping(ip);

  }

  return {
    scrape,
    msgModule,
    ping
  }
})();

const assertArraysEqual = (actual, expected, testName) => {
  let areEqualLength = actual.length === expected.length;
  let areEqualItems = true;
  for (let i = 0; i < expected.length; i++) {
    if (expected[i] !== actual[i]) {
      areEqualItems = false;
      break;
    }
  }

  if (areEqualLength && areEqualItems) {
    console.log('passed');
  } else {
    console.log('FAILED [' + testName + '] Expected: "' + expected + '", but got: "' + actual + '"');
  }
}

(async () => {
  const scrapeResult = await test.scrape('https://learn.vccs.edu/', null, true, { 'username1': 'username here', 'password': 'password here'}, true);
  const msgResult = await test.msgModule('webhook url', 'Hello World', 'test.js');
  const pingResult = await test.ping('learn.vccs.edu');

  assertArraysEqual([scrapeResult, msgResult, pingResult], [200, true, '2'], 'Tests');
})();




