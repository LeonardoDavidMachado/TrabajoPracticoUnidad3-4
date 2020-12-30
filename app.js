const express = require('express');
const util = require('util');
const app = express();
const port = 3000;
app.use(express.json());

var conexion = require('./db');

const qy = util.promisify(conexion.query).bind(conexion);

app.post('/categoria', async (req, res) => {
    try {
        if (!req.body.nombre) {
            throw new Error('Error: falta el nombre de la categoría');
        }
        if (req.body.nombre.trim() == "") {
            throw new Error('Error: el nombre no debe ser solo espacios en blanco');
        }
        const nombre = req.body.nombre.toUpperCase();
        let query = 'SELECT categoria_id FROM categoria WHERE nombre = ?';
        let respuesta = await qy(query, [nombre]);
        if (respuesta.length > 0) {
            throw new Error('Error: esa categoria ya existe');
        }
        query = 'INSERT INTO categoria (nombre) VALUE (?)';
        respuesta = await qy(query, [nombre]);
        res.status(200).send({ 'respuesta': "id: " + respuesta.insertId + " nombre: " + nombre });
    }
    catch (e) {
        console.error(e.message);
        res.status(413).send({ "Error": e.message });
    }
});

app.get('/categoria', async (req, res) => {
    try {
        const query = 'SELECT * FROM categoria';
        const respuesta = await qy(query);
        res.status(200).send({ 'respuesta': respuesta });
    }
    catch (e) {
        console.error(e.message);
        res.status(413).send({ "Error": e.message });
    }
});

app.get('/categoria/:id', async (req, res) => {
    try {
        const query = 'SELECT * FROM categoria WHERE categoria_id = ?';
        const respuesta = await qy(query, [req.params.id]);
        console.log(respuesta);
        //res.status(200).send({ 'respuesta': "id: " + respuesta.insertId + " nombre: " + respuesta.nombre });
        res.status(200).send({ 'respuesta': respuesta });
    }
    catch (e) {
        console.error(e.message);
        res.status(413).send({ "Error": e.message });
    }
});

app.delete('/categoria/:id', async (req, res) => {
    try {
        let query = 'SELECT * FROM categoria WHERE categoria_id = ?';
        let respuesta = await qy(query, [req.params.id]);
        if (respuesta.length == 0) {
            throw new Error("No existe la categoría indicada");
        }
        let queryEnLibros = 'SELECT * FROM libro WHERE categoria_id = ?';
        let respuestaEnLibros = await qy(queryEnLibros, [req.params.id]);
        if (respuestaEnLibros.length > 0) {
            throw new Error("Esta categoria tiene libros asociados, no se puede borrar");
        }
        query = 'DELETE FROM categoria WHERE categoria_id = ?';
        respuesta = await qy(query, [req.params.id]);
        res.status(200).send({ 'respuesta': "Se borró correctamente" });
    }
    catch (e) {
        console.error(e.message);
        res.status(413).send({ "Error": e.message });
    }
});

app.post('/persona', async (req, res) => {
    try {
        verificoDatosDePersona(req);
        const nombre = req.body.nombre.toUpperCase();
        const apellido = req.body.apellido.toUpperCase();
        const alias = req.body.alias.toUpperCase();
        const email = req.body.email;
        query = 'SELECT * FROM persona WHERE email = ?';
        respuesta = await qy(query, [req.body.email]);
        if (respuesta.length > 0) {
            throw new Error("El e-mail ya está registrado");
        }
        query = 'INSERT INTO persona (nombre, apellido, alias, email) VALUES (?, ?, ?, ?)';
        respuesta = await qy(query, [nombre, apellido, alias, email]);
        res.status(200).send({ 'respuesta': "id: " + respuesta.insertId, nombre, apellido, alias, email });
    }
    catch (e) {
        console.error(e.message);
        res.status(413).send({ "Error": e.message });
    }
});

app.get('/persona', async (req, res) => {
    try {
        const query = 'SELECT * FROM persona';
        const respuesta = await qy(query);
        if (respuesta.length == 0) {
            throw new Error("No hay personas en la base de datos");
        }
        res.status(200).send({ 'respuesta': respuesta });
    }
    catch (e) {
        console.error(e.message);
        res.status(413).send({ "Error": e.message });
    }
});

app.get('/persona/:id', async (req, res) => {
    try {
        const query = 'SELECT * FROM persona WHERE persona_id = ?';
        const respuesta = await qy(query, [req.params.id]);
        if (respuesta.length == 0) {
            throw new Error("No se encuentra esa persona.");
        }
        res.status(200).send({ 'respuesta': respuesta });
    }
    catch (e) {
        console.error(e.message);
        res.status(413).send({ "Error": e.message });
    }
});

