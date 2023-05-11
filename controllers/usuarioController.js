// esto comunica routing con modelos
// son los controladores de mis rutas

// libreria para encriptar contraseña npm i bcryptjs


// le pongo la extension xk son archivos que yo creo
import { emailOlvidePassword, emailRegistro } from "../helpers/email.js";
import { generarId } from "../helpers/generarId.js";
import { generarJWT } from "../helpers/generarJWT.js";
// importamos el modelo de lo que acepta la base de datos
import { Usuario } from "../models/Usuario.js";


// funcion de registrar
// req es lo que stoy mandando al servidor
// res es la respuesta del servidor
const registrar = async (req, res) => {
    // traigo del req.body lo que necesito es lo q ingresa el usuario
    // para leer los datos mandados x el api
    // para obtener los datos mandados del frontend
    const { email } = req.body

    // findOne trae el primero que sea igual al campo
    // Usuario es el models
    const existeUsuario = await Usuario.findOne({ email })

    // evitar registros duplicados
    // dice que ya hay usuario con ese email
    if (existeUsuario) {
        // creo un nuevo msj d error
        const error = new Error("Usuario ya registrado")
        // retorno un estatus y muestro el msj linea anterior
        return res.status(400).json({ msg: error.message })
    }

    try {
        // crea un objeto con la informacion del modelo
        // creamos una instancia del Usuario de la base de datos en esa variable
        const usuario = new Usuario(req.body)
        // agregamos otro campo al arreglo usuario
        usuario.token = generarId()
        // para almacenarlo en la base de datos
        await usuario.save()

        // enviar el email de confirmacion
        // funcion en email.js para mandar el correo
        emailRegistro({
            // envio como objeto los datos que voy a ocupar
            email: usuario.email,
            nombre: usuario.nombre,
            token: usuario.token
        })

        // const usuarioAlmacenado = await usuario.save()
        // res.json(usuarioAlmacenado) //asi puedo probar que llega informacion a postman
        res.json({ msg: 'Usuario Creado Correctamente, Revisa tu Email para confirmar tu cuenta' })
    } catch (error) {
        console.log(error);
    }
};

// funcion de autenticar
const autenticar = async (req, res) => {
    const { email, password } = req.body

    // comprobar si el usuario existe sino regresa un null
    // agrega todos los campos de la base en ese array
    const usuario = await Usuario.findOne({ email })

    //    si el usuario no existe
    if (!usuario) {
        const error = new Error("El Usuario no  existe")
        // retorno un estatus y muestro el msj linea anterior
        return res.status(400).json({ msg: error.message })
    }

    // comprobar si el usuario esta confirmado
    // entramos al campo confirmado del array este array se llena con el findOne
    // si el campo retorna un false
    if (!usuario.confirmado) {
        const error = new Error("Tu Cuenta no ha sido confirmada")
        // retorno un estatus y muestro el msj linea anterior
        // El error 403 o 403 Forbidden es un código de respuesta HTTP el cual indica que el servidor ha recibido y ha entendido la petición, pero rechaza enviar una respuesta
        return res.status(403).json({ msg: error.message })
    }

    // comprobar su password
    // awai le pongo aca xk es asyn la funcion en el usuarioSchema
    // dentro del () pasamos el password que traemos el body
    if (await usuario.comprobarPassword(password)) {
        // si el acceso es correcto ya ingresado al sistema
        // construyo un nuevo arreglo con los datos que ocupo
        res.json({
            // aca pongo las credenciales del usuario q vienen de usuario
            _id: usuario.id,
            nombre: usuario.nombre,
            email: usuario.email,
            token: generarJWT(usuario.id)
        });
    } else {
        return res.status(400).json({
            msg: 'Password incorrecto'
        });
    }
}

// funcion de confirmar usuario
const confirmar = async (req, res) => {
    // leemos el token que viene por la url con req.params
    const { token } = req.params

    const usuarioConfirmar = await Usuario.findOne({ token })

    // si el token no existe
    if (!usuarioConfirmar) {
        const error = new Error("Token no válido")
        // retorno un estatus y muestro el msj linea anterior
        return res.status(400).json({ msg: error.message })
    }

    // en caso que hay un usuario seejecuta este codigo
    try {
        // actualizo los campo necesarios
        usuarioConfirmar.confirmado = true;
        usuarioConfirmar.token = ''; // reinicio el token xk es de un solo uso lo pongo vacio
        await usuarioConfirmar.save(); // aca guarda los datos ya actuaizados en la base de datos
        res.json({ msg: "usuario confirmado correctamente" })
    } catch (error) {
        console.log(error);
    }
}

// funcion de recuperar contraseña
const olvidePassword = async (req, res) => {
    // obtengo el email enviado pos post
    const { email } = req.body

    // comprobar si el usuario existe sino regresa un null
    // agrega todos los campos de la base en ese array
    const usuario = await Usuario.findOne({ email })

    //    si el usuario no existe
    if (!usuario) {
        const error = new Error("El Usuario no  existe")
        // retorno un estatus y muestro el msj linea anterior
        return res.status(404).json({ msg: error.message })
    }

    // en caso que el usuario exista
    try {
        usuario.token = generarId()
        await usuario.save(); // aca guarda los datos ya actuaizados en la base de datos
        //  enviar correo de olvide password
        emailOlvidePassword({
            // envio como objeto los datos que voy a ocupar
            email: usuario.email,
            nombre: usuario.nombre,
            token: usuario.token
        })


        res.json({ msg: "Hemos enviado un email con las instrucciones" })
    } catch (error) {
        console.log(error);

    }
}



// funcion de comprobar Token y que el usuaro exista
const comprobarToken = async (req, res) => {
    // extraemos el token que viene por la url con req.params
    const { token } = req.params

    // busca el token en algun usuario de la base de datos
    const tokenValido = await Usuario.findOne({ token })

    //    si el token es valido
    if (tokenValido) {
        res.json({ msg: 'Token Valido y el usuario existe' })
    } else {
        const error = new Error("Token no válido ")
        // retorno un estatus y muestro el msj linea anterior
        return res.status(404).json({ msg: error.message })
    }

}

// funcion para almacenar la nueva contraseña
const nuevoPassword = async (req, res) => {
    // extraemos el token que viene por la url con req.params
    const { token } = req.params
    // extraemos el nuevo password que viene del formulario
    const { password } = req.body

    // busca el token en algun usuario de la base de datos
    // creamos una instancia del Usuario en esa variable
    // xk Usuario xk es el esquema de la base que quiero trabajar
    const usuario = await Usuario.findOne({ token })

    //    si el token es valido
    if (usuario) {
        // el campo password va hacer igual al password ingresado
        usuario.password = password;
        //    borramos el token
        usuario.token = "";
        // siempre que se guarda en la base de datos ponerle un trycatch
        try {
            // guardamos en la instancia que se creo de la base de datos
            await usuario.save();
            res.json({ msg: 'Password Modificado Correctamente' })
        } catch (error) {
            console.log(error);
        }
    } else {
        const error = new Error("Token no válido")
        // retorno un estatus y muestro el msj linea anterior
        return res.status(404).json({ msg: error.message })
    }
}


const perfil = async (req, res) => {
    const { usuario } = req //leemos desde el servidor
    res.json(usuario)
}




// otro tipo de exportacion  en node
export {
    registrar,
    autenticar,
    confirmar,
    olvidePassword,
    comprobarToken,
    nuevoPassword,
    perfil
}

