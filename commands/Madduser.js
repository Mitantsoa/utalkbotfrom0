const {logger} = require("../service/utils");
const {InteractionResponseType} = require("discord-interactions");


const name = "MaddUser";
const action = (comp)=>{
    console.log("comp[0].components",comp[0].components)
    // logger("InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE= "+ InteractionResponseType.MODAL);
    try {
        // Send a message into the channel where command was triggered from
        const data = {
            type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
            "data": {
                "tts": false,
                "content": " ",
                "embeds": [
                    {
                        "title": "Modal clicked",
                        "description": "Uniquement authorise pour le superviseur",
                        "color": 5814783,
                        "fields": []
                    }
                ],
                "allowed_mentions": { "parse": [] },
                "components": []
            }};
        return data;

    }catch (e) {
        console.log(e)
    }
}

module.exports = {name,action}