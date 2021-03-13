/**
 * Posts a msg to a discord webhook. 
 * @param {string} urlString url of the webhook to post.
 * @param {string} content Content of the post msg.
 * @param {string} [username] Display name of the discord bot that sent the msg to channel (optional)
 * @param {string} [avatar_url] url link to display img of discord bot (optional)
 * @returns {boolean} True if msg was sent.
 */
const msgModule = async (urlString, content, username, avatar_url) => {
  const AbortController = require('abort-controller');
  const fetch = require('node-fetch');
  const fs = require('fs');
  const stream = fs.createWriteStream('./msg.log', { flags: 'a' });
  const msg = {};
  let wasMsgSent = false;
  let whurl = urlString;
  msg.content = content;

  if (username) msg.username = username;
  if (avatar_url) msg.avatar_url = avatar_url;

  const controller = new AbortController();
  setTimeout(() => controller.abort(), 5000);

  //POSTS msg and appends the result to msg.log  
  await fetch(whurl + "?wait=true", { signal: controller.signal, "method": "POST", "headers": { "content-type": "application/json" }, "body": JSON.stringify(msg) })
    .then(res => res.json())
    .then(json => {
      wasMsgSent = true;
      for (let key in json) {
        stream.write(`${key}: ${JSON.stringify(json[key], null, 2)}\n`);
      }
      stream.write('\n\n');
    })
    .catch(err => {
      console.error(`MsgModule ${err}`);
    });

  return wasMsgSent;
}

exports.send = msgModule;