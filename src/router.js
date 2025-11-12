//9 ###################################### L I B R E R I A S   (FIJO) 
const express = require("express");
const router = express(); 
const bcrypt = require("bcryptjs");
const db = require("../database/db");
const { body, validationResult } = require("express-validator");
const crud = require ("../src/controllers");
const transporter = require("../config/email"); 
// const mysql = require('mysql2/promise');
const mysql = require('mysql2'); // SI FUNCIONA CON PROMISE, ESTO SE DEBE BORRAR


//9.4 ############################################  VISTA INICIO 
router.get("/", (req, res) => {
    if (req.session.loggedin) {
        res.render("index", {
            user: req.session.name,
            login: true,
        });
    } else {
        res.render("index", {
            user: "Debe iniciar sesión",
            login: false,
        });
    }
});

// ########################################  VISTA LOGIN
router.get("/login", (req, res) => {
    if (req.session.loggedin) {
        res.render("login", {
            login: true,
        });
    } else {
        res.render("login", {
            login: false,
        });
    }
});


// ######################################## VISTA REGISTRO
router.get("/registro", (req, res) => {
    if (req.session.loggedin) {
        res.render("register", {
            login: true,
        });
    } else {
        res.render("register", {
            login: false,
        });
    }
});

// ########################################################
// ########################################################
// ########################################################

// ######################################## VISTA ADMIN DASHBOARD 
// router.get("/admin", async (req, res) => {
//     if (req.session.loggedin && req.session.rol === "admin") {
//         try {
//             const [usuarios] = await db.query("SELECT * FROM usuarios");
//             const [conciertos] = await db.query("SELECT * FROM conciertos");
//             const [artistas] = await db.query("SELECT * FROM artistas");
//             const [escenarios] = await db.query("SELECT * FROM escenarios");

//             res.render("admin_dashboard", {
//                 usuarios: usuarios,
//                 conciertos: conciertos,
//                 artistas: artistas,
//                 escenarios: escenarios,
//                 login: true,
//                 rol: req.session.rol,
//             });
//         } catch (error) {
//             console.error("Error al obtener datos para el dashboard:", error);
//             res.render("admin_dashboard", {
//                 usuarios: [],
//                 conciertos: [],
//                 artistas: [],
//                 escenarios: [],
//                 login: true,
//                 rol: req.session.rol,
//                 error_message: "Error al cargar los datos."
//             });
//         }
//     } else {
//         res.render("login", {
//             alert: true,
//             alertTitle: "Acceso denegado",
//             alertMessage: "Necesitas ser administrador para acceder a esta sección.",
//             alertIcon: "error",
//             showConfirmButton: true,
//             timer: false,
//             ruta: "login"
//         });
//     }
// });



// ##################### VISTA ADMIN DASHBOARD DE RESPALDO HASTA SOLUCIONAR LAS CONEXIONES AL CREAR Y EDITAR
router.get("/admin", (req, res) => {
    if (req.session.loggedin && req.session.rol === "admin") { // Aseguramos que solo admin pueda ver esto
        // Realizar múltiples consultas a la base de datos
        Promise.all([
            new Promise((resolve, reject) => {
                db.query("SELECT * FROM usuarios", (error, results) => {
                    if (error) return reject(error);
                    console.log("hay un error", error)
                    resolve(results);
                });
            }),
            new Promise((resolve, reject) => {
                db.query("SELECT * FROM conciertos", (error, results) => {
                    if (error) return reject(error);
                    console.log("hay un error", error)
                    resolve(results);
                });
            }),
            new Promise((resolve, reject) => {
                db.query("SELECT * FROM artistas", (error, results) => {
                    if (error) return reject(error);
                    resolve(results);
                });
            }),
            new Promise((resolve, reject) => {
                db.query(`SELECT * FROM escenarios`,
                    (error, results) => { // Asegúrate que esta sea la columna ID correcta en tu tabla clientes
                    if (error) return reject(error);
                    resolve(results);
                });
            })
        ])
        .then(([usuarios, conciertos, artistas, escenarios]) => {
            res.render("admin_dashboard", { // Renderiza la nueva vista
                usuarios: usuarios,
                conciertos: conciertos,
                artistas: artistas,
                escenarios: escenarios,
                login: true,
                rol: req.session.rol,
            });
        })
        .catch(error => {
            console.error("Error al obtener datos para el dashboard:", error);
            res.render("admin_dashboard", { // Renderiza con datos vacíos o un mensaje de error
                usuarios: [],
                conciertos: [],
                artistas: [],
                escenarios: [],
                login: true,
                rol: req.session.rol,
                error_message: "Error al cargar los datos." // Puedes pasar un mensaje de error
            });
        });
    } else {
        // Redirige si no está logueado o no es admin
        res.render("login", {
            alert: true,
            alertTitle: "Acceso denegado",
            alertMessage: "Necesitas ser administrador para acceder a esta sección.",
            alertIcon: "error",
            showConfirmButton: true,
            timer: false,
            ruta: "login"
        });
    }
});



