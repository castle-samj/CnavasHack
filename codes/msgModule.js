/**
 * 
 * @param {string} urlString String url of the webhook to send post to.
 * @param {string} content String content of the post msg.
 * @param {string} [username] Display name of the discord bot that sent the msg to channel. Optional
 * @param {string} [avatar_url] url link to display img of discord bot. Optional
 */
const msgModule = (urlString, content, username, avatar_url) => {
  const fetch = require('node-fetch');
  const fs = require('fs');
  let _whurl = "";
  const _msg = {};
  
  const sendMsg = () => {
    _whurl = urlString;
    _msg.content = content;
    if(username) _msg.username = username;
    if(avatar_url) _msg.avatar_url = avatar_url;
    
    //Creates a promise, POSTS msg and waits for the result from discord server. Appends the result to msg.log  
    fetch(_whurl + "?wait=true", {"method":"POST", "headers":{"content-type": "application/json"},"body": JSON.stringify(_msg)})
      .then(res => res.json())
      .then(json => {
        const stream = fs.createWriteStream('./msg.log', {flags: 'a'});
        for(let key in json) {
          stream.write(`${key}: ${JSON.stringify(json[key], null, 2)}\n`);
        }
        stream.write('\n\n');
        });
      
  }

  sendMsg();

};

exports.send = msgModule;