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
const { VerifyDiscordRequest, getRandomEmoji, DiscordRequest,logger } = require('./service/utils.js');

let {editUrl,createdUrl} = require('./service/constant')

// Commands loading
var normalizedPath = require("path").join(__dirname, "commands");
let commandClass = {}
console.log(normalizedPath)
fs.readdirSync(normalizedPath).forEach(function(file) {

    const body = require("./commands/" + file)
    commandClass[body.name] = body.action;
    console.log("./commands/" + file)

});
console.log(commandClass)
// commandClass.AdminCmd()

// Create an express app
const app = express();
// Get port, or default to 3000
const PORT = process.env.PORT || 80;
// Parse request body and verifies incoming requests using discord-interactions package
app.use(express.json({ verify: VerifyDiscordRequest(process.env.PUBLIC_KEY) }));

// Store for in-progress games. In production, you'd want to use a DB
const activeGames = {};
const repoAgent = require('./repository/repoAgent.js')

/**
 * Interactions endpoint URL where Discord will send HTTP requests
 */
app.post('/interactions', async function (req, res) {
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

    editUrl = `https://discord.com/api/webhooks/${application_id}/${token}/messages/@original`
    createdUrl = `https://discord.com/api/interactions/${id}/${token}/callback`;

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
    if (type === InteractionType.APPLICATION_COMMAND) {
        const { name } = data;
        logger("name = "+name)
        try{
            const resp = commandClass[name]()
            console.log(resp)
            res.send(resp)
        }catch (e) {
            logger("command :"+name+", does not exist")
        }
    }else{
        const { custom_id, components } = data;
        console.log("data :",data)
        try{
            const resp = commandClass[custom_id](components)
            console.log(resp)
            res.send(resp)
        }catch (e) {
            logger("Custom_id :"+custom_id+", does not exist")
        }
    }
});

app.post('/',async function(req, res){
    const {type} = req.body;
    if(type == 1) return res.send({type:1});
});

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