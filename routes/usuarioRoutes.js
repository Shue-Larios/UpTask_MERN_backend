import express from "express";
import {
    autenticar,
    comprobarToken,
    confirmar,
    nuevoPassword,
    olvidePassword,
    perfil,
    registrar
} from "../controllers/usuarioController.js";
import { checkAuth } from "../middlewares/checkAuth.js";

const router = express.Router();


// Autenticacion, Registro y confirmacion de usuarios
// cuando haya un post hacia esta url se ejecutara este codigo
router.post("/", registrar) // creacion de nuevo usuario

router.post("/login", autenticar) // creacion de nuevo usuario

// asi puedo hacer url dinamicos
// :token es el nombre que se va agregar como parametro de la urls
router.get("/confirmar/:token", confirmar) // creacion de nuevo usuario


router.post("/olvide-password", olvidePassword) // creacion de nuevo usuario


// // identificar el token valido y el usuario q esta tratando de cambiar el password
// router.get("/olvide-password/:token", comprobarToken) //  

// router.post("/olvide-password/:token", nuevoPassword) // para la nueva contraseña


// algo que podemos hacer con express que lo soporta muy bien y queda mas compacto
router.route("/olvide-password/:token")
    .get(comprobarToken) //en el caso de get ejecuta esta funcion
    .post(nuevoPassword) //en el caso de post ejecuta esta funcion

// en checkAuth esta escrito el codigo para proteger este endpoint
// si todo esta bien va a poder acceder a la funcion de perfil
router.get("/perfil", checkAuth, perfil)

// para exportarlo por defecto y cuando lo ocupe nombrarlo como yo lo quiera
 export default router