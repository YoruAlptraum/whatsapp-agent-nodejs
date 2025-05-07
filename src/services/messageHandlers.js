const sendMessage = require('../services/sendMessage');
const { getClientIdByCpf } = require('../services/dbServices');
const responses = require('../config/responses.json');

const responseDict = responses.responses;

async function handleReceivedMessage(req, res, userState) {
    const value = req.body["entry"][0]["changes"][0]["value"];
    const contacts = value["contacts"];
    const messages = value["messages"];

    if (!userState.respond) {
        console.log("------------------ 'respond' set to false ------------------");
    } else if (contacts && messages) {
        userState.lastUserMessageTime = messages[0]["timestamp"];

        let msg = messages[0]["text"] ? messages[0]["text"]["body"] : "";

        // FOR TESTING: manually trigger a message to stop bot from responding
        if (messages[0]["type"] === "text") {
            if (msg == "stop") {
                await sendMessage(contacts[0]["wa_id"], "stop responding");
            }
        }

        try {
            let apiRes = null;
            // check if next message has a message to send
            if (responseDict[userState.nextMessage]["message"]) {
                msg = responseDict[userState.nextMessage].message;
                nextMessage = responseDict[userState.nextMessage].next;
            }
            else {
                // validate user input
                let userInput = messages[0]["text"]["body"].toLowerCase();
                if (responseDict[userState.nextMessage][userInput]) {
                    msg = responseDict[userState.nextMessage][userInput].message;
                    nextMessage = responseDict[userState.nextMessage][userInput].next;
                }
                else {
                    msg = "Opção inválida, digite novamente";
                }
            }
            apiRes = await sendMessage(contacts[0]["wa_id"], msg);

            userState.nextMessage = nextMessage;
            if (userState.nextMessage == "end") {
                userState.respond = false;
                console.log("finished conversation, respond set to false");
            }
            userState.lastAPIMessage = apiRes["messages"][0]["id"];

            console.log("Message ID: " + userState.lastAPIMessage);

        } catch (error) {
            console.error("Error sending message:", error.response ? error.response.data : error.message);
        }
    }

    return userState;
};

async function handleSentMessage(req, res, userState) {
    const value = req.body["entry"][0]["changes"][0]["value"];
    const statuses = value["statuses"];

    // Check if the message is from human-agent and stop responding
    if (statuses && statuses[0]["id"] !== userState.lastAPIMessage) {
        userState.respond = false;
        console.log("respond set to false");
    }

    return userState;
};

module.exports = { handleReceivedMessage, handleSentMessage };
