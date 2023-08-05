const {InteractionResponseType} = require("discord-interactions");
const msg = {
    type: InteractionResponseType.DEFERRED_CHANNEL_MESSAGE_WITH_SOURCE,
    "data": {
        "tts": false,
        "content": "WIP",
        "allowed_mentions": { "parse": [] },
    }};

const deferedMsgBuilder = (msgHeager)=>{
    if(msgHeager.ephemeral) msg.data["flags"] = 1<<6;
    return msg
}

module.exports = deferedMsgBuilder