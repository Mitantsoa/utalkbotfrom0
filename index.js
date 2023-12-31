const config = require('dotenv/config');
const axios = require('axios')
config;
const express = require('express');
const fs = require('fs')
const {
    InteractionType,
    InteractionResponseType,
    InteractionResponseFlags,
    MessageComponentTypes,
    ButtonStyleTypes,
} =require('discord-interactions')
const { VerifyDiscordRequest, getRandomEmoji, DiscordRequest,logger,createInterResp,deferedMsg,editMessage,editdeferedMsg } = require('./service/utils.js');
const {findtoken,addtoken} = require('./repository/repotoken.js')
const {notifMessage, fetchcurrentproductionresult} = require("./service/myService");
const moment = require("moment");
// Commands loading
var normalizedPath = require("path").join(__dirname, "commands");
let commandClass = {}
// console.log("normalizedPath:",normalizedPath)
fs.readdirSync(normalizedPath).forEach(function(file) {

    const body = require(normalizedPath +'/'+ file)
    // console.log("body" + body)
    commandClass[body.name] = body;
    // console.log(normalizedPath +"/"+ file)

});
// console.log("commandClass",commandClass)
// commandClass.AdminCmd()

// Create an express app
const app = express();
// Get port, or default to 3000
const PORT = process.env.PORT || 80;
// Parse request body and verifies incoming requests using discord-interactions package
app.use(express.json({ verify: VerifyDiscordRequest(process.env.PUBLIC_KEY) }));

/**
 * Interactions endpoint URL where Discord will send HTTP requests
 */
app.post('/interactions', async function (req, res) {

    try{
        // Interaction type and data
        const { type, application_id, data, member,token,id} = req.body;
        console.group("req Body")
        // console.log(req.body)
        console.groupEnd()
        logger("request type = "+ type)
        logger("InteractionType.PING = " + InteractionType.PING)
        // console.log('member',member)
        const username = member.user.username
        logger("user =" + username)
        logger("AppId =" + application_id)
        logger("Type =" + type)
        logger("id =" + id)


        const _createdUrl  = `https://discord.com/api/interactions/${id}/${token}/callback`;

        /**
         * Handle verification requests
         */
        if (type === InteractionType.PING) {
            return res.send({ type: InteractionResponseType.PONG });
        }

        /**
         * Handle slash command requests
         * See https://discord.com/developers/docs/interactions/application-commands#slash-commands
         */
            // if (type === InteractionType.APPLICATION_COMMAND) {
        const interIndex = data.name == undefined ? data.custom_id.split("|")[0] : data.name.split("|")[0]
        const prevInteractionId = data.name == undefined ? data.custom_id.split("|")[1] : data.name.split("|")[1]
        const interComp = data.components
        console.log("interComp:",interComp)
        let prevInteractiontoken = ""
        // const { name } = data;
        const cmdClass = commandClass[interIndex]
        // res.send(notifMessage.error());
        // deferedMsg(_createdUrl,token)
        // console.log(res)
        try{
            logger('cmdClass.deferred:'+cmdClass.deferred)
            logger('cmdClass.updatePrev:'+cmdClass.updatePrev)

            try{
                // store current interaction and token
                await addtoken([id,application_id,token])
                // fetch previous token of previous interaction
                // if(cmdClass.updatePrev) prevInteractiontoken = await findtoken(prevInteractionId,application_id) ; prevInteractiontoken = prevInteractiontoken["interactiontoken"];
                prevInteractiontoken = await findtoken(prevInteractionId,application_id);
                prevInteractiontoken = prevInteractiontoken.interactiontoken;
            }catch (e){
                logger("token sql error: "+e)
            }

            logger("interIndex = "+interIndex)
            logger("prevInteractiontoken = "+prevInteractiontoken)

            // check if deferred si required
            // if(cmdClass.deferred && cmdClass.updatePrev) await editdeferedMsg(application_id,prevInteractiontoken)
            await deferedMsg(
                _createdUrl,
                cmdClass.updatePrev,
                application_id,
                prevInteractiontoken,
                cmdClass.mgsHeader
            )

            // await deferedMsg(_createdUrl)
            const resp = await  cmdClass.action({"interComp":interComp,"interactionid":id,"data":data,"member":member})

            // check if response need be to updated on interaction
            if (cmdClass.updatePrev) await editMessage(resp,application_id,prevInteractiontoken)
            else if (cmdClass.deferred) await editMessage(resp,application_id,token)
            else await createInterResp(resp,_createdUrl)
            // res.send(resp)
        }catch (e) {
            logger("command :"+interIndex+" does not exist")
            res.send(notifMessage.error());
        }
    }catch (e) {
        res.send(notifMessage.error())
    }

});

