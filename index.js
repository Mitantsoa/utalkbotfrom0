const config = require('dotenv/config');
const axios = require('axios')
config;
const express = require('express');
const {
    InteractionType,
    InteractionResponseType,
    InteractionResponseFlags,
    MessageComponentTypes,
    ButtonStyleTypes,
} =require('discord-interactions')
const { VerifyDiscordRequest, getRandomEmoji, DiscordRequest,logger } = require('./service/utils.js');
// import { getShuffledOptions, getResult } from './game.js';

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
    const { type, application_id, data, member,token} = req.body;
    console.group("req Body")
    console.log(req.body)
    console.groupEnd()
    logger("request type = "+ type)
    logger("InteractionType.PING = " + InteractionType.PING)
    console.log('member',member)
    const username = member.user.username
    logger("user =" + username)
    logger("AppId =" + application_id)

    const editurl = `https://discord.com/api/webhooks/${application_id}/${token}/messages/@original`
    logger("editurl =" + editurl)
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

        // "test" command
        if (name === 'ping') {
            logger("InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE= "+ InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE);

            try {
                x(editurl)
                // Send a message into the channel where command was triggered from
                const data = {
                    type: InteractionResponseType.DEFERRED_CHANNEL_MESSAGE_WITH_SOURCE,
                    "data": {
                        "tts": false,
                        "content": "this is from await",
                        "embeds": [],
                        "allowed_mentions": { "parse": [] },
                        "components": []
                    }};
                res.send(data);

            }catch (e) {
                console.log(e)
            }

        }
        if (name == 'useradd') {
            logger("send pong");
            // Send a message into the channel where command was triggered from
            const resp = await repoAgent.findUser();
            console.log(resp);
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


function x() {
    return new Promise((resolve, reject) => {
        setTimeout(async (editurl) => {

            const data = {
                content:"this is to update",
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
            // const data = {
            //     type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
            //     "data": {
            //         "tts": false,
            //         "content": "this is from await",
            //         "embeds": [],
            //         "allowed_mentions": { "parse": [] },
            //         "components": [
            //             {
            //                 "type": 1,
            //                 "components": [
            //                     {
            //                         "type": 2,
            //                         "label": "Click me!",
            //                         "style": 1,
            //                         "custom_id": "click_one"
            //                     }
            //                 ]
            //             }
            //         ]
            //     }};
            await axios.patch(editurl,data)
                .then(data => console.log("axios response:",data.data))
                .catch(e => console.log("axios error:",e.data,e.request))
            resolve(data);
        },5000);
    });
}