// ######################################## USUARIOS DASHBOARD 1,  ANTES DE REVISION DE ROL (admin/user), 
// router.get("/usuario_dashboard", (req, res) => {
//     if (req.session.loggedin && req.session.rol === "user") {
//         const usuarioId = req.session.usuario_id;

//         Promise.all([
//             new Promise((resolve, reject) => {
//                 db.query("SELECT * FROM usuarios WHERE usuario_id = ?", [usuarioId], (error, results) => {
//                     if (error) return reject(error);
//                     resolve(results[0]);
//                 });
//             }),
//             new Promise((resolve, reject) => {
//                 db.query("SELECT * FROM conciertos", (error, results) => {
//                     if (error) return reject(error);
//                     resolve(results);
//                 });
//             }),
//             new Promise((resolve, reject) => {
//                 db.query(
//                     `SELECT c.* 
//                      FROM usuario_conciertos uc 
//                      JOIN conciertos c ON uc.concierto_id = c.concierto_id 
//                      WHERE uc.usuario_id = ?`,
//                     [usuarioId],
//                     (error, results) => {
//                         if (error) return reject(error);
//                         resolve(results);
//                     }
//                 );
//             })
//         ])
//         .then(([usuario, conciertos, misConciertos]) => {
//             res.render("usuario_dashboard", {
//                 usuario,
//                 conciertos,
//                 misConciertos,
//                 login: true,
//                 rol: req.session.rol,
//             });
//         })
//         .catch(error => {
//             console.error("Error al obtener datos para el dashboard de usuario:", error);
//             res.render("usuario_dashboard", {
//                 usuario: null,
//                 conciertos: [],
//                 misConciertos: [],
//                 login: true,
//                 rol: req.session.rol,
//                 error_message: "Error al cargar los datos."
//             });
//         });
//     } else {
//         res.redirect("/login");
//     }
// });



// ######################################## USUARIOS DASHBOARD 
// router.get("/usuario_dashboard", (req, res) => {
//     if (req.session.loggedin && req.session.rol === "user") { // CORREGIDO: rol "user"
//         const usuarioId = req.session.usuario_id;
//         Promise.all([
//             new Promise((resolve, reject) => {
//                 db.query("SELECT * FROM usuarios WHERE usuario_id = ?", [usuarioId], (error, results) => {
//                     if (error) return reject(error);
//                     resolve(results[0]); // Un solo usuario
//                 });
//             }),
//             new Promise((resolve, reject) => {
//                 db.query("SELECT * FROM conciertos", (error, results) => {
//                     if (error) return reject(error);
//                     resolve(results);
//                 });
//             })
//         ])
//         .then(([usuario, conciertos]) => {
//             res.render("usuario_dashboard", {
//                 usuario: usuario, // ✅ Ahora sí llega a EJS
//                 conciertos: conciertos,
//                 login: true,
//                 rol: req.session.rol,
//             });
//         })
//         .catch(error => {
//             console.error("Error al obtener datos para el dashboard de usuario:", error);
//             res.render("usuario_dashboard", {
//                 usuario: null,
//                 conciertos: [],
//                 login: true,
//                 rol: req.session.rol,
//                 error_message: "Error al cargar los datos."
//             });
//         });
//     } else {
//         res.redirect("/login");
//     }
// });



