"use strict";

const run = (async () => {
  const s = require('./scrape');
  const url = "https://status.instructure.com/";
  
  const logic = () => {
    const elements = document.querySelector('.page-status').children;
    let statusString = elements.item(0).innerText;
    if(statusString === "All Systems Operational") return true
    return false
  }

  const results = await s.scrape(url, logic);
  for(let key in results) {
    console.log(`${key}: ${results[key]}`);
  }

})();