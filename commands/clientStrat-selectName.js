const {logger,createInterResp} = require("../service/utils");
const {InteractionResponseType} = require("discord-interactions");
const {findAll} = require('../repository/repoAgent')

console.log(inputbuilder)

const name = "startProd";
const action = async ()=>{

    try {

        const allagent = await findAll();


        // Send a message into the channel where command was triggered from
        const data = {
            type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
            // "data": {
            //     "title":"Ajouter un agent",
            //     "custom_id":name,
            //     "components": [
            //         {
            //             "type": 1,
            //             "components": [
            //                 {
            //                     "type": 4,
            //                     "custom_id": "v.id",
            //                     "label": "v.label",
            //                     "style": 1,
            //                     "min_length": 1,
            //                     "max_length": 4000,
            //                     "placeholder": "...",
            //                     "required": "v.required"
            //                 }
            //             ]
            //         }
            //     ]
            // }
            data:{
                "content": "Mason is looking for new arena partners. What classes do you play?",
                "components": [
                    {
                        "type": 1,
                        "components": [
                            {
                                "type": 3,
                                "custom_id": "Choissez votre nom",
                                "options":[
                                    {
                                        "label": "Rogue",
                                        "value": "rogue",
                                        "description": "Sneak n stab",
                                        "emoji": {
                                            "name": "rogue",
                                            "id": "625891304148303894"
                                        }
                                    },
                                    {
                                        "label": "Mage",
                                        "value": "mage",
                                        "description": "Turn 'em into a sheep",
                                        "emoji": {
                                            "name": "mage",
                                            "id": "625891304081063986"
                                        }
                                    },
                                    {
                                        "label": "Priest",
                                        "value": "priest",
                                        "description": "You get heals when I'm done doing damage",
                                        "emoji": {
                                            "name": "priest",
                                            "id": "625891303795982337"
                                        }
                                    }
                                ],
                                "placeholder": "Choose a class",
                                "min_values": 1,
                                "max_values": 3
                            }
                        ]
                    }
                ]
            }
        };
        await createInterResp(data)
        // return data;

    }catch (e) {
        console.log(e)
    }
}

module.exports = {name,action}