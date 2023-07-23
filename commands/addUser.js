const {logger} = require("../service/utils");
const {InteractionResponseType} = require("discord-interactions");


const listDBfield =[
    {id:"username",label:"Nom",required:true},
    {id:"firstname",label:"Prénom",required: true},
    {id:"uuid",label:"Matricule",required: true},
    {id:"adress",label:"Adress",required: false},
    {id:"tel",label:"Téléphone",required: false},
]

const inputbuilder = listDBfield.map(v=>{
    return {
        "type": 4,
        "custom_id": v.id,
        "label": v.label,
        "style": 1,
        "min_length": 1,
        "max_length": 4000,
        "placeholder": "...",
        "required": v.required
    };
})

console.log(inputbuilder)

const name = "useradd";
const action = ()=>{
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
                "title": "My Cool Modal",
                "custom_id": "cool_modal",
                "components": [{
                    "type": 1,
                    "components": [{
                        "type": 4,
                        "custom_id": "name",
                        "label": "Name",
                        "style": 1,
                        "min_length": 1,
                        "max_length": 4000,
                        "placeholder": "John",
                        "required": true
                    }]
                }]
            }
        };
        return data;

    }catch (e) {
        console.log(e)
    }
}

module.exports = {name,action}