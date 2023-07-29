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
                        "title": "Agent selected",
                        "description": "",
                        "color": 5814783
                    }
                ],
                "components": []
            }
        };
        // await createInterResp(data)
        return data;

    }catch (e) {
        console.log(e)
    }
}

module.exports = {name,action}