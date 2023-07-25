const {fetch,insert} = require('../service/mysql.js');

async function findUser(username){
    // const sql = 'SELECT * FROM `agent` where `agentdiscusername` = '+username+')';
    const sql = 'SELECT * FROM `agent`)';
    return await fetch(sql);
}

async function adduser(value){
    const sql = 'INSERT INTO `agent` VALUES (?,?,?,?,?)';
    return await insert(sql,value);
}
module.exports = {findUser,adduser}