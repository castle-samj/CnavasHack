const msgModule = (() =>{
  //npm install node-fetch
  const fetch = require('node-fetch');
  // npm install prompt-sync
  require("prompt-sync");
  const ps = require('prompt-sync');
  const nodePrompt = ps();
  const whurl = "https://discord.com/api/webhooks/816875860124368927/vH7sqOTUvHbprDIht0yTjOTGGbF29EW1kJGaGuGqT26EIeBC3G1UEBpZ8NFmdiqkBKvT"
  
  console.log('Enter msg to send to discord:');
  const msgTest = nodePrompt()
  const msg = {
    "content": `${msgTest}`
  };
  
  fetch(whurl,
    {"method":"POST", "headers":{"content-type": "application/json"},
     "body": JSON.stringify(msg)})

})()