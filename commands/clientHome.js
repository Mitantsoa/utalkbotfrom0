const {logger} = require("../service/utils");
const {InteractionResponseType} = require("discord-interactions");


const name = "ping";
const updatePrev = false;
const deferred = true;
const action = ()=>{
    logger("InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE= "+ InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE);
    try {
        // Send a message into the channel where command was triggered from
        const data = {
            type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
            "data": {
                "tts": false,
                "content": "Home :",
                "flags":1<<7,
                "embeds": [
                    {
                        "title": "Agent Home",
                        "description": "C'est ici la gestion de la présence",
                        "color": 5814783,
                        "fields": [
                            {
                                "name": "Début",
                                "value": "Commencer la production."
                            },
                            {
                                "name": "Pause",
                                "value": "Faire une pause."
                            },
                            {
                                "name": "Retour",
                                "value": "Reprender après une pause."
                            },
                            {
                                "name": "Fin",
                                "value": "Términer le shift/production."
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
                            "label": "Début",
                            "style": 1,
                            "custom_id": "startProd"
                        },{
                            "type": 2,
                            "label": "Pause",
                            "style": 2,
                            "custom_id": "clientpause-start"
                        },{
                            "type": 2,
                            "label": "Retour",
                            "style": 3,
                            "custom_id": "clientpause-end"
                        },{
                            "type": 2,
                            "label": "Fin",
                            "style": 4,
                            "custom_id": "stopProd"
                        }
                    ]
                }]
            }};
        return data;

    }catch (e) {
        console.log(e)
    }
}

module.exports = {name,action,updatePrev,deferred}