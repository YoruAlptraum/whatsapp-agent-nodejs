# Sample Whatsapp Agent Webhook Listener with Node + Express

This sample app works as a whatsapp webhook listener using Node and ExpressJS.

**Prerequisites**: [Node.js], [Redis].

taken starting webhook listener code from `https://github.com/ngrok/ngrok-webhook-nodejs-sample` commit 6d88a91

## Install Dependencies

```bash
npm i
```

in `src/config/` copy `responses.json.example` to `responses.json` and fill in the responses for the bot to use

you also need to install and start redis server on the server machine, for windows development wsl can be used

## Launching the app

Now you can launch the app: `npm run start`

The app runs by default on port 3000

## Making this app public with ngrok (for local development)

To make your app public using ngrok, enter:

```bash
ngrok http 3000
```

or

```bash
ngrok config add-authtoken [your-authtoken]

ngrok http 3000 --url=[subdomain].ngrok-free.app
```

need to download ngrok agent and create a ngrok account (only need to configure authtoken once)

## Testing

to test running locally on windows you can use WSL to use redis caching

use `redis-cli -n 0 FLUSHDB ASYNC` to clear redis cache

## Base structure

```

received | user messages - user messages have contacts[0]["wa_id"]
    old messages - ignore
    new messages - respond
    interactive message replies - respond - user interactive replies have a different json structure and do not have contact

sent
    bot messages - ignore
    human agent messages - stop bot from responding if a human agent takes over the chat

```

## Responses.json Structure

"message" - what the bot will send the user

"next" - what messaged to send next (if next == "end" the conversation ends)

for a multiple choice input remove "message" key from a response, the next user input will be checked if it matches one of the possible options/keys

the interactive (multiple choice) message buttons have a very limited character limit that will throw a error if reached

## Examples from Meta

json payloads responses to messages sent and received

https://developers.facebook.com/docs/whatsapp/cloud-api/webhooks/payload-examples
