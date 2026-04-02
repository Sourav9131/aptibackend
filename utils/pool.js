// const config = require("../config");
// const mysql = require("mysql2");
// const pool = mysql.createPool({
//   host: process.env.MYSQLHOST || config.mysqlHost,
//   user: process.env.MYSQLUSER || config.user,
//   password: process.env.PASSWORD || config.password, 
//   database: process.env.DATABASE || config.database,
//   port: process.env.MYSQLPORT|| config.PortNumber,
// });

// const promisePool = pool.promise();



// module.exports = promisePool;

const config = require("../config");
const mysql = require("mysql2");



const pool = mysql.createPool({
  host:
    process.env.MYSQLHOST ||
    process.env.mysqlHost ||
    config.mysqlHost ||
    "hopper.proxy.rlwy.net",
  user: process.env.MYSQLUSER || process.env.mysqlUser || config.user || "root",
  password:
    process.env.MYSQLPASSWORD ||
    process.env.PASSWORD ||
    config.password ||
    "XCACdoHjiUROXmidFrDXfqByfbBnOWpf",
  database:
    process.env.MYSQLDATABASE ||
    process.env.DATABASE ||
    config.database ||
    "railway",
  port: Number(
    process.env.MYSQLPORT ||
      process.env.PortNumber ||
      config.PortNumber ||
      29445
  ),
  waitForConnections: true,
  connectionLimit: 100, // This is the pool size, adjust as needed
  connectTimeout: 10000,
  // charset: 'utf8mb4' // for rupee symbol etc.
});


// Check for errors during the connection process
pool.getConnection((err, connection) => {
  if (err) {
    console.error('Error connecting to the database:', err);
  } else {
    console.log('Database Connected Successfully!');
    // Perform any necessary database operations here
    connection.release(); // Release the connection back to the pool
  }
});

const promisePool = pool.promise();

module.exports = promisePool;




// const pool = mysql.createPool({
//   host: '148.113.4.193', // or replace with the actual IP Cloudexter gives you
//   port: 3306,
//   user: 'aptitrad_admin',
//   password: 'Admin@123&123',
//   database: 'aptitrad_aptitrading',
// });

// const pool = mysql.createPool({
//   host: 'qaly.cbotvsv9e20s.ap-south-1.rds.amazonaws.com',
//   user: "qalydb",
//   password: 'qalydb',
//   database: 'qaly',
  
  
// }); 


// const pool = mysql.createPool({
//   host: '166.62.27.150',
//   user: "sahil",
//   password: "8wA*wnua12O)",
//   database: "ApurvaElectric",
//   port: 3306, 
  
// }); 
  