// ######################################## USUARIOS DASHBOARD
// router.get("/usuario_dashboard", async (req, res) => {
//     if (req.session.loggedin && req.session.rol === "user") {
//         const usuarioId = req.session.usuario_id;
//         try {
//             const [usuarioResults] = await db.query("SELECT * FROM usuarios WHERE usuario_id = ?", [usuarioId]);
//             if (usuarioResults.length === 0) {
//                 return res.render("usuario_dashboard", {
//                     usuario: null,
//                     conciertos: [],
//                     misConciertos: [],
//                     login: true,
//                     rol: req.session.rol
//                 });
//             }
//             const usuario = usuarioResults[0];
//             const [conciertosResults] = await db.query("SELECT * FROM conciertos");
//             const [misConciertosResults] = await db.query(
//                 `SELECT c.* FROM usuario_conciertos uc 
//                  JOIN conciertos c ON uc.concierto_id = c.concierto_id 
//                  WHERE uc.usuario_id = ?`,
//                 [usuarioId]
//             );
//             res.render("usuario_dashboard", {
//                 usuario,
//                 conciertos: conciertosResults,
//                 misConciertos: misConciertosResults,
//                 login: true,
//                 rol: req.session.rol
//             });
//         } catch (err) {
//             console.error("Error al obtener datos para el dashboard de usuario:", err);
//             res.render("usuario_dashboard", {
//                 usuario: null,
//                 conciertos: [],
//                 misConciertos: [],
//                 login: true,
//                 rol: req.session.rol,
//                 error_message: "Error al cargar los datos."
//             });
//         }
//     } else {
//         res.redirect("/login");
//     }
// });




// ######################################## VISTA USUARIO DASHBOARD DE RESPALDO HASTA SOLUCIONAR LAS CONEXIONES AL CREAR Y EDITAR
router.get("/usuario_dashboard", (req, res) => {
    if (req.session.loggedin && req.session.rol === "user") {
        const usuarioId = req.session.usuario_id;
        // Traer usuario de la BD
        db.query("SELECT * FROM usuarios WHERE usuario_id = ?", [usuarioId], (err, usuarioResults) => {
            if (err || usuarioResults.length === 0) {
                console.error("Error obteniendo usuario:", err);
                return res.render("usuario_dashboard", {
                    usuario: null,
                    conciertos: [],
                    misConciertos: [],
                    login: true,
                    rol: req.session.rol
                });
            }
            const usuario = usuarioResults[0];
            // Traer todos los conciertos
            db.query("SELECT * FROM conciertos", (err2, conciertosResults) => {
                if (err2) {
                    console.error("Error obteniendo conciertos:", err2);
                    return res.render("usuario_dashboard", { usuario, conciertos: [], misConciertos: [], login: true, rol: req.session.rol });
                }
                // Traer conciertos del usuario
                db.query(
                    `SELECT c.* 
                     FROM usuario_conciertos uc 
                     JOIN conciertos c ON uc.concierto_id = c.concierto_id 
                     WHERE uc.usuario_id = ?`,
                    [usuarioId],
                    (err3, misConciertosResults) => {
                        if (err3) {
                            console.error("Error obteniendo mis conciertos:", err3);
                            return res.render("usuario_dashboard", { usuario, conciertos: conciertosResults, misConciertos: [], login: true, rol: req.session.rol });
                        }
                        // 👇 Ahora sí mandamos todo a la vista
                        res.render("usuario_dashboard", {
                            usuario,
                            conciertos: conciertosResults,
                            misConciertos: misConciertosResults,
                            login: true,
                            rol: req.session.rol
                        });
                    }
                );
            });
        });
    } else {
        res.redirect("/login");
    }
});




