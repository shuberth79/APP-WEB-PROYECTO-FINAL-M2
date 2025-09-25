const db = require("../database/db");


// ########################################## SAVE CONCIERTOS  
exports.save_concierto = (req, res) => {
    const concierto_id = req.body.concierto_id;
    const nombre_concierto = req.body.nombre_concierto;
    const locaciones = req.body.locaciones;
    const fecha = req.body.fecha;
    const hora = req.body.hora;
    const artista_id = req.body.artista_id;
    const escenario_id = req.body.escenario_id;
    const cuidad = req.body.cuidad;
    // console.log(nombre_concierto + " " + locaciones + " " + fecha + " " + hora);
    db.query(
        "INSERT INTO conciertos SET ?", //INSERTAR DATOS
        {
            concierto_id: concierto_id,
            nombre_concierto: nombre_concierto,
            locaciones: locaciones,
            fecha: fecha,
            hora: hora,
            artista_id: artista_id,
            escenario_id: escenario_id,
            cuidad: cuidad,
        },
        (error, results) => { //CAPTAR ERRORES Y MOSTRARLOS
            if (error) {
                console.log("❌ Error al ingresar:", error);
                res.redirect("/admin");
            } else {  // EN CASO DE NO HABER ERRORES, ENTREGAR DATOS
                console.log("✅ ingresado correctamente.");
                res.redirect("/admin");
            }
        }
    );
};


// ########################################## SAVE USUARIOS  
exports.save_usuario = (req, res) => {
    const usuario_id = req.body.usuario_id;
    const nombre = req.body.nombre;
    const rol = req.body.rol;
    const email = req.body.email;
    const pass = req.body.pass;
    const telefono = req.body.telefono;
    const direccion = req.body.direccion;
    // console.log(nombre + " " + rol + " " + email + " " + telefono + " " +  direccion);
    db.query(
        "INSERT INTO usuarios SET ?", //INSERTAR DATOS
        {
            usuario_id: usuario_id,
            nombre: nombre,
            rol: rol,
            email: email,
            pass: pass,
            telefono: telefono,
            direccion: direccion,
        },
        (error, results) => { //CAPTAR ERRORES Y MOSTRARLOS
            if (error) {
                console.log("❌ Error al ingresar:", error);
                res.redirect("/admin");
            } else {  // EN CASO DE NO HABER ERRORES, ENTREGAR DATOS
                console.log("✅ ingresado correctamente.");
                res.redirect("/admin");
            }
        }
    );
};

// ########################################## SAVE ARTISTA  
exports.save_artista = (req, res) => {
    const nombre = req.body.nombre;
    const genero_artistico = req.body.genero_artistico;
    const telefono = req.body.telefono;
    const ciudad = req.body.ciudad;
    // console.log(nombre + " " + rol + " " + email + " " + telefono + " " +  direccion);
    db.query(
        "INSERT INTO artistas SET ?", //INSERTAR DATOS
        {
            nombre: nombre,
            genero_artistico: genero_artistico,
            telefono: telefono,
            ciudad: ciudad,
        },
        (error, results) => { //CAPTAR ERRORES Y MOSTRARLOS
            if (error) {
                console.log("❌ Error al ingresar:", error);
                res.redirect("/admin");
            } else {  // EN CASO DE NO HABER ERRORES, ENTREGAR DATOS
                console.log("✅ ingresado correctamente.");
                res.redirect("/admin");
            }
        }
    );
};

// ########################################## SAVE ESCENARIOS  
exports.save_escenario = (req, res) => {
    const nombre = req.body.nombre;
    const ubicacion = req.body.ubicacion;
    const capacidad = req.body.capacidad;
    // console.log(nombre + " " + rol + " " + email + " " + telefono + " " +  direccion);
    db.query(
        "INSERT INTO escenarios SET ?", //INSERTAR DATOS
        {
            nombre: nombre,
            ubicacion: ubicacion,
            capacidad: capacidad,
        },
        (error, results) => { //CAPTAR ERRORES Y MOSTRARLOS
            if (error) {
                console.log("❌ Error al ingresar:", error);
                res.redirect("/admin");
            } else {  // EN CASO DE NO HABER ERRORES, ENTREGAR DATOS
                console.log("✅ ingresado correctamente.");
                res.redirect("/admin");
            }
        }
    );
};




