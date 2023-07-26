const {fetch,insert} = require('../service/mysql.js');

async function findUser(id){
    // const sql = 'SELECT * FROM `agent` where `agentdiscusername` = '+username+')';
    const sql = `SELECT * FROM Agent WHERE idAgent = ${id}`;
    return await fetch(sql);
}

async function adduser(value){
    const sql = 'INSERT INTO `Agent`(`Agentuid`,`Agentfirstname`,`Agentlastname`,`Agentadress`,`Agenttel`) VALUES (?,?,?,?,?)';
    return await insert(sql,value);
}
module.exports = {findUser,adduser}