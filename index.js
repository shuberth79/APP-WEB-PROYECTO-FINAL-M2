//9 ############################## L I B R E R I A S   (FIJO) ######################################
const express = require("express");
const app = express();

if (process.env.NODE_ENV !== "production"){
    require ("dotenv").config({ path: "./env/.env" });
}

require("dotenv").config({ path: "./env/.env" });
const session = require("express-session");
require("dotenv").config();


//############################## S E S I O N  (FIJO) #################################
app.use(
    session({
        secret: "secret", //"secret" es modificable, clave secreta para cifrar la cookie
        resave: false, //guardar la sesión en cada solicitud
        saveUninitialized: false, //guarda en cada peticion cuando se produzcan cambios
    })
);


// ######################################## PEDIDOS (nuevo)
app.use((req, res, next) => {
    res.locals.login = req.session.loggedin || false;;
    res.locals.rol = req.session.rol || null;
    next();
});


//########################## M I D D L E W A R E S  (FIJO) ###########################
app.use(express.urlencoded({ extended: true })); //LEER LOS DATOS DE FORMULARIOS: 2D False / 3D True
app.use(express.json()); //LEER LOS DATOS DESDE API
app.use("/", require("./src/router"));


//###################### C A R P E T A   P U B L I C A  (FIJO) #######################
app.use("/resources", express.static(__dirname + "/public"));


//################################ V I S T A S  (FIJO) ##############################
app.set("view engine", "ejs");
// app.use(expressLayouts);
// app.set("views", __dirname + "/views"); //definimos la carpeta (no es necesario si la carpeta se llama views)


//################################ S E R V I D O R ##################################
app.listen(4009, () => {
    console.log("El servidor está ejecutándose en http://localhost:4009");
});

//############################# E X P O R T A C I O N ###############################