// ######################################## CANCELAR CONCIERTO 2, 3 DESPUES DE REVISION DE ROL (admin/user), 
// 📌 Cancelar inscripción
router.post("/cancelar_concierto", (req, res) => {
    if (!req.session.loggedin || req.session.rol !== "user") {
        return res.redirect("/login");
    }
    const { usuario_id, concierto_id } = req.body;
    // obtener datos ANTES de borrar
    db.query(
        `SELECT u.nombre, u.email, c.nombre_concierto, c.fecha, c.ciudad 
         FROM usuarios u, conciertos c
         WHERE u.usuario_id = ? AND c.concierto_id = ?`,
        [usuario_id, concierto_id],
        (err, data) => {
            if (err || data.length === 0) {
                console.error("Error obteniendo datos:", err);
                return res.redirect("/usuario_dashboard");
            }
            const { nombre, email, nombre_concierto, fecha, ciudad } = data[0];
            // eliminar inscripción
            db.query(
                "DELETE FROM usuario_conciertos WHERE usuario_id = ? AND concierto_id = ?",
                [usuario_id, concierto_id],
                (error) => {
                    if (error) {
                        console.error("Error al cancelar inscripción:", error);
                        return res.redirect("/usuario_dashboard");
                    }
                    // enviar correo de cancelación
                    const mailOptions = {
                        from: process.env.EMAIL_USER,
                        to: email,
                        subject: "Cancelación de inscripción ❌",
                        html: `
                            <h2>Hola ${nombre}</h2>
                            <p>Has cancelado tu inscripción al concierto:</p>
                            <ul>
                                <li><b>Nombre:</b> ${nombre_concierto}</li>
                                <li><b>Fecha:</b> ${fecha}</li>
                                <li><b>Ciudad:</b> ${ciudad}</li>
                            </ul>
                            <p>Lamentamos que no puedas asistir. ¡Te esperamos en futuros eventos!</p>
                        `
                    };
                    transporter.sendMail(mailOptions, (mailErr) => {
                        if (mailErr) console.error("Error enviando correo:", mailErr);
                        res.redirect("/usuario_dashboard");
                    });
                }
            );
        }
    );
});




// ######################################## INSCRIPCION CONCIERTO 2,  DESPUES DE REVISION DE ROL (admin/user), 
// 📌 Inscripción a un concierto
router.post("/inscribir_concierto", (req, res) => {
    if (!req.session.loggedin || req.session.rol !== "user") {
        return res.redirect("/login");
    }
    const { usuario_id, concierto_id } = req.body;
    db.query(
        "INSERT INTO usuario_conciertos (usuario_id, concierto_id) VALUES (?, ?)",
        [usuario_id, concierto_id],
        (error) => {
            if (error) {
                console.error("Error al inscribir usuario:", error);
                return res.redirect("/usuario_dashboard");
            }
            // obtener datos usuario + concierto
            db.query(
                `SELECT u.nombre, u.email, c.nombre_concierto, c.fecha, c.ciudad 
                 FROM usuarios u, conciertos c
                 WHERE u.usuario_id = ? AND c.concierto_id = ?`,
                [usuario_id, concierto_id],
                (err, data) => {
                    if (err || data.length === 0) {
                        console.error("Error obteniendo datos:", err);
                        return res.redirect("/usuario_dashboard");
                    }
                    const { nombre, email, nombre_concierto, fecha, ciudad } = data[0];
                    const mailOptions = {
                        from: process.env.EMAIL_USER,
                        to: email,
                        subject: "Confirmación de inscripción a concierto 🎶",
                        html: `
                            <h2>¡Hola ${nombre}!</h2>
                            <p>Te has inscrito correctamente al concierto:</p>
                            <ul>
                                <li><b>Nombre:</b> ${nombre_concierto}</li>
                                <li><b>Fecha:</b> ${fecha}</li>
                                <li><b>Ciudad:</b> ${ciudad}</li>
                            </ul>
                            <p>¡Nos vemos en el evento!</p>
                        `
                    };
                    transporter.sendMail(mailOptions, (mailErr) => {
                        if (mailErr) console.error("Error enviando correo:", mailErr);
                        res.redirect("/usuario_dashboard");
                    });
                }
            );
        }
    );
});



// // ######################################## DELETE CONCIERTOS - RESPALDO PARA SOLUCIONAR CREAR - EDITAR - ELIMANR
// router.post("/delete_concierto", (req, res) => {
//     // Asegurarse de que el usuario sea administrador antes de permitir la eliminación
//     if (!req.session.loggedin || req.session.rol !== "admin") {
//         return res.redirect("/"); // O redirigir a una página de error de acceso
//     }
//     const concierto_id = req.body.concierto_id; // <-- Obtener de req.body
//     db.query(
//         "DELETE FROM usuario_conciertos WHERE concierto_id = ?",
//         [concierto_id],
//         (error, results) => {
//             if (error) {
//                 console.error("Error al eliminar concierto:", error);
//                 // Aquí podrías añadir un mensaje de error en la sesión o pasarlo a la vista
//                 res.redirect("/admin");
//             } else {
//                 res.redirect("/admin");
//             }
//         }
//     );
// });



