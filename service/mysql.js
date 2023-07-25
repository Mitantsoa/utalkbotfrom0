const {config} = require('dotenv');
const Mysql = require('mysql2');
const {logger} = require("./utils");

config();

const con = Mysql.createConnection({
    host: process.env.DBIP,
    user: process.env.DBUSER,
    password: process.env.DBMDP,
    database: process.env.DBNAME,
    port:process.env.PORT
});
async function fetch(sql){
    try{
        let data = await con.promise().query(sql);
        return data[0]
    }catch (e) {
        throw e
    }

}

async function insert(sql,value){
    try{
        let data = await con.promise().query(sql,value);
        return data[0]
    }catch (e) {
        throw e
    }

}

async function createtable(data){
    con.connect(function (err){
        if(err) throw err;
        const sql = "CREATE TABLE `datingcdrdetails` (`iddatingcdrdetails` int(11) NOT NULL AUTO_INCREMENT,`datingcdrdetailslogin` varchar(45) DEFAULT NULL,`datingcdrdetailscountcall` int(11) DEFAULT NULL,`datingcdrdetailscallduration` decimal(10,0) DEFAULT NULL,`datingcdrdetailscallacd` decimal(10,0) DEFAULT NULL,`datingcdrdetailssnapshotdate` datetime DEFAULT NULL,PRIMARY KEY (`iddatingcdrdetails`)) ENGINE=InnoDB;";
        con.query(sql, function (err, result) {
            if (err) throw err;
            console.info("Table created");
            return true;
        });
    })
}

async function selectall(){
    const sql = "SELECT count(*) FROM `agent`;";
    let data = await con.promise().query(sql);
    return data[0]
}

module.exports = {fetch,insert}
