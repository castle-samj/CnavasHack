const test = (() => {

  const scrape = async (url, logic, isAuthRequired, auth, checkFailedLogin) => {
    const sc = require('./scrape');
    const result = await sc.scrape(url, logic, isAuthRequired, auth, checkFailedLogin).catch((err) => console.error(err.toString()));
    console.log(result);
  }

  const msgModule = async (urlString, content, username, avatar_url) => {
    const mm = require('./msgModule');
    mm.send(urlString, content, username, avatar_url);
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

(async () => {
  test.scrape('enter url here', null, true, { 'username1': 'username here', 'password': 'password here' }, true);

  test.msgModule('enter webhook url here', 'msg to server', 'bot name [optional]', 'img url [optional]');

  const pingResult = await test.ping('ip or domain name here');
  console.log(pingResult);

})();




