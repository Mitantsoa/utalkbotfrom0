const {InteractionResponseType} = require("discord-interactions");
const {startProduction} = require('../service/myService.js')
const {errorMsg} = require('../service/utils.js')
const moment = require("moment");

const name = "clientstart-agentUID";
const updatePrev = true;
const deferred = true;
const action = async ({data,member})=>{

    try {

        const discoUser = member.user.username
        console.log("agent id :",data)
        console.log("agent id :",data.values[0])
        console.log("discoUser:",discoUser)
        const startprod = await startProduction(discoUser,data.values[0])
        // const startprod = "this is a test";

        // Send a message into the channel where command was triggered from
        const dataresp = {
            type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
            data:{
                "content": "",
                "embeds": [
                    {
                        "title": "Début shift",
                        "description": startprod,
                        "color": 5814783
                    }
                ],
                "components": []
            }
        };
        // await createInterResp(data)
        return dataresp;

    }catch (e) {
        console.log(e)
        return errorMsg;
    }
}

module.exports = {name,action,updatePrev,deferred}