// ######################################## DELETE CONCIERTOS - ALTERNATIVA PARA SOLUCIONAR CREAR - EDITAR - ELIMANR
router.post("/delete_concierto", (req, res) => {
    // Asegurarse de que el usuario sea administrador antes de permitir la eliminación
    if (!req.session.loggedin || req.session.rol !== "admin") {
        return res.redirect("/");
    }
    const concierto_id = req.body.concierto_id;
    // First, delete from the child table (usuario_conciertos)
    db.query(
        "DELETE FROM usuario_conciertos WHERE concierto_id = ?",
        [concierto_id],
        (error, results) => {
            if (error) {
                console.error("Error al eliminar registros de usuario_conciertos:", error);
                return res.redirect("/admin");
            }
            // If the first deletion was successful, proceed to delete from the parent table (conciertos)
            db.query(
                "DELETE FROM conciertos WHERE concierto_id = ?",
                [concierto_id],
                (error, results) => {
                    if (error) {
                        console.error("Error al eliminar concierto:", error);
                        return res.redirect("/admin");
                    }
                    console.log("Concierto y sus registros asociados eliminados con éxito.");
                    res.redirect("/admin");
                }
            );
        }
    );
});











// ######################################## DELETE USUARIOS (POST)
router.post("/delete_usuario", (req, res) => {
    // Asegurarse de que el usuario sea administrador antes de permitir la eliminación
    if (!req.session.loggedin || req.session.rol !== "admin") {
        return res.redirect("/");
    }
    const usuario_id = req.body.usuario_id; // <-- Obtener de req.body
    db.query(
        "DELETE FROM usuarios WHERE usuario_id = ?",
        [usuario_id],
        (error, results) => {
            if (error) {
                console.error("Error al eliminar usuario:", error);
                res.redirect("/admin"); // Redirigir al dashboard general
            } else {
                res.redirect("/admin"); // Redirigir al dashboard general
            }
        }
    );
});



// ######################################## DELETE ESCENARIOS (POST)
router.post("/delete_escenario", (req, res) => {
    // Asegurarse de que el usuario sea administrador antes de permitir la eliminación
    if (!req.session.loggedin || req.session.rol !== "admin") {
        return res.redirect("/");
    }
    const escenario_id = req.body.escenario_id; // <-- Obtener de req.body
    db.query(
        "DELETE FROM escenarios WHERE escenario_id = ?",
        [escenario_id],
        (error, results) => {
            if (error) {
                console.error("Error al eliminar escenario:", error);
                res.redirect("/admin"); // Redirigir al dashboard general
            } else {
                res.redirect("/admin"); // Redirigir al dashboard general
            }
        }
    );
});



// ######################################## DELETE ARTISTAS (POST)
router.post("/delete_artista", (req, res) => {
    // Asegurarse de que el usuario sea administrador antes de permitir la eliminación
    if (!req.session.loggedin || req.session.rol !== "admin") {
        return res.redirect("/");
    }
    const artista_id = req.body.artista_id; // <-- Obtener de req.body
    db.query(
        "DELETE FROM artistas WHERE artista_id = ?",
        [artista_id],
        (error, results) => {
            if (error) {
                console.error("Error al eliminar artista:", error);
                res.redirect("/admin"); // Redirigir al dashboard general
            } else {
                res.redirect("/admin"); // Redirigir al dashboard general
            }
        }
    );
});



// ######################################## CREATE CONCIERTOS
router.get("/create_conciertoX", (req, res) => {
    if (req.session.loggedin) {
        res.render("create_conciertoX", {
            login: true,
        });
    } else {
        res.redirect("/")
    }
});



// ######################################## CREATE USUARIO
router.get("/create_usuario", (req, res) => {
    if (req.session.loggedin) {
        res.render("create_usuario", {
            login: true,
        });
    } else {
        res.redirect("/")
    }
});




// ######################################## CREATE ESCENARIO
router.get("/create_escenario", (req, res) => {
    if (req.session.loggedin) {
        res.render("create_escenario", {
            login: true,
        });
    } else {
        res.redirect("/")
    }
});



