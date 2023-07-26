const {logger,createInterResp} = require("../service/utils");
const {InteractionResponseType} = require("discord-interactions");
const {findAll} = require('../repository/repoAgent')

const name = "clientstart-agentUID";
const action = async ()=>{

    try {

        const allagent = await findAll();
        const options = allagent.map((v,i)=>{
            return {
                "label": v.Agentuid,
                "value": v.Agentuid,
                "description": v.Agentfirstname +"-"+v.Agentlastname
            };
        })

        console.log(options)

        // Send a message into the channel where command was triggered from
        const data = {
            type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
            data:{
                "content": "",
                "embeds": [
                    {
                        "title": "Merci de vous identifer parmis la liste",
                        "description": "Si vous n'est pas dans la liste merci de contacter le superviseur.\n Il est important de ne pas se trompé de nom la production sera **comptabilisé en dépendence**",
                        "color": 5814783
                    }
                ],
                "components": [
                    {
                        "type": 1,
                        "components": [
                            {
                                "type": 3,
                                "custom_id": "agentUID",
                                "options":options,
                                "placeholder": "---",
                                "min_values": 1,
                                "max_values": 1
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