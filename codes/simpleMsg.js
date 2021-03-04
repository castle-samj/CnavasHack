const msgModule = (() =>{
  //npm install node-fetch
  const fetch = require('node-fetch');
  // npm install prompt-sync
  require("prompt-sync");
  const ps = require('prompt-sync');
  const nodePrompt = ps();

  //web hook url, KEEP SECURE!
  const whurl = "https://discord.com/api/webhooks/816875860124368927/vH7sqOTUvHbprDIht0yTjOTGGbF29EW1kJGaGuGqT26EIeBC3G1UEBpZ8NFmdiqkBKvT"
  
  console.log('Enter msg to send to discord:');
  const msgText = nodePrompt();
  const msg = {
    "content": `${msgText}`
  };

  //Set the display name for the discord bot.
  msg.username = "Canvas";

  //Set the avatar of the bot.
  msg.avatar_url = "https://media.discordapp.net/attachments/803026510143422536/817056632986927134/unknown.png";
  
  //Creates a promise, POSTS msg and waits for the result from discord server. Prints the result to console.  
  fetch(whurl + "?wait=true",
    {"method":"POST", "headers":{"content-type": "application/json"},
     "body": JSON.stringify(msg)}).then(a => a.json()).then(console.log);

})();