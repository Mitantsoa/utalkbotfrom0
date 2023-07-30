const {findLoginByDiscouser} = require("../repository/repoLogin");
const {isLoginOnProd, notifMessage, addBreak} = require("../service/myService");

const name = "";
const updatePrev = false;
const deferred = true;
const action = async ({data,member})=>{

    try {

        const discoUser = member.user.username
        const _loginpost = await findLoginByDiscouser(discoUser)
        const _isLoginOnProd = await isLoginOnProd(discoUser)
        console.log("_isLoginOnProd :",_isLoginOnProd)
        if(!_isLoginOnProd.status) return notifMessage.info(`Login **${_loginpost.loginpost}** n'est actuellement pas en production merci de commencer un shift avant une pause.`);

        const _addBreak = await addBreak(discoUser,_isLoginOnProd.data.idproduction,_isLoginOnProd.data.idagent)

        return _addBreak;

    }catch (e) {
        console.log(e)
        return notifMessage.error('Erreur survenue');
    }
}

module.exports = {name,action,updatePrev,deferred}