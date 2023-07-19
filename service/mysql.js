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
    con.connect(function (err){
        if(err) throw err;
        logger("fetching data");
        con.query(sql, function (err, result) {
            if (err) throw err;
            return result;
        });
    })
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
    con.connect(function (err){
        if(err) throw err;
        const sql = "SELECT * FROM `datingcdrdetails`;";
        con.query(sql, function (err, result) {
            if (err) throw err;
            logger(result);
            return result;
        });
    })
}

module.exports = {fetch}