// ######################################## U P D A T E - CONCIERTOS
exports.update_concierto = (req, res) => {
    console.log("Datos recibidos para guardar concierto:", req.body); // <-- Añade esto
    const concierto_id = req.body.concierto_id;
    const nombre_concierto = req.body.nombre_concierto;
    const locaciones = req.body.locaciones;
    const fecha = req.body.fecha;
    const ciudad = req.body.ciudad;
    const hora = req.body.hora;
    db.query(
        "UPDATE conciertos SET ? WHERE concierto_id = ?", [{   
            nombre_concierto: nombre_concierto,
            locaciones: locaciones,
            fecha: fecha,
            hora: hora,
            ciudad: ciudad,
        }
        , concierto_id,
    ],
        (error, results) => { // BUSCA ERRROES O RESULTADOS
            if (error) {
                console.log(error); //CAPTAR ERRORES Y MOSTRARLOS
                res.redirect("/admin");
            } else {  // EN CASO DE NO HABER ERRORES, ENTREGAR DATOS
                res.redirect("/admin");
            }
        }
    );
};


// ######################################## U P D A T E - USUARIOS
exports.update_usuario = (req, res) => {
    const usuario_id = req.body.usuario_id;
    const nombre = req.body.nombre;
    const rol = req.body.rol;
    const email = req.body.email;
    const telefono = req.body.telefono;
    const direccion = req.body.direccion;
    db.query(
        "UPDATE usuarios SET ? WHERE usuario_id = ?", [{   
            nombre: nombre,  //NO INCLUIMOS LA REFERENCIA POR SER "ID" DEL USUARIO
            rol: rol,
            email: email,
            telefono: telefono,
            direccion: direccion,
        }
        , usuario_id,
    ],
        (error, results) => { // BUSCA ERRROES O RESULTADOS
            if (error) {
                console.log(error); //CAPTAR ERRORES Y MOSTRARLOS
                res.redirect("/admin");
            } else {  // EN CASO DE NO HABER ERRORES, ENTREGAR DATOS
                res.redirect("/admin");
            }
        }
    );
};






// ######################################## U P D A T E - ESCENARIOS
exports.update_escenario = (req, res) => {
    const escenario_id = req.body.escenario_id;
    const nombre = req.body.nombre;
    const ubicacion = req.body.ubicacion;
    const capacidad = req.body.capacidad;
    db.query(
        "UPDATE escenarios SET ? WHERE escenario_id = ?", [{   
            nombre: nombre,  //NO INCLUIMOS LA REFERENCIA POR SER "ID" DEL CLIENTE
            ubicacion: ubicacion,
            capacidad: capacidad,
        }
        , escenario_id,
    ],
        (error, results) => { // BUSCA ERRROES O RESULTADOS
            if (error) {
                console.log(error); //CAPTAR ERRORES Y MOSTRARLOS
                res.redirect("/admin");
            } else {  // EN CASO DE NO HABER ERRORES, ENTREGAR DATOS
                res.redirect("/admin");
            }
        }
    );
};






// ######################################## U P D A T E - ARTISTA
exports.update_artista = (req, res) => {
    const artista_id = req.body.artista_id;
    const nombre = req.body.nombre;
    const genero_artistico = req.body.genero_artistico;
    const telefono = req.body.telefono;
    const ciudad = req.body.ciudad;
    const descripcion = req.body.descripcion;
    db.query(
        "UPDATE artistas SET ? WHERE artista_id = ?", [{   
            nombre: nombre,  //NO INCLUIMOS LA REFERENCIA POR SER "ID" DEL CLIENTE
            genero_artistico: genero_artistico,
            telefono: telefono,
            ciudad: ciudad,
            descripcion: descripcion,
        }
        , artista_id,
    ],
        (error, results) => { // BUSCA ERRROES O RESULTADOS
            if (error) {
                console.log(error); //CAPTAR ERRORES Y MOSTRARLOS
                res.redirect("/admin");
            } else {  // EN CASO DE NO HABER ERRORES, ENTREGAR DATOS
                res.redirect("/admin");
            }
        }
    );
};


















































