const mysql = require("mysql2");

const conexion = mysql.createConnection({  // Configuracion de la conexion
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    port:process.env.DB_PORT
});

conexion.connect((err) => {  //Levantar la conexion
    if (err) {
        console.log(err);
    } else { 
        console.log("Conectado a la base de datos");
    }
});

module.exports = conexion;










