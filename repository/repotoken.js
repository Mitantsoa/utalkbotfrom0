const {fetch,insert} = require('../service/mysql.js');

async function findtoken(id,appid){
    // const sql = 'SELECT * FROM `agent` where `agentdiscusername` = '+username+')';
    const sql = `SELECT interactiontoken FROM token WHERE interactionid = '${id}' and applicationid = '${appid}'`;
    console.log("find token sql:\n"+sql)
    const data = await fetch(sql);
    console.log("find token sql respon:\n"+data[0].toString())
    console.log("find token sql respon:\n"+data.toString())
    return data[0];
}

async function addtoken(value){

    const sql = 'INSERT INTO `token`(`interactionid`,`applicationid`,`interactiontoken`) VALUES (?,?,?)';
    console.log("add token sql:\n"+sql)
    return await insert(sql,value);
}
module.exports = {findtoken,addtoken}