const {fetch,insert} = require('../service/mysql.js');

async function findUser(id){
    // const sql = 'SELECT * FROM `agent` where `agentdiscusername` = '+username+')';
    const sql = `SELECT * FROM login WHERE idlogin = ${id}`;
    const data = await fetch(sql);
    return data[0];
}

async function findLoginByLogin(id){
    // const sql = 'SELECT * FROM `agent` where `agentdiscusername` = '+username+')';
    const sql = `SELECT * FROM login WHERE loginpost = ${id}`;
    const data = await fetch(sql);
    return data[0];
}

async function findLoginByDiscouser(id){
    // const sql = 'SELECT * FROM `agent` where `agentdiscusername` = '+username+')';
    const sql = `SELECT * FROM login WHERE logindiscousername = '${id}'`;
    const data = await fetch(sql);
    return data[0];
}

async function adduser(value){
    const sql = 'INSERT INTO `login`(`loginpost`,`logindiscousername`) VALUES (?,?)';
    return await insert(sql,value);
}
module.exports = {findUser,adduser,findLoginByLogin,findLoginByDiscouser}