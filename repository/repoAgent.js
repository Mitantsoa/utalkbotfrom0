const {fetch} = require('../service/mysql.js');

async function findUser(username){
    // const sql = 'SELECT * FROM `agent` where `agentdiscusername` = '+username+')';
    const sql = 'SELECT * FROM `agent`)';
    return await fetch(sql);
}

module.exports = {findUser}