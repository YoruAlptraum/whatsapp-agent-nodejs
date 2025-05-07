function getTimestamp(data) {
    try {
        // Case 1: In entry/changes/value/messages (received messages)
        if (data.entry?.[0]?.changes?.[0]?.value?.messages?.[0]?.timestamp) {
            return data.entry[0].changes[0].value.messages[0].timestamp;
        }

        // Case 2: In entry/changes/value/statuses (sent messages)
        if (data.entry?.[0]?.changes?.[0]?.value?.statuses?.[0]?.timestamp) {
            return data.entry[0].changes[0].value.statuses[0].timestamp;
        }

        // No timestamp found
        return null;
    } catch (error) {
        console.error("Error extracting timestamp:", error);
        return null;
    }
}

module.exports = {
    getTimestamp,
};
