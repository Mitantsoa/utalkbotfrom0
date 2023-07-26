const {logger,deferedMsg,editMessage,createInterResp} = require("../service/utils");
const {InteractionResponseType} = require("discord-interactions");
const {adduser,findUser} = require("../repository/repoAgent.js");

const name = "cool_modal";
const action = async (comp)=>{
        // logger("InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE= "+ InteractionResponseType.MODAL);
    try {
        // Send a message into the channel where command was triggered from

        // sending deffered message
        // await deferedMsg()

        // collection input text values
        const values = comp.map((v)=>{
            return v.components[0].value
        })
        // console.log("Values :",values)
        const dbresp = await adduser(values)
        const insertId = dbresp[0].insertId
        const newUser = await findUser(insertId)
        // console.log("newUser",newUser)

        const embedsFields = []
        for (const i in newUser){
            console.log("newUser i:",i)
            embedsFields.push({"name": i,"value": newUser[i]})
        }
        // console.log("embedsFields :",embedsFields)

        const data = {
                type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
                data:{
                "tts": false,
                "content": "test",
                "embeds": [
                    {
                        "title": "User Created",
                        "description": "Uniquement authorise pour le superviseur",
                        "color": 5814783,
                        "fields": embedsFields
                    }
                ],
                "allowed_mentions": { "parse": [] },
                "components": []
            }
        };
        await createInterResp(data)
        // return data;

    }catch (e) {
        console.log(e)
    }
}

module.exports = {name,action}