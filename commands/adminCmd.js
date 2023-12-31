const {logger} = require("../service/utils");
const {InteractionResponseType} = require("discord-interactions");
const {notifMessage} = require("../service/myService");


const name = "useradd";
const updatePrev = false;
const deferred = true;
const mgsHeader = {
    ephemeral: false,
};
const action = ()=>{
    logger("InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE= "+ InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE);
    try {
        // Send a message into the channel where command was triggered from
        const data = {
            type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
            "data": {
                "tts": false,
                "content": "ADMIN :",
                "embeds": [
                    {
                        "title": "Superviseur Home",
                        "description": "Uniquement authorise pour le superviseur",
                        "color": 5814783,
                        "fields": [
                            {
                                "name": "Add user",
                                "value": "Ajouter un agent avec son **/nom, matricule, etc..**."
                            },
                            {
                                "name": "Add login",
                                "value": "Ajouter un login utilser avec le softphone avec son **/numéro**."
                            }
                        ]
                    }
                ],
                "allowed_mentions": { "parse": [] },
                "components": [{
                    "type": 1,
                    "components": [
                        {
                            "type": 2,
                            "label": "Add user",
                            "style": 1,
                            "custom_id": "add_user"
                        },{
                            "type": 2,
                            "label": "Add login",
                            "style": 2,
                            "custom_id": "add_login"
                        }
                    ]
                }]
            }};
        return data;

    }catch (e) {
        console.log(e)
        return notifMessage.error();
    }
}

module.exports = {name,action,updatePrev,deferred,mgsHeader}