app.post('/',async function(req, res){
    const {type} = req.body;
    if(type == 1) return res.send({type:1});
});

app.get('/prodreport',async (req,res)=>{

    try{
        const data = await fetchcurrentproductionresult();
        let listprod = []
        data.forEach((v,i)=>{
            // listprod += `|- **${v.Agentfirstname +"-"+v.Agentlastname}** [${v.loginpost}] :  *nb appel* = ${v.nbcall}  |  *durée appel* = ${v.callduration} | *adc* = ${v.adc}\n`;
            const status = v.status == "on" ? "encours" : "fini";
            listprod.push({
                "name": `**${v.Agentfirstname +"-"+v.Agentlastname}** [${v.loginpost}] : *${status}*`,
                "value": `*nb appel* = ${v.nbcall}  |  *durée appel* = ${v.callduration} | *adc* = ${v.adc}\nDébut : ${v.open_proddate}\nFin : ${v.end_proddate}`
            });
        })
        const msg = {
            "content": null,
            "embeds": [
                {
                    "title": `Procution du ${moment().format('yyyy-MM-DD HH:mm:ss')}`,
                    "description": "",
                    "color": 2722314,
                    "fields":listprod
                }
            ],
            "attachments": []
        }
        const url  = "https://discord.com/api/webhooks/1093900875036114964/WasH3BwApUEwb7sqs-NILXJF-Rdth8hOQBWJJh1I5uYNSbb8fG46CCFAiAQ69PLUHrIN"
        await axios.post(url,msg)
        res.send(listprod)
    }catch (e) {
        res.send(e)
    }

})

app.listen(PORT, () => {
    logger('Listening on port', PORT);
});


async function x(editurl,createdurl) {
    // return new Promise((resolve, reject,) => {
    //     // setTimeout(async (editurl) => {
    //     //     resolve(data);
    //     // },5000);
    // });
    const data ={
            "tts": false,
            "content": "Admin action allowed :",
            "embeds": [],
            "allowed_mentions": { "parse": [] },
            "components": [
                {
                    "type": 1,
                    "components": [
                        {
                            "type": 2,
                            "label": "Click me!",
                            "style": 1,
                            "custom_id": "click_one"
                        }
                    ]
                }
            ]
        };
    const dataModal = {
        type: InteractionResponseType.MODAL,
        "data": {
            "tts": false,
            // content:"to modal",
            title:"my modal awaited",
            custom_id:"M001",
            // "allowed_mentions": { "parse": [] },
            "components": [
                {
                    "type": 1,
                    "components": [
                        {
                            "type": 2,
                            "label": "Click me!",
                            "style": 1,
                            "custom_id": "click_one"
                        }
                    ]
                }
            ]
        }};
    logger("editurl =" + editurl)

    // updating loading message
    // await axios.patch(editurl,dataModal)
    //     .then(data => console.log("axios response: success"))
    //     .catch(e => console.log("axios error: error",e.response.data))

    // opening modal
    logger("createdurl =" + createdurl)
    await axios.post(createdurl,dataModal)
        .then(data => console.log("Modal open"))
        .catch(e => console.log("there is error",e))
}