app.put('/persona/:id', async (req, res) => {
    try {
        verificoDatosDePersona(req);
        const nombre = req.body.nombre.toUpperCase();
        const apellido = req.body.apellido.toUpperCase();
        const alias = req.body.alias.toUpperCase();
        const email = req.body.email;
        let query = 'SELECT * FROM persona WHERE email = ?';
        let respuesta = await qy(query, [req.body.email]);
        if (respuesta.length == 0) {
            throw new Error('No se encuentra la persona asociada al email proporcionado.');
        }
        query = 'UPDATE persona SET nombre = ?, apellido = ?, alias = ? WHERE email = ?';
        respuesta = await qy(query, [nombre, apellido, alias, email]);
        res.status(200).send({ 'respuesta': nombre, apellido, alias, email });
    }
    catch (e) {
        console.error(e.message);
        res.status(413).send({ "Error": e.message });
    }
});

app.delete('/persona/:id', async (req, res) => {
    try {
        let query = 'SELECT * FROM persona WHERE persona_id = ?';
        let respuesta = await qy(query, [req.params.id]);
        if (respuesta.length == 0) {
            throw new Error("No existe esa persona");
        }
        let queryEnLibros = 'SELECT * FROM libro WHERE persona_id = ?';
        let respuestaEnLibros = await qy(queryEnLibros, [req.params.id]);
        if (respuestaEnLibros.length > 0) {
            throw new Error("Esta persona tiene libros asociados, no se puede borrar");
        }
        query = 'DELETE FROM persona WHERE persona_id = ?';
        respuesta = await qy(query, [req.params.id]);
        res.status(200).send({ 'respuesta': "Se borró correctamente" });

    }
    catch (e) {
        console.error(e.message);
        res.status(413).send({ "Error": e.message });
    }
});

function verificoDatosDePersona(req) {
    if (!req.body.nombre || !req.body.apellido || !req.body.alias || !req.body.email) {
        throw new Error("Faltan datos de la persona");
    }
    if (req.body.nombre.trim() == "") {
        throw new Error('Error: el nombre no debe ser solo espacios en blanco');
    }
    if (req.body.apellido.trim() == "") {
        throw new Error('Error: el apellido no debe ser solo espacios en blanco');
    }
    if (req.body.alias.trim() == "") {
        throw new Error('Error: el alias no debe ser solo espacios en blanco');
    }
    if (req.body.email.trim() == "") {
        throw new Error('Error: el email no debe ser solo espacios en blanco');
    }
};

/*
LIBRO

POST '/libro' recibe: {nombre:string, descripcion:string, categoria_id:numero, persona_id:numero/null} 
devuelve 200 y {id: numero, nombre:string, descripcion:string, categoria_id:numero, persona_id:numero/null}
o bien status 413,  {mensaje: <descripcion del error>} que puede ser "error inesperado", "ese libro ya existe",
"nombre y categoria son datos obligatorios", "no existe la categoria indicada", "no existe la persona indicada"

GET '/libro' devuelve 200 y [{id: numero, nombre:string, descripcion:string, categoria_id:numero, 
persona_id:numero/null}] o bien 413, {mensaje: <descripcion del error>} "error inesperado"

GET '/libro/:id' devuelve 200 {id: numero, nombre:string, descripcion:string, categoria_id:numero, 
persona_id:numero/null} y status 413, {mensaje: <descripcion del error>} "error inesperado",
"no se encuentra ese libro"

PUT '/libro/:id' y {id: numero, nombre:string, descripcion:string, categoria_id:numero, persona_id:numero/null}
devuelve status 200 y {id: numero, nombre:string, descripcion:string, categoria_id:numero, 
persona_id:numero/null} modificado o bien status 413, {mensaje: <descripcion del error>} "error inesperado",  
"solo se puede modificar la descripcion del libro

PUT '/libro/prestar/:id' y {id:numero, persona_id:numero} devuelve 200 y 
{mensaje: "se presto correctamente"} o bien status 413, {mensaje: <descripcion del error>} 
"error inesperado", "el libro ya se encuentra prestado, no se puede prestar hasta que no se devuelva", 
"no se encontro el libro", "no se encontro la persona a la que se quiere prestar el libro"

PUT '/libro/devolver/:id' y {} devuelve 200 y {mensaje: "se realizo la devolucion correctamente"} o 
bien status 413, {mensaje: <descripcion del error>} "error inesperado", "ese libro no estaba prestado!", 
"ese libro no existe"


DELETE '/libro/:id' devuelve 200 y {mensaje: "se borro correctamente"}  o bien status 413, 
{mensaje: <descripcion del error>} "error inesperado", "no se encuentra ese libro", 
"ese libro esta prestado no se puede borrar"
*/

app.listen(port, () => {
    console.log('Servidor escuchando en el puerto ', port);
});