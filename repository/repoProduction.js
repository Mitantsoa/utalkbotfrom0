const {fetch,insert} = require('../service/mysql.js');
const moment = require('moment')

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
        select idproduction from productiondetails where idprod_action <> 4 and idproduction not in (select idproduction from productiondetails where idprod_action = 4 group by idproduction) group by idproduction
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

/*
    === check production not closed for login/discousername
 */
async function fetchopenproduction(){
    const sql = `
        select
        idproduction,
        loginpost,
        open_proddate,
        end_proddate,
        Agentfirstname,
        Agentlastname,
        end_callnb - open_callnb as nbcall,
        end_callduration - open_callduration as callduration,
        (end_callduration - open_callduration) / (end_callnb - open_callnb) *60 as adc
        from
        (
        select
        p.idproduction,
        l.loginpost,
        ag.Agentfirstname,
        ag.Agentlastname,
        ifnull(cdropen.datingcdrdetailscountcall,0) as open_callnb,
        #case when r.Resultopencdrid is null then _s.productiondetailsdate else cdropen.datingcdrdetailssnapshotdate end as open_calldate,
        _s.productiondetailsdate open_proddate,
        cdr_last.datingcdrdetailssnapshotdate end_proddate,
        #case when cdrclose.iddatingcdrdetails is null then ifnull(cdr_last.datingcdrdetailscountcall,0) else cdrclose.datingcdrdetailscountcall end as end_callnb,
        ifnull(cdr_last.datingcdrdetailscountcall,0) as end_callnb,
        #case when r.Resultopencdrid is null then 0 else cdropen.datingcdrdetailscallduration end as open_callduration,
        ifnull(cdropen.datingcdrdetailscallduration,0) as open_callduration,
        #case when cdrclose.iddatingcdrdetails is null then ifnull(cdr_last.datingcdrdetailscallduration,0) else cdrclose.datingcdrdetailscallduration end as end_callduration,
        ifnull(cdr_last.datingcdrdetailscallduration,0) as end_callduration,
        ifnull(cdropen.datingcdrdetailssnapshotdate,'0') as open_calldate,
        ifnull(cdr_last.datingcdrdetailssnapshotdate,'0') as end_calldate
        #case when cdrclose.iddatingcdrdetails is null then ifnull(cdr_last.datingcdrdetailssnapshotdate,0) else cdrclose.datingcdrdetailssnapshotdate end as end_calldate
        from login as l
        inner join production as p on (l.idlogin=p.idlogin)
        inner join (
        select idproduction,productiondetailsdate from productiondetails where idprod_action = 1
        )as _s on (p.idproduction=_s.idproduction)
        inner join (
        select idproduction from productiondetails where idprod_action <> 4 and idproduction not in (select idproduction from productiondetails where idprod_action = 4 group by idproduction) group by idproduction
        ) as _e on (p.idproduction=_e.idproduction)
        inner join result r on (p.idproduction=r.Production_idProduction)
        inner join Agent ag on (p.idagent=ag.idagent)
        left join datingcdrdetails cdropen on (r.Resultopencdrid=cdropen.iddatingcdrdetails)
        left join (
        select _cdrdetails.* from datingcdrdetails _cdrdetails inner join (select max(datingcdrdetailssnapshotdate)date_,datingcdrdetailslogin from datingcdrdetails group by datingcdrdetailslogin,date_format(datingcdrdetailssnapshotdate,'%Y%m%d')) _lastlogin on (_cdrdetails.datingcdrdetailssnapshotdate=_lastlogin.date_ and _cdrdetails.datingcdrdetailslogin=_lastlogin.datingcdrdetailslogin)
        ) as cdr_last on (l.loginpost=cdr_last.datingcdrdetailslogin and cdr_last.datingcdrdetailssnapshotdate >= cdropen.datingcdrdetailssnapshotdate)
        ) m`;
    return await fetch(sql,[value]);
}

async function fetchdaycloseproduction(day){
    const sql = `
        select
        idproduction,
        loginpost,
        open_proddate,
        end_proddate,
        Agentfirstname,
        Agentlastname,
        end_callnb - open_callnb as nbcall,
        end_callduration - open_callduration as callduration,
        (end_callduration - open_callduration) / (end_callnb - open_callnb) *60 as adc
        from
        (
        select
        p.idproduction,
        l.loginpost,
        ag.Agentfirstname,
        ag.Agentlastname,
        ifnull(cdropen.datingcdrdetailscountcall,0) as open_callnb,
        _s.productiondetailsdate open_proddate,
        _e.productiondetailsdate end_proddate,
        ifnull(cdrclose.datingcdrdetailscountcall,0) as end_callnb,
        ifnull(cdropen.datingcdrdetailscallduration,0) as open_callduration,
        ifnull(cdrclose.datingcdrdetailscallduration,0) as end_callduration,
        ifnull(cdropen.datingcdrdetailssnapshotdate,'no cdr at start') as open_calldate,
        ifnull(cdrclose.datingcdrdetailssnapshotdate,'no cdr end') as end_calldate
        from login as l
        inner join production as p on (l.idlogin=p.idlogin)
        inner join (
        select idproduction,productiondetailsdate from productiondetails where idprod_action = 1 and date_format(productiondetailsdate,'%Y%m%d') = '${day}'
        )as _s on (p.idproduction=_s.idproduction)
        inner join (
        select idproduction,productiondetailsdate from productiondetails where idprod_action = 4 and date_format(productiondetailsdate,'%Y%m%d') = '${day}'
        ) as _e on (p.idproduction=_e.idproduction)
        inner join result r on (p.idproduction=r.Production_idProduction)
        inner join Agent ag on (p.idagent=ag.idagent)
        left join datingcdrdetails cdropen on (r.Resultopencdrid=cdropen.iddatingcdrdetails)
        left join datingcdrdetails cdrclose on (r.Resultendcdrid=cdrclose.iddatingcdrdetails)
        ) m`;
    return await fetch(sql,[]);
}

module.exports = {addProd,addProdDetails,fetchopenproductionfromuserdisco,addProdResult,fetchlastcdrbyloginpost,updateProdResult,fetchresultatend,fetchopenpauseproductionfromuserdisco,fetchdaycloseproduction,fetchopenproduction}