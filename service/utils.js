const config = require('dotenv/config');
const moment = require('moment');
config;
// const fetch = require('node-fetch');
const { verifyKey, InteractionResponseType} = require('discord-interactions');
const fs = require("fs");
const axios = require("axios");
const deferedmsgbuilder = require('./messagetype.js')

function VerifyDiscordRequest(clientKey) {
    return function (req, res, buf, encoding) {
        const signature = req.get('X-Signature-Ed25519');
        const timestamp = req.get('X-Signature-Timestamp');

        const isValidRequest = verifyKey(buf, signature, timestamp, clientKey);
        if (!isValidRequest) {
            res.status(401).send('Bad request signature');
            throw new Error('Bad request signature');
        }
    };
}

async function DiscordRequest(endpoint, options) {
    // append endpoint to root API URL
    const url = 'https://discord.com/api/v10/' + endpoint;
    // Stringify payloads
    if (options.body) options.body = JSON.stringify(options.body);
    // Use node-fetch to make requests
    const res = await fetch(url, {
        headers: {
            Authorization: `Bot ${process.env.DISCORD_TOKEN}`,
            'Content-Type': 'application/json; charset=UTF-8',
            'User-Agent': 'DiscordBot (https://github.com/discord/discord-example-app, 1.0.0)',
        },
        ...options
    });
    // throw API errors
    if (!res.ok) {
        const data = await res.json();
        console.log(res.status);
        throw new Error(JSON.stringify(data));
    }
    // return original response
    return res;
}

async function InstallGlobalCommands(appId, commands) {
    // API endpoint to overwrite global commands
    const endpoint = `applications/${appId}/commands`;

    try {
        // This is calling the bulk overwrite endpoint: https://discord.com/developers/docs/interactions/application-commands#bulk-overwrite-global-application-commands
        await DiscordRequest(endpoint, { method: 'PUT', body: commands });
    } catch (err) {
        console.error(err);
    }
}

// Simple method that returns a random emoji from list
function getRandomEmoji() {
    const emojiList = ['😭','😄','😌','🤓','😎','😤','🤖','😶‍🌫️','🌏','📸','💿','👋','🌊','✨'];
    return emojiList[Math.floor(Math.random() * emojiList.length)];
}

function capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

function logger(text){
    const now = moment().format('yyyy-MM-DD HH:mm:ss');
    const filename = "/home/victoryp/logs/Botutalk_"+moment().format('yyyy-MM')+".log"
    const content = now+": "+text
    fs.appendFile(filename,content,function(err){ if(err) throw err;});
    return console.log(now,": ",text);
}

async function editMessage(msg,application_id,token){
    // updating loading message
    // const url = process.env._editUrl;
    const url = `https://discord.com/api/webhooks/${application_id}/${token}/messages/@original`;
    msg = msg.data
    // console.log("=============axio data",msg.components)
    logger("edit:"+url);
    await axios.patch(url,msg)
        .then(data => console.log("axios response: success"))
        .catch(e => console.log("axios error: error",e.response.data))
}

async function createInterResp(msg,url){
    // create interaction response
    logger("create"+url);
    await axios.post(url,msg)
        .then(data => console.log("response sent"))
        .catch(e => console.log("there is error",e.response.data))
}

async function deferedMsg(url,isEdit,application_id,token,mgsHeader){

    const msg = deferedmsgbuilder(mgsHeader)
    if(!isEdit){
        await createInterResp(msg,url)
    }else{
        await editMessage(msg,application_id,token)
    }
}

async function editdeferedMsg(application_id,token){
    const msg = {
        type: InteractionResponseType.DEFERRED_CHANNEL_MESSAGE_WITH_SOURCE,
        "data": {
            "tts": false,
            "content": "WIP",
            "allowed_mentions": { "parse": [] },
        }};
    await editMessage(msg,application_id,token)
}

const errorMsg = {
    type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
    data:{
        "content": "",
        "embeds": [
            {
                "title": "Erreur",
                "description": "Une erreur lors du traitement",
                "color": 5814783
            }
        ],
        "components": []
    }
};
module.exports = {VerifyDiscordRequest,DiscordRequest,InstallGlobalCommands,getRandomEmoji,capitalize,logger,editMessage,deferedMsg,createInterResp,editdeferedMsg,errorMsg}