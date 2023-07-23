const config = require('dotenv/config');
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
    const { type, id, data, member} = req.body;
    logger("request type = "+ type)
    logger("InteractionType.PING = " + InteractionType.PING)
    logger("user =" + req.user)
    console.log('member',member)
    const username = member.user.username
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
                const m = await x()
                // Send a message into the channel where command was triggered from
                logger(m)
                res.send(m);

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
        setTimeout(() => {
            const data = {
                type: InteractionResponseType.DEFERRED_CHANNEL_MESSAGE_WITH_SOURCE,
                "data": {
                    "tts": false,
                    "content": "this is from await",
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
                }};
            resolve(data);
        },5000);
    });
}