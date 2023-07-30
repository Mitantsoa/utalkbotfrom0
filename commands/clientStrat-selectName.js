const {InteractionResponseType} = require("discord-interactions");
const {findAll} = require('../repository/repoAgent')
const {isLoginOnProd,notifMessage} = require("../service/myService");
const {findLoginByDiscouser} = require("../repository/repoLogin");

const name = "startProd";
const updatePrev = false;
const deferred = true;
const action = async ({interactionid,member})=>{
    try {
        console.log('=========interactionid',interactionid)
        const discoUser = member.user.username
        const _loginpost = await findLoginByDiscouser(discoUser)
        const _isLoginOnProd = await isLoginOnProd(discoUser)
        console.log("_isLoginOnProd :",_isLoginOnProd)
        if(_isLoginOnProd.status) return notifMessage.info(`Login **${_loginpost.loginpost}** toujours en service merci de terminer le shift encours`);

        const allagent = await findAll();
        const options = allagent.map((v,i)=>{
            return {
                "label": v.Agentfirstname +"-"+v.Agentlastname,
                "value": v.idAgent,
                "description": v.Agentuid ,
                "disabled":true
            };
        })

        // console.log(options)

        // Send a message into the channel where command was triggered from
        const data = {
            type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
            data:{
                "content": "",
                "flags":6,
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
                                "custom_id": "clientstart-agentUID|"+interactionid,
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
        // await createInterResp(data)
        return data;

    }catch (e) {
        console.log(e)
        return notifMessage.error();
    }
}

module.exports = {name,action,updatePrev,deferred}