// ######################################## CREATE ARTISTA
router.get("/create_artista", (req, res) => {
    if (req.session.loggedin) {
        res.render("create_artista", {
            login: true,
        });
    } else {
        res.redirect("/")
    }
});



// ######################################## EDIT CONCIERTOS
router.get("/edit_concierto/:concierto_id", (req, res) => {
    if (req.session.loggedin) {
        const concierto_id = req.params.concierto_id;
        db.query(
            "SELECT * FROM conciertos WHERE concierto_id = ?", [concierto_id], (error, results) => { 
                if (error) {
                    throw error; // EN CASO DE HABER ERRORES MOSTRARNOS
                } else {
                    res.render("edit_concierto", {  // EN CASO DE NO HABER ERRORES LLEVARNOS A VISTA ADMIN
                        concierto: results[0],
                        login: true,
                    });
                }
            }  
        );
    } else {
        res.redirect("/");
    }
})



// ######################################## EDIT USUARIOS
router.get("/edit_usuario/:usuario_id", (req, res) => {
    if (req.session.loggedin) {
        const usuario_id = req.params.usuario_id;
        db.query(
            "SELECT * FROM usuarios WHERE usuario_id = ?", [usuario_id], (error, results) => { 
                if (error) {
                    throw error; // EN CASO DE HABER ERRORES MOSTRARNOS
                } else {
                    res.render("edit_usuario", {  // EN CASO DE NO HABER ERRORES LLEVARNOS A VISTA ADMIN
                        usuario: results[0],
                        login: true,
                    });
                }
            }  
        );
    } else {
        res.redirect("/");
    }
})



// ######################################## EDIT ESCENARIO
router.get("/edit_escenario/:escenario_id", isAdmin, (req, res) => {
    const escenario_id = req.params.escenario_id;
    db.query(
        "SELECT * FROM escenarios WHERE escenario_id = ?", [escenario_id],
        (error, results) => {
            if (error) {
                console.error("Error al buscar escenario:", error);
                return res.redirect("/admin");
            }
            if (results.length === 0) {
                return res.render("edit_escenario", {
                    escenarios: null,
                    login: true,
                    rol: req.session.rol,
                });
            }
            res.render("edit_escenario", {
                escenario: results[0],
                login: true,
                rol: req.session.rol,
            });
        }
    );
});



// ######################################## EDIT ARTISTA
router.get("/edit_artista/:artista_id", isAdmin, (req, res) => {
    const artista_id = req.params.artista_id;
    db.query(
        "SELECT * FROM artistas WHERE artista_id = ?", [artista_id],
        (error, results) => {
            if (error) {
                console.error("Error al buscar Artista:", error);
                return res.redirect("/admin");
            }
            if (results.length === 0) {
                return res.render("edit_artista", {
                    artistas: null,
                    login: true,
                    rol: req.session.rol,
                });
            }
            res.render("edit_artista", {
                artista: results[0],
                login: true,
                rol: req.session.rol,
            });
        }
    );
});

// #########################################################################
// #################### C I E R R E  -  S E S I O N ########################
// #########################################################################
router.get("/logout", (req, res) => {
    req.session.destroy(() => {
        res.redirect("/");
    });
});



// #########################################################################
// ####################### R U T A S - P O S T S ###########################
// #########################################################################
router.post(
    "/register",
    [
        body("name")
            .isLength({ min: 4 })
            .withMessage("El nombre debe tener al menos 4 caracteres"),
        body("pass")
            .notEmpty()
            .isLength({ min: 4 })
            .withMessage("La contraseña debe tener al menos 4 caracteres"),
        body("email").isEmail().withMessage("El email no es valido"),
        body("telefono").isNumeric().withMessage("debe ser un número"),
    ],
    async (req, res) => {
        console.log("--- SOLICITUD DE REGISTRO RECIBIDA ---"); 
        console.log("Cuerpo de la solicitud (req.body):", req.body);
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            console.log("hay errores")
            console.log(req.body);
            const valores = req.body; //se guardan los valores introducidos en el formulario
            const validacionErrores = errors.array(); //se guarda en un array todos los errores producidos
            res.render("register", {
                validaciones: validacionErrores,
                valores: valores,
                login: req.session.loggedin || false,
                rol: req.session.rol || null
            });
        } else {
             console.log("no hay errores")
            //Recoger los datos del formulario
            const name = req.body.name;
            const rol = req.body.rol;
            const email = req.body.email;
            const pass = req.body.pass;
            const direccion = req.body.direccion;
            const telefono = req.body.telefono;

            //Cifrar la contraseña
            const passwordHash = await bcrypt.hash(pass, 8);
            //Guardar el usuario en la base de datos
            db.query(
                "INSERT INTO usuarios SET ?",
                {
                    nombre: name,
                    rol: rol,
                    email: email,
                    pass: passwordHash,
                    direccion: direccion,
                    telefono: telefono
                },
                (error, results) => {
                    if (error) {
                        console.log(error);
                    } else {
                        res.render("register", {
                            alert: true,
                            alertTitle: "Registro",
                            alertMessage: "El usuario se ha registrado correctamente",
                            alertIcon: "success",
                            showConfirmButton: false,
                            timer: 2500,
                            ruta: "",
                            login: req.session.loggedin || false,
                            rol: req.session.rol || null
                        });
                    }
                }
            );
        }
    }
);

