const {InteractionResponseType} = require("discord-interactions");
const {startProduction} = require('../service/myService.js')
const {errorMsg} = require('../service/utils.js')
const moment = require("moment");
const {notifMessage} = require("../service/myService");

const name = "clientstart-agentUID";
const updatePrev = true;
const deferred = true;
const action = async ({data,member})=>{

    try {

        const discoUser = member.user.username
        // console.log("agent id :",data)
        // console.log("agent id :",data.values[0])
        // console.log("discoUser:",discoUser)
        const startprod = await startProduction(discoUser,data.values[0])

        return startprod;

    }catch (e) {
        console.log(e)
        return notifMessage.error('Erreur survenu');
    }
}

module.exports = {name,action,updatePrev,deferred}