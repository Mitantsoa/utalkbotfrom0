const {logger} = require("../service/utils");
const {InteractionResponseType} = require("discord-interactions");
const {adduser} = require("../repository/repoAgent.js")

const name = "cool_modal";
const action = async (comp)=>{
    const values = comp.map((v)=>{
        return v.components[0].value
    })
    // console.log("Values :",values)
    const dbresp = await adduser(values)
    console.log(dbresp)
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