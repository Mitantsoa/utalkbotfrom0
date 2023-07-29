const {fetch,insert} = require('../service/mysql.js');

async function findtoken(id,appid){
    // const sql = 'SELECT * FROM `agent` where `agentdiscusername` = '+username+')';
    const sql = `SELECT interactiontoken FROM token WHERE interactionid = ${id} and applicationid = ${appid}`;
    const data = await fetch(sql);
    return data[0];
}

async function addtoken(value){

    const sql = 'INSERT INTO `token`(`interactionid`,`applicationid`,`interactiontoken`) VALUES (?,?,?)';
    return await insert(sql,value);
}
module.exports = {findtoken,addtoken}