const axios = require('axios');

/**
 * Sends a message using the WhatsApp API.
 * @param {string} to - The recipient's WhatsApp ID.
 * @param {string} body - The message body to send.
 * @returns {Promise} - The response from the WhatsApp API.
 */
async function sendMessage(to, body = "no body") {
    // send message
    try {
        const response = await axios.post(
            `${process.env.WHATSAPP_API_URL}/${process.env.WHATSAPP_PHONE_NUMBER_ID}/messages`,
            {
                messaging_product: "whatsapp",
                to: to,
                type: "text",
                text: {
                    body: body,
                }
            },
            {
                headers: {
                    Authorization: `Bearer ${process.env.WHATSAPP_TOKEN}`,
                    'Content-Type': 'application/json',
                },
            }
        );
        return response.data;
    } catch (error) {
        console.error("Error sending message:", error.response ? error.response.data : error.message);
        throw error;
    }

    // try {
    //     const response = await axios.post(
    //         `${process.env.WHATSAPP_API_URL}/${process.env.WHATSAPP_PHONE_NUMBER_ID}/messages`,
    //         {
    //             messaging_product: "whatsapp",
    //             to: to,
    //             type: "interactive",
    //             interactive: {
    //                 type: "button",
    //                 body: {
    //                     text: body,
    //                 },
    //                 action: {
    //                     buttons: [
    //                         {
    //                             type: "reply",
    //                             reply: {
    //                                 id: "1",
    //                                 title: "1",
    //                             },
    //                         },
    //                         {
    //                             type: "reply",
    //                             reply: {
    //                                 id: "2",
    //                                 title: "2",
    //                             },
    //                         },
    //                         {
    //                             type: "reply",
    //                             reply: {
    //                                 id: "3",
    //                                 title: "3",
    //                             },
    //                         },
    //                     ],
    //                 },
    //             }
    //         },
    //         {
    //             headers: {
    //                 Authorization: `Bearer ${process.env.WHATSAPP_TOKEN}`,
    //                 'Content-Type': 'application/json',
    //             },
    //         }
    //     );
    //     return response.data;
    // } catch (error) {
    //     console.error("Error sending message:", error.response ? error.response.data : error.message);
    //     console.error("body: ", body);
    //     throw error;
    // }
}

module.exports = sendMessage;
