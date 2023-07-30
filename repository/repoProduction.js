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
    const sql = 'INSERT INTO `production`(`idagent`,`idlogin`) VALUES (?,?)';
    return await insert(sql,value);
}

async function addProdDetails(value){
    const sql = 'INSERT INTO `productiondetails`(`productiondetailsdate`,`idprod_action`,`idproduction`) VALUES (?,?,?)';
    return await insert(sql,value);
}

async function addProdResult(value){
    const sql = 'INSERT INTO `result`(`Resultopencdrid`,`Resultendcdrid`,`Production_idProduction`) VALUES (?,?,?)';
    return await insert(sql,value);
}

async function updateProdResult(value){
    const sql = 'UPDATE `result` SET `Resultendcdrid`= ? WHERE `Production_idProduction` = ?';
    return await insert(sql,value);
}

/*
    === check production not closed for login/discousername
 */
async function fetchopenproductionfromuserdisco(value){
    const sql = `select 
        p.idproduction,
        p.idagent,
        p.idlogin
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
    === check pause on production login/discousername
 */
async function fetchopenpauseproductionfromuserdisco(value){
    const sql = `select 
        p.idproduction,
        p.idagent,
        p.idlogin
        from login as l 
        inner join production as p on (l.idlogin=p.idlogin) 
        inner join (
        select idproduction from productiondetails where idprod_action = 1
        ) as _s on (p.idproduction=_s.idproduction) 
        inner join (
        select idproduction from productiondetails where idprod_action <> 2 group by idproduction
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

async function fetchresultatend(value){
    const sql = `select
        r.Production_idProduction as idProduction,
        case when r.Resultopencdrid is null then cdrend.datingcdrdetailscountcall else cdrend.datingcdrdetailscountcall - cdrst.datingcdrdetailscountcall end as countcall,
        case when r.Resultopencdrid is null then cdrend.datingcdrdetailscallduration else cdrend.datingcdrdetailscallduration - cdrst.datingcdrdetailscallduration end as durecall,
        case when r.Resultopencdrid is null then cdrend.datingcdrdetailscallacd else (cdrend.datingcdrdetailscallduration - cdrst.datingcdrdetailscallduration)/(cdrend.datingcdrdetailscountcall - cdrst.datingcdrdetailscountcall)*60 end as acdcall
        from
        result as r left join
        datingcdrdetails as cdrst on (r.Resultopencdrid=cdrst.iddatingcdrdetails)
        left join datingcdrdetails as cdrend on (r.Resultendcdrid=cdrend.iddatingcdrdetails)
        where r.Production_idProduction = ${value}`;
    const data = await fetch(sql,[value])
    return data[0];
}


module.exports = {addProd,addProdDetails,fetchopenproductionfromuserdisco,addProdResult,fetchlastcdrbyloginpost,updateProdResult,fetchresultatend,fetchopenpauseproductionfromuserdisco}