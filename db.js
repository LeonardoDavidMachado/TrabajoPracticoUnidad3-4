const mysql = require('mysql');
var util = require('util');
var db;
function connectDatabase () {
    if(!db) {
        db=  mysql.createConnection({
            host: 'localhost',
            user: 'root',
            password: '',
            database: 'bibliotecatp'
        });
        //No se pudo hacer andar la linea siguiente:
        //db = mysql.createConnection(settings);

        db.connect((error) => {
            if (error) {
                throw new Error("No se pudo conectar a la base de datos.");
            } else {
                console.log('Se estableció la conexión con la base de datos exitosamente.');
            }

        });
    }
    db.query =  util.promisify(db.query);
    return db;
};

module.exports = connectDatabase();
/*
const conexion = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'bibliotecatp'
});

conexion.connect((error) => {
    if (error) {
        throw error;
    }
    console.log('Se estableció la conexión con la base de datos exitosamente.');
});
*/