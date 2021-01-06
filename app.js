const express = require('express');
const util = require('util');
const cors = require('cors');
const helmet = require('helmet');
const app = express();
const port = 3000;
app.use(express.json());
app.use(helmet());
app.use(cors());
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
        const message = e.message ? e.message : "Error inesperado";
        console.error(message);
        res.status(413).send({ "Error": message });
    }
});

app.get('/categoria', async (req, res) => {
    try {
        const query = 'SELECT * FROM categoria';
        const respuesta = await qy(query);
        res.status(200).send({ 'respuesta': respuesta });
    }
    catch (e) {
        const message = e.message ? e.message : "Error inesperado";
        console.error(message);
        res.status(413).send({ "Error": message });
    }
});

app.get('/categoria/:id', async (req, res) => {
    try {
        const query = 'SELECT * FROM categoria WHERE categoria_id = ?';
        const respuesta = await qy(query, [req.params.id]);
        console.log(respuesta);
        
        res.status(200).send({ 'respuesta': respuesta });
    }
    catch (e) {
        const message = e.message ? e.message : "Error inesperado";
        console.error(message);
        res.status(413).send({ "Error": message });
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
        const message = e.message ? e.message : "Error inesperado";
        console.error(message);
        res.status(413).send({ "Error": message });
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
        const message = e.message ? e.message : "Error inesperado";
        console.error(message);
        res.status(413).send({ "Error": message });
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
        const message = e.message ? e.message : "Error inesperado";
        console.error(message);
        res.status(413).send({ "Error": message });
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
        const message = e.message ? e.message : "Error inesperado";
        console.error(message);
        res.status(413).send({ "Error": message });
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
        const message = e.message ? e.message : "Error inesperado";
        console.error(message);
        res.status(413).send({ "Error": message });
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
        const message = e.message ? e.message : "Error inesperado";
        console.error(message);
        res.status(413).send({ "Error": message });
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

app.post('/libro', async (req, res) => {
    try {
        verificoDatosDeLibro(req);
        const nombre = req.body.nombre.toUpperCase();
        const descripcion = req.body.descripcion.toUpperCase();
        const categoria_id = req.body.categoria_id;
        let persona_id = req.body.persona_id;

        let query = 'SELECT * FROM libro WHERE nombre = ?';
        let respuesta = await qy(query, [req.body.nombre]);
        if (respuesta.length > 0) {
            throw new Error("El libro ya existe");
        }
        query = 'SELECT * FROM categoria WHERE categoria_id = ?';
        respuesta = await qy(query,[categoria_id]);
        if(respuesta.length == 0) {
            throw new Error("La categoria no existe");
        }
        if(persona_id == "NULL") {
            query = 'INSERT INTO libro (nombre, descripcion, categoria_id,persona_id) VALUES (?, ?, ?, NULL)';
            respuesta = await qy(query, [nombre, descripcion, categoria_id,persona_id]);
        } else {
            query = 'SELECT * FROM persona WHERE persona_id = ?';
            respuesta = await qy(query,[persona_id]);
            if(respuesta.length == 0) {
                throw new Error ("La persona no existe");
            }
            query = 'INSERT INTO libro (nombre, descripcion, categoria_id, persona_id) VALUES (?, ?, ?, ?)';
            respuesta = await qy(query, [nombre, descripcion, categoria_id, persona_id]);
        }
        res.status(200).send({ 'respuesta': nombre, descripcion, categoria_id, persona_id });
    }
    catch (e) {
        const message = e.message ? e.message : "Error inesperado";
        console.error(message);
        res.status(413).send({ "Error": message });
    }
});

app.get('/libro', async (req, res) => {
    try {
        const query = 'SELECT * FROM libro';
        const respuesta = await qy(query);
        if (respuesta.length == 0) {
            throw new Error("No hay libros en la base de datos");
        }
        res.status(200).send({ 'respuesta': respuesta });
    }
    catch (e) {
        const message = e.message ? e.message : "Error inesperado";
        console.error(message);
        res.status(413).send({ "Error": message });
    }
});

app.get('/libro/:id', async (req, res) => {
    try {
        const query = 'SELECT * FROM libro WHERE libro_id = ?';
        const respuesta = await qy(query, [req.params.id]);
        if (respuesta.length == 0) {
            throw new Error("No se encuentra ese libro.");
        }
        res.status(200).send({ 'respuesta': respuesta });
    }
    catch (e) {
        const message = e.message ? e.message : "Error inesperado";
        console.error(message);
        res.status(413).send({ "Error": message });
    }
});

app.put('/libro/:id', async (req, res) => {
    try {
        verificoDatosDeLibro(req);
        const nombre = req.body.nombre.toUpperCase();
        const descripcion = req.body.descripcion.toUpperCase();
        const categoria_id = req.body.categoria_id;
        let libro_id = req.params.id;
        let persona_id = req.body.persona_id;
        let query = 'SELECT * FROM libro WHERE libro_id = ?';
        let respuesta = await qy(query, [req.params.id]);
        if (respuesta.length == 0) {
            throw new Error('No se encuentra el libro proporcionado.');
        }
        query = 'UPDATE libro SET nombre = ?, descripcion = ?, categoria_id = ?, persona_id = ? WHERE libro_id = ?';
        respuesta = await qy(query, [nombre, descripcion,categoria_id,persona_id,libro_id]);
        res.status(200).send({ 'respuesta': nombre, descripcion,categoria_id,persona_id,libro_id });
    }
    catch (e) {
        const message = e.message ? e.message : "Error inesperado";
        console.error(message);
        res.status(413).send({ "Error": message });
    }
});

app.put('/libro/prestar/:id', async (req, res) => {
    try {
        let libro_id = req.params.id;
        let persona_id = req.body.persona_id;
        let query = 'SELECT * FROM libro WHERE libro_id = ?';
        let respuesta = await qy(query, [req.params.id]);
        if (respuesta.length == 0) {
            throw new Error('No se encuentra el libro proporcionado.');
        }
        query = 'SELECT * FROM libro WHERE persona_id IS NULL AND libro_id = ?';
        respuesta = await qy(query,[libro_id]);
        if(respuesta.length == 0) {
            throw new Error("El libro ya se encuentra prestado");
        }
        query = 'SELECT * FROM persona WHERE persona_id = ?';
        respuesta = await qy(query, [persona_id]);
        if(respuesta.length == 0) {
            throw new Error("No se encontró la persona a la que se quiere prestar el libro.");
        }
        query = 'UPDATE libro SET persona_id = ? WHERE libro_id = ?';
        respuesta = await qy(query, [persona_id,libro_id]);
        res.status(200).send("Se prestó correctamente");
    }
    catch (e) {
        const message = e.message ? e.message : "Error inesperado";
        console.error(message);
        res.status(413).send({ "Error": message });
    }
});


app.put('/libro/devolver/:id', async (req, res) => {
    try {
        let query = 'SELECT * FROM libro WHERE libro_id = ?';
        let respuesta = await qy(query, [req.params.id]);
        if (respuesta.length == 0) {
            throw new Error('Ese libro no existe.');
        }
        query = 'SELECT * FROM libro WHERE persona_id IS NULL AND libro_id = ?';
        respuesta = await qy(query,[req.params.id]);
        if(respuesta.length > 0) {
            throw new Error("El libro no está prestado");
        }
        query = 'UPDATE libro SET persona_id = NULL WHERE libro_id = ?';
        respuesta = await qy(query, [req.params.id]);
        res.status(200).send("Se devolvió correctamente");
    }
    catch (e) {
        const message = e.message ? e.message : "Error inesperado";
        console.error(message);
        res.status(413).send({ "Error": message });
    }
});

app.delete('/libro/:id', async (req, res) => {
    try {
        let query = 'SELECT * FROM libro WHERE libro_id = ?';
        let respuesta = await qy(query, [req.params.id]);
        if (respuesta.length == 0) {
            throw new Error("No existe este libro");
        }
        if(typeof respuesta.persona_id === 'number') {
            throw new Error ("Este libro esta prestado, no se puede borrar.");
        }
        query = 'DELETE FROM libro WHERE libro_id = ?';
        respuesta = await qy(query, [req.params.id]);
        res.status(200).send({ 'respuesta': "Se borró correctamente" });

    }
    catch (e) {
        const message = e.message ? e.message : "Error inesperado";
        console.error(message);
        res.status(413).send({ "Error": message });
    }
});

function verificoDatosDeLibro(req) {
    if (!req.body.nombre || !req.body.categoria_id) {
        throw new Error("Nombre y categoría son obligatorios");
    }
    if (req.body.nombre.trim() == "") {
        throw new Error('Error: el nombre no debe ser solo espacios en blanco');
    } 

};

app.listen(port, () => {
    console.log('Servidor escuchando en el puerto ', port +' y con seguridad proporcionada por helmet.');
});