const {logger,createInterResp} = require("../service/utils");
const {InteractionResponseType} = require("discord-interactions");
const {notifMessage} = require("../service/myService");


const listDBfield =[
    {id:"uuid",label:"Matricule",required: true},
    {id:"username",label:"Nom",required:true},
    {id:"firstname",label:"Prénom",required: true},
    {id:"adress",label:"Adress",required: false},
    {id:"tel",label:"Téléphone",required: false},
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

const name = "add_user";
const updatePrev = false;
const deferred = false;
const action = async ()=>{
    logger("InteractionResponseType.MODAL= "+ InteractionResponseType.MODAL);
    try {
        // Send a message into the channel where command was triggered from
        const data = {
            type: InteractionResponseType.MODAL,
            data:{
                "title": "Ajouter Agent",
                "custom_id": "cool_modal",
                "components": inputbuilder
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