// #########################################################################
// #################### I N I C I O  -  S E S I O N ########################
// #########################################################################

// ######################################## INICIO SESION, RESPALDO HASTA HASTA SOLUCIONAR PODER EDITAR Y CREAR, 
router.post("/auth", async (req, res) => {
    const email = req.body.email; // SE USA LAS CREDENCIALES PARA LOGIN
    const pass = req.body.pass;
    if (!email || !pass) {
        res.render("login", {
            alert: true,
            alertTitle: "Advertencia",
            alertMessage: "Debes ingresar correo y contraseña",
            alertIcon: "warning",
            showConfirmButton: true,
            timer: false,
            ruta: "login"
        });
        return;
    }
    db.query("SELECT * FROM usuarios WHERE email = ?", [email], async (err, results) => {
        if (err) throw err;

        if (results.length === 0) {
            res.render("login", {
                alert: true,
                alertTitle: "Error",
                alertMessage: "El correo no está registrado",
                alertIcon: "error",
                showConfirmButton: true,
                timer: false,
                ruta: "login"
            });
        } else {
            const user = results[0];
            // Verifica si el campo "pass" es string
            if (typeof user.pass !== "string") {
                console.error("❌ Contraseña no válida en la base de datos:", user.pass);
                return res.render("login", {
                    alert: true,
                    alertTitle: "Error",
                    alertMessage: "Error interno: contraseña inválida",
                    alertIcon: "error",
                    showConfirmButton: true,
                    timer: false,
                    ruta: "login"
                });
            }
            const passwordMatch = await bcrypt.compare(pass, user.pass);
            if (passwordMatch) {
                // Sesión iniciada correctamente
                req.session.loggedin = true;
                req.session.email = user.email;
                req.session.name = user.nombre;
                req.session.rol = user.rol;
                // req.session.usuario_id = results[0].usuario_id;  // Muy importante
                // req.session.rol = results[0].rol;
                req.session.usuario_id = user.usuario_id;

                //CREAMOIS VARIABLE PARA GENERAR UNA RUTA DINAMICA (admin o user)
                let rutaDestino = (user.rol === "admin") ? "admin" : "usuario_dashboard"; 
                res.render("login", {
                    alert: true,
                    alertTitle: "Conexión exitosa",
                    alertMessage: "¡Login correcto!",
                    alertIcon: "success",
                    showConfirmButton: false,
                    timer: 1500,
                    // ruta: "admin",
                    ruta: rutaDestino // APLICAMOS VARIBLE
                });
            } else {
                res.render("login", {
                    alert: true,
                    alertTitle: "Error",
                    alertMessage: "Contraseña incorrecta",
                    alertIcon: "error",
                    showConfirmButton: true,
                    timer: false,
                    ruta: "login"
                });
            }
        }
    });
});



// // ######################################## INICIAR SESION - ALTERNATIVA POR SOLUCIONAR PODER EDITAR Y CREAR,
// // 📌 Ruta para manejar el formulario de login
// router.post("/auth", async (req, res) => {
//     const { email, pass } = req.body;

