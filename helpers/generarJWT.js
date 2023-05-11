
// una funcion encargada de generar nuestro json web token
// hay q instalar npm i jsonwebtoken
import jwt from 'jsonwebtoken'


export const generarJWT = (id) => {

    // .sign es un metodo que nos permite generar un jsonwebtoke
    // dentro del parentecis la primera es que estoy trayendo el id desde usuarioController
    // la seguna es la palabra secreta que se encuenra en las variables de entorno
    // la ultima es la duracion que tendra en jwt
    //  asi utilizamos las variables de entorno con Node y Express process.env.(nombre de la variable de entorno)
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '30d' // dice que expira en una hora
        // esto x si no se podria firmar x alguna razon
    })
}
