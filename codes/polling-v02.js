'use strict'
/**
 * Checks a db for urls, and then makes http get requests for each url. Depending on response it will call msgModule.js and update the db with changes in status. 
 */
const polling = (() => {
  const msg = require('./msgModule');
  const fetch = require('node-fetch');
  const { createReadStream } = require('fs');
  const csv = require('csv-parser');
  const createCsvWriter = require('csv-writer').createObjectCsvWriter;
  const _whurl = "https://discord.com/api/webhooks/817140114680971306/X2GzQqA-Sonr1tM1-yAd-43fkuxKBGBWn0a-OIL8AE1okq6H3sPEqgGKRJvX7vCTQWEY";
  const data = [];
  const newData = [];
  const urls = [];
  let statusChange = false;
  let updateFile = false;
  let newStatus;

  /**
   * Uses the response.ok value from a http get response, along with past status values from the db to determine if a status change has occurred. If a change has occurred will call msg.send(), update statusChange flags, and push new status to the newData array.
   * @param {*} domainUrl  
   * @param {*} username 
   * @param {*} avatar_url 
   * @param {*} status String. Status from db i.e last known status before current get request. Up or Down.
   * @param {*} resVal Bool. True if http get response status code is 200, else false.   
   */
  const checkStatus = (domainUrl, username, avatar_url, status, resVal) => {
    let currentStatus = status;
    statusChange = false;
    if (currentStatus === 'Up' && !resVal) {
      msg.send(_whurl, 'Server is down.', username, avatar_url);
      statusChange = true;
      newStatus = 'Down';
    }
    if (currentStatus === 'Down' && resVal) {
      msg.send(_whurl, 'Server is up.', username, avatar_url);
      statusChange = true;
      newStatus = 'Up';
    }
    if (statusChange) {
      currentStatus = newStatus;
      updateFile = true;
    }
    newData.push({ "domain": domainUrl, "name": username, "avatar": avatar_url, "status": currentStatus });
  }

  /**
   * Calls csv-writer and creates/overwrites a csv file with the input array data.
   * @param {*} arrOfDataObj Array. An array of csv objects.
   */
  const updateDB = (arrOfDataObj) => {
    const csvWriter = createCsvWriter({
      path: 'data.csv',
      header: [
        { id: 'domain', title: 'DomainURL' },
        { id: 'name', title: 'Username' },
        { id: 'avatar', title: 'Avatar_url' },
        { id: 'status', title: 'Status' }
      ]
    });
    csvWriter.writeRecords(arrOfDataObj);
  }
  
  //Creates an async iterable stream to read in data from a csv db file.
  //Parses data, calls fetch api and checks responses. 
  async function run() {
    const stream = createReadStream('data.csv').pipe(csv())
    for await (let chunk of stream) {
      data.push(chunk);
      urls.push(chunk.DomainURL);
    }
    //Iterates over the url array, sends http get requests, and stores the resulting promises in an array. 
    let promises = urls.map(url => fetch(url).then(res => res.ok));

    //Resolves the promises from the promises array and iterates over the responses.
    Promise.all(promises).then(results => {
      data.forEach((el, i) => {
        checkStatus(el.DomainURL, el.Username, el.Avatar_url, el.Status, results[i]);
      })
      if (updateFile) updateDB(newData);
    });
  }

  run();

})();