//     // Validación inicial de los campos
//     if (!email || !pass) {
//         return res.render("login", {
//             alert: true,
//             alertTitle: "Advertencia",
//             alertMessage: "Debes ingresar correo y contraseña",
//             alertIcon: "warning",
//             showConfirmButton: true,
//             timer: false,
//             ruta: "login"
//         });
//     }

//     try {
//         // Consulta la base de datos usando async/await.
//         // `db.query` devuelve un array: [resultados, campos]. Usamos destructuración.
//         const [results] = await db.query("SELECT * FROM usuarios WHERE email = ?", [email]);

//         // Si no se encuentra el usuario
//         if (results.length === 0) {
//             return res.render("login", {
//                 alert: true,
//                 alertTitle: "Error",
//                 alertMessage: "El correo no está registrado",
//                 alertIcon: "error",
//                 showConfirmButton: true,
//                 timer: false,
//                 ruta: "login"
//             });
//         }

//         const user = results[0];

//         // Compara la contraseña cifrada
//         const passwordMatch = await bcrypt.compare(pass, user.pass);

//         if (passwordMatch) {
//             // Sesión iniciada correctamente
//             req.session.loggedin = true;
//             req.session.email = user.email;
//             req.session.name = user.nombre;
//             req.session.rol = user.rol;
//             req.session.usuario_id = user.usuario_id;

//             // Redirección dinámica según el rol
//             const rutaDestino = (user.rol === "admin") ? "admin" : "usuario_dashboard";
            
//             return res.render("login", {
//                 alert: true,
//                 alertTitle: "Conexión exitosa",
//                 alertMessage: "¡Login correcto!",
//                 alertIcon: "success",
//                 showConfirmButton: false,
//                 timer: 1500,
//                 ruta: rutaDestino
//             });
//         } else {
//             // Contraseña incorrecta
//             return res.render("login", {
//                 alert: true,
//                 alertTitle: "Error",
//                 alertMessage: "Contraseña incorrecta",
//                 alertIcon: "error",
//                 showConfirmButton: true,
//                 timer: false,
//                 ruta: "login"
//             });
//         }
//     } catch (error) {
//         // Manejo de errores de la base de datos
//         console.error("Error en la ruta de autenticación:", error);
//         return res.render("login", {
//             alert: true,
//             alertTitle: "Error del servidor",
//             alertMessage: "Ha ocurrido un error al intentar iniciar sesión. Por favor, inténtalo de nuevo más tarde.",
//             alertIcon: "error",
//             showConfirmButton: true,
//             timer: false,
//             ruta: "login"
//         });
//     }
// });




// ######################################## CREAR NUEVO CONCIERTO
router.post('/create_conciertoX', async (req, res) => {
    const { nombre_concierto, fecha, hora, descripcion, escenario_id } = req.body;
        try {await db.query(
            "INSERT INTO conciertos (nombre_concierto, fecha, hora, descripcion, escenario_id) VALUES (?, ?, ?, ?, ?)",
            [nombre_concierto, fecha, hora, descripcion, escenario_id]
            );
            res.redirect('/admin'); // o donde quieras volver
        } catch (err) {
            console.error(err);
            res.status(500).send("Error al crear concierto");
        }
});



// ######################################## FUNCION isADMIN - ENSAYO
function isAdmin(req, res, next) {
    if (req.session.loggedin && req.session.rol === "admin") {
        next(); // Continúa con la siguiente función de middleware/ruta
    } else {
        res.render("login", {
            alert: true,
            alertTitle: "Acceso denegado",
            alertMessage: "Necesitas ser administrador para acceder a esta sección.",
            alertIcon: "error",
            showConfirmButton: true,
            timer: false,
            ruta: "login"
        });
    }
}


// router.post("/admin/clientes/crear", crud.registrarCliente);
// router.post("/admin/pedidos/crear", crud.crearPedido);
// router.post("/admin/pedidos/actualizar_estado", crud.actualizarEstadoTrabajo);


router.post("/save_concierto", crud.save_concierto);
router.post("/save_usuario", crud.save_usuario);
router.post("/save_artista", crud.save_artista);
router.post("/save_escenario", crud.save_escenario);

router.post("/update_concierto", crud.update_concierto);
router.post("/update_usuario", crud.update_usuario);
router.post("/update_artista", crud.update_artista);
router.post("/update_escenario", crud.update_escenario);

module.exports = router;
