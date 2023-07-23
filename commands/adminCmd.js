const {logger} = require("../service/utils");
const {InteractionResponseType} = require("discord-interactions");


const name = "ping";
const action = ()=>{
    logger("InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE= "+ InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE);
    try {
        // Send a message into the channel where command was triggered from
        const data = {
            type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
            "data": {
                "tts": false,
                "content": "this is from await",
                "embeds": [],
                "allowed_mentions": { "parse": [] },
                "components": []
            }};
        return data;

    }catch (e) {
        console.log(e)
    }
}

module.exports = {name,action}