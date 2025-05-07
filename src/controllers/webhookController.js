const { handleReceivedMessage, handleSentMessage } = require('../services/messageHandlers');
const redis = require('../config/redisClient');
const { getTimestamp } = require('../services/jsonGetters');

const handleWebhook = async (req, res) => {
  const value = req.body["entry"][0]["changes"][0]["value"];
  const contacts = value["contacts"];
  const statuses = value["statuses"];
  const timestamp = getTimestamp(req.body); // Get the timestamp from the request body

  console.log("-------------------------------------------------------", timestamp, "-------------------------------------------------------");

  const waId = contacts ? contacts[0]["wa_id"] : statuses[0]["recipient_id"]; // User's WhatsApp ID

  // Get the redis cache info
  let userState = await redis.hGetAll(`wa-id:${waId}`);
  userState = Object.assign({}, userState);

  // Convert string values to original types
  if (userState.respond !== undefined) {
    userState.respond = userState.respond === "true";
  }

  // create new redis entry if it doesn't exist
  if (!userState || Object.keys(userState).length === 0) {
    userState.respond = true;
    userState.lastUserMessageTime = '0';
    userState.nextMessage = 'welcome';
  }

  // discard old messages
  if (timestamp < userState.lastUserMessageTime) {
    console.log("Old message");
    return res.json({ message: "Mensagem antiga" });
  }

  // check if message is a received message or a sent message and handle accordingly
  if (contacts) {
    console.log("Received message");
    userState = await handleReceivedMessage(req, res, userState);
  }
  else {
    console.log("Sent message");
    userState = await handleSentMessage(req, res, userState);
  }

  // Store new user state in Redis
  try {
    console.log("userState data: ", userState);

    userState.respond = userState.respond.toString(); // Convert boolean to string

    await redis.hSet(`wa-id:${waId}`, userState);
  } catch (error) {
    console.log(`error storing data ${error}`);
  }

  return res.json({ message: "Message processed" });
};

const verifyWebhook = (req, res) => {
  const mode = req.query["hub.mode"];
  const token = req.query["hub.verify_token"];
  const challenge = req.query["hub.challenge"];

  if (mode && token) {
    if (mode === "subscribe" && token === process.env.VERIFICATION_TOKEN) {
      console.log("WEBHOOK_VERIFIED");
      res.status(200).send(challenge);
    } else {
      res.sendStatus(403);
    }
  } else {
    res.json({ message: "Thank you for the message" });
  }
};

module.exports = { handleWebhook, verifyWebhook };
