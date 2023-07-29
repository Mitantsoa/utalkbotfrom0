const {logger,createInterResp} = require("../service/utils");
const {InteractionResponseType} = require("discord-interactions");


const listDBfield =[
    {id:"login",label:"Login",required: true},
    {id:"discusername",label:"Discord user name",required:true},
]

const inputbuilder = listDBfield.map(v=>{
    return {
        type:1,
        components:[{
            "type": 4,
            "custom_id": v.id,
            "label": v.label,
            "style": 1,
            "min_length": 1,
            "max_length": 4000,
            "placeholder": "...",
            "required": v.required
        }]
    };
})

console.log(inputbuilder)

const name = "add_login";
const action = async ()=>{
    logger("InteractionResponseType.MODAL= "+ InteractionResponseType.MODAL);
    try {
        // Send a message into the channel where command was triggered from
        const data = {
            type: InteractionResponseType.MODAL,
            // "data": {
            //     "title":"Ajouter un agent",
            //     "custom_id":name,
            //     "components": [
            //         {
            //             "type": 1,
            //             "components": [
            //                 {
            //                     "type": 4,
            //                     "custom_id": "v.id",
            //                     "label": "v.label",
            //                     "style": 1,
            //                     "min_length": 1,
            //                     "max_length": 4000,
            //                     "placeholder": "...",
            //                     "required": "v.required"
            //                 }
            //             ]
            //         }
            //     ]
            // }
            data:{
                "title": "Ajouter Login",
                "custom_id": "M_add_login",
                "components": inputbuilder
            }
        };
        // await createInterResp(data)
        return data;

    }catch (e) {
        console.log(e)
    }
}

module.exports = {name,action}