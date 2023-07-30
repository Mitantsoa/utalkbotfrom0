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

/*
    === Add new producation
 */
async function addProd(value){
    const sql = 'INSERT INTO `producation`(`idagent`,`idlogin`) VALUES (?,?)';
    return await insert(sql,value);
}

async function addProdDetails(value){
    const sql = 'INSERT INTO `producationdetails`(`productiondetailsdate`,`idprod_action`,`idproduction`) VALUES (?,?,?)';
    return await insert(sql,value);
}

async function addProdResult(value){
    const sql = 'INSERT INTO `result`(`Resultopencdrid`,`Resultendcdrid`,`Production_idProduction`) VALUES (?,?,?)';
    return await insert(sql,value);
}

/*
    === check production not closed for login/discousername
 */
async function fetchopenproductionfromuserdisco(value){
    const sql = `select 
        p.idproduction
        from login as l 
        inner join production as p on (l.idlogin=p.idlogin) 
        inner join (
        select idproduction from productiondetails where idprod_action = 1
        ) as _s on (p.idproduction=_s.idproduction) 
        inner join (
        select idproduction from productiondetails where idprod_action <> 4 group by idproduction
        ) as _e on (p.idproduction=_e.idproduction) 
        where 
        l.logindiscousername = '${value}'`;
    return await fetch(sql,[value]);
}

/*
    === fetch cdr
 */
async function fetchlastcdrbyloginpost(loginpost){
    const sql = `select * from datingcdrdetails where datingcdrdetailssnapshotdate = (select max(datingcdrdetailssnapshotdate) from datingcdrdetails where datingcdrdetailslogin = '${loginpost}') and datingcdrdetailslogin = '${loginpost}'`;
    return await fetch(sql,[loginpost]);
    //data[0].iddatingcdrdetails
}


module.exports = {addProd,addProdDetails,fetchopenproductionfromuserdisco,addProdResult,fetchlastcdrbyloginpost}