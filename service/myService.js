const {findLoginByDiscouser} = require("../repository/repoLogin");
const {addProd,addProdDetails,addProdResult,fetchlastcdrbyloginpost, fetchopenproductionfromuserdisco} = require("../repository/repoProduction");
const moment = require("moment");

const startProduction = async (discoUser,idagent)=>{

    try{
        // check if login available
        const openProd = await fetchopenproductionfromuserdisco(discoUser)
        console.log("openProd : ",openProd)
        console.log("openProd.size : ",openProd.length)
        const isAvailable = openProd.length > 0 ? false : true;
        console.log("isAvailable : ",isAvailable)
        // Collection all input
        const login = await findLoginByDiscouser(discoUser);
        const _idlogin = login.idlogin;
        const _loginpost = login.loginpost;
        console.log("_idlogin :",_idlogin)
        console.log("_loginpost :",_loginpost)
        const _idagent = idagent;

        if(!isAvailable) return `Login **${_loginpost}** toujours en service merci de terminer le shift encours`;

        const insertProd = await addProd([_idagent,_idlogin]);
        const _idproduction = insertProd[0].insertId;
        console.log("_idproduction :",_idproduction)
        const _productiondetailsdate = moment().format('yyyy-MM-DD HH:mm:ss');
        const _idprod_action = 1;
        await addProdDetails([_productiondetailsdate,_idprod_action,_idproduction]);

        const cdrdetails = await fetchlastcdrbyloginpost(_loginpost)
        const _Resultopencdrid = cdrdetails[0].iddatingcdrdetails
        await addProdResult([_Resultopencdrid,null,_idproduction])

        return `Début shift agent **${_idagent}** :\n-Début : ${_productiondetailsdate}\n-login : ${_loginpost}`;
        // return `Début shift`;

    }catch (e) {
        console.log(e);
        return 'Erreur survenu';
    }
}

module.exports = {startProduction}