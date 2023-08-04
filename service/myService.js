const {findLoginByDiscouser} = require("../repository/repoLogin");
const {findUser} = require("../repository/repoAgent");
const {addProd,addProdDetails,addProdResult,fetchlastcdrbyloginpost, fetchopenproductionfromuserdisco, updateProdResult,
    fetchresultatend, fetchopenpauseproductionfromuserdisco
} = require("../repository/repoProduction");
const moment = require("moment");
const {InteractionResponseType} = require("discord-interactions");

/*
    Start production
 */
const startProduction = async (discoUser,idagent)=>{

    try{

        // Collection all input
        const login = await findLoginByDiscouser(discoUser);
        const _idlogin = login.idlogin;
        const _loginpost = login.loginpost;
        console.log("_idlogin :",_idlogin)
        console.log("_loginpost :",_loginpost)
        const _idagent = idagent;

        const insertProd = await addProd([_idagent,_idlogin]);
        const _idproduction = insertProd[0].insertId;
        console.log("_idproduction :",_idproduction)
        const _productiondetailsdate = moment().format('yyyy-MM-DD HH:mm:ss');
        const _idprod_action = 1;
        await addProdDetails([_productiondetailsdate,_idprod_action,_idproduction]);

        const cdrdetails = await fetchlastcdrbyloginpost(_loginpost)
        const _Resultopencdrid = cdrdetails[0].iddatingcdrdetails
        await addProdResult([_Resultopencdrid,null,_idproduction])

        const _agent = await findUser(_idagent)

        return notifMessage.info(`Début shift agent **${_agent.Agentfirstname}** :\n-Début : ${_productiondetailsdate}\n-login : ${_loginpost}`);
        // return `Début shift`;

    }catch (e) {
        console.log(e);
        return notifMessage.error('Erreur survenu');
    }
}

const endShift = async (discoUser,_idproduction,_idagent)=>{
    try{
        // Collection all input
        const login = await findLoginByDiscouser(discoUser);
        const _idlogin = login.idlogin;
        const _loginpost = login.loginpost;
        const agent = await findUser(_idagent);
        const _agentfirstname = agent.Agentfirstname;
        console.log("_idlogin :",_idlogin)
        console.log("_loginpost :",_loginpost)
        console.log("_idproduction :",_idproduction)
        console.log("_agentfirstname :",_agentfirstname)
        const _idprod_action = 4;
        const _productiondetailsdate = moment().format('yyyy-MM-DD HH:mm:ss');
        await addProdDetails([_productiondetailsdate,_idprod_action,_idproduction]);

        const cdrdetails = await fetchlastcdrbyloginpost(_loginpost)
        const _Resultopencdrid = cdrdetails[0].iddatingcdrdetails
        await updateProdResult([_Resultopencdrid,_idproduction])

        const _result = await fetchresultatend(_idproduction)

        return notifMessage.info(`Fin de shift [${_agentfirstname}]:\n- date : ${_productiondetailsdate}\n- login : ${_loginpost}\n- Nb appel : ${_result.countcall}\n- Durée d'appel : ${_result.durecall}\n- TCM/ACD : ${_result.acdcall}`)
    }catch (e){
        console.log(e)
        return notifMessage.error('Erreur survenu');
    }
}

/*
    Break management :
 */
const addBreakMidlware = async (discoUser,_idproduction,_idagent,_idprod_action,msgTitle)=>{
    try{
        // Collection all input
        const login = await findLoginByDiscouser(discoUser);
        const _idlogin = login.idlogin;
        const _loginpost = login.loginpost;
        const agent = await findUser(_idagent);
        const _agentfirstname = agent.Agentfirstname;
        console.log("_idlogin :",_idlogin)
        console.log("_loginpost :",_loginpost)
        console.log("_idproduction :",_idproduction)
        console.log("_agentfirstname :",_agentfirstname)
        const _productiondetailsdate = moment().format('yyyy-MM-DD HH:mm:ss');
        await addProdDetails([_productiondetailsdate,_idprod_action,_idproduction]);
        return notifMessage.info(`${msgTitle} [${_agentfirstname}]:\n- date : ${_productiondetailsdate}\n- login : ${_loginpost}`)
    }catch (e){
        console.log(e)
        return notifMessage.error('Erreur survenu');
    }
}

const addBreak = {
    _start:async (discoUser,_idproduction,_idagent)=>{
        return addBreakMidlware(discoUser,_idproduction,_idagent,2,'Début du pause');
    },
    _end:async (discoUser,_idproduction,_idagent)=>{
        return addBreakMidlware(discoUser,_idproduction,_idagent,3,'Fin de pause');
    },
}

const isLoginOnProd = async (discoUser)=> {
    // check if login available
    const openProd = await fetchopenproductionfromuserdisco(discoUser)
    console.log("openProd : ",openProd)
    console.log("openProd.size : ",openProd.length)
    const isOnProd = openProd.length > 0 ? true : false;
    console.log("isOnProd : ",isOnProd)
    return {status:isOnProd,data:openProd[0]}
}

const isLoginOnPause = async (discoUser)=> {
    // check if login available
    const openProd = await fetchopenpauseproductionfromuserdisco(discoUser)
    console.log("openProd : ",openProd)
    console.log("openProd.size : ",openProd.length)
    const isOnProd = openProd.length > 0 ? true : false;
    console.log("isOnProd : ",isOnProd)
    return {status:isOnProd,data:openProd[0]}
}

const notifMessage = {
    "info" : (message)=>{
        return notifMessagebase({type:"INFO",desc:message,color:5814783});
    },
    "error" : (message)=>{
        return notifMessagebase({type:"ERROR",desc:"Erreur survenu",color:13575703});
    },
    "warrning" : (message)=>{
        return notifMessagebase({type:"INFO",desc:message,color:14582290});
    }
}

const notifMessagebase = ({type,desc,color})=>{
    return {
        type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
        data:{
            "content": "",
            "flags":1 << 6,
            "embeds": [
                {
                    "title": type,
                    "description": desc,
                    "color": color
                }
            ],
            "components": []
        }
    };
}

module.exports = {startProduction,isLoginOnProd,notifMessage,addBreak,endShift,isLoginOnPause}