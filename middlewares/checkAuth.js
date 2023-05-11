// importamos la libreria de jwt para descifrar el token
import jwt, { verify } from "jsonwebtoken";
import { Usuario } from "../models/Usuario.js";

export const checkAuth = async (req, res, next) => {
    // creo una variable e inicia sin nada de valor
    let token;
    // por lo general vamos a mandar el jwt por los headers
    // significa que si le estamos mandando un token en estos headers
    // estamos revisando que el token se mande por el Bearer Token
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            // split(" ") divide la cadena en dos y despues selecciono el espacio 1
            token = req.headers.authorization.split(" ")[1];

            // vamos a leer el token o desifrar
            // primero se pasa el token y luego lo que ocupamos para firmar el token
            // verify se encarga de todo por si el token expiro
            // decoded me trae el token ya separado (id , iat, exp) 
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            // aca creamos una nueva variable y decoded.id para ver solo el id
            // .select("-password") evita agregar ese campo a la variable escribir bien los campos que no ocupo
            req.usuario = await Usuario.findById(decoded.id).select("-password -confirmado -token -createdAt -updatedAt -__v")

            return next() // nos vamos al siguiente middleware
        } catch (error) {
            return res.status(404).json({ msg: "Hubo un error" })
        }
    }

    // en caso que no se mande un token
    if (!token) {
        const error = new Error("Token no válido")
        // retorno un estatus y muestro el msj linea anterior
        return res.status(401).json({ msg: error.message })
    }

    //  ejecuta el siguiente middleware
   next()
}

