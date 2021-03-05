/**
 * Checks a .csv db and polls each domain for server status, updates db and sends msgs to discord webhook on status change
 */
const polling = (() => {
  const msg = require('./msgModule');
  const fetch = require('node-fetch');
  const fs = require('fs');
  const csv = require('csv-parser');
  const _whurl = "https://discord.com/api/webhooks/817140114680971306/X2GzQqA-Sonr1tM1-yAd-43fkuxKBGBWn0a-OIL8AE1okq6H3sPEqgGKRJvX7vCTQWEY";
  let statusChange;
  let newStatus;

  //opens the csv file with domain info and calls checkStatus() to check each row.
  fs.createReadStream('data.csv')
    .pipe(csv())
    .on('data', (row) => {
      let domain = row.DomainURL;
      let status = row.Status;
      let name = row.Username;
      let avatar = row.Avatar_url;
      checkStatus(domain, status, name, avatar);
      if (statusChange) {
        //write newStatus to the status cell of the current row.

      }
    });

  /**
   * Sends a get request to domain and calls msg.send() on status change
   * @param {*} domainUrl Domain url to check in the get request 
   * @param {*} status Old domain status from database
   * @param {*} username Display name for discord bot
   * @param {*} avatar_url Display avatar for discord bot
   */
  const checkStatus = (domainUrl, status, username, avatar_url) => {
    let currentStatus = status;
    statusChange = false;
    fetch(domainUrl)
      // Update to use authentication and more robust res data.
      .then(res => res.ok)
      .then(bool => {
        if (currentStatus === 'Up' && !bool) {
          msg.send(_whurl, 'Server is down.', username, avatar_url);
          statusChange = true;
          newStatus = 'Down';
        }
        if (currentStatus === 'Down' && bool) {
          msg.send(_whurl, 'Server is up.', username, avatar_url);
          statusChange = true;
          newStatus = 'Up';
        }
      });
  }

})();