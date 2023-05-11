import { Proyecto } from "../models/Proyecto.js"
import { Tarea } from "../models/Tarea.js"
import { Usuario } from "../models/Usuario.js";


// funcion que nos trae TODOS los proyectos del usuario autenticado
const obtenerProyectos = async (req, res) => {
    // gracias al checkAuth tengo ya el usuario autenticado
    // console.log(req.usuario);

    // .find() nos va a traer todos los proyectos guardados en la base
    // .where('creador').equals(req.usuario) una forma de hacer consultas mas avanzadas en mongo equals es como decir igual
    // select("-tareas") le digo que no se traiga ese campo
    const proyectos = await Proyecto.find({
        // toma un arreglo de condiciones que quiero comprobar
        // este arreglo tiene que cumplir todas las condiciones que la pase xk default es and aca se cambio  a or
        '$or': [
            { 'colaboradores': { $in: req.usuario } },
            { 'creador': { $in: req.usuario } }
        ]
    })
        // estas dos ya no se requieren pero lo dejo ahi x terminos d estudio
        // .where('creador')
        // .equals(req.usuario)
        .select("-tareas");

    res.json(proyectos)
}

// funcion para crear nuevos proyectos
const nuevoProyecto = async (req, res) => {
    // gracias al checkAuth tengo ya el usuario autenticado
    // console.log(req.usuario);

    // aca estoy instanciando lo que recibo dl body
    const proyecto = new Proyecto(req.body)
    // agregamos otra linea a la variable proyecto
    proyecto.creador = req.usuario._id

    try {
        // guardamos en la base de datos
        const proyectoAlmacenado = await proyecto.save()
        res.json(proyectoAlmacenado)
    } catch (error) {
        console.log(error);
    }
}

//funcion para listar un proyecto y tambien las tareas asociadas con el
const obtenerProyecto = async (req, res) => {
    // leemos el id desde la url como params
    const { id } = req.params
    try {
        // buscamos el proyecto por el id
        // populate() hay que especificar la relacion es por el campo en la base de datos y nos trae toda la informacion
        // el segundo campo del populate colocamos solo los campos q quiero traer en ese caso trae 3 xk el id viene por implicito
        // asi se hace un populate cuando que ya se le hixo uno .populate({ path: 'tareas', populate : { path: 'completado'}})
        const proyecto = await Proyecto.findById(id).populate({ path: 'tareas', populate: { path: 'completado', select: 'nombre' } }).populate('colaboradores', "nombre email")



        // si el proyecto no existe
        if (!proyecto) {
            const error = new Error("No encontrado")
            // retorno un estatus y muestro el msj linea anterior
            return res.status(404).json({ msg: error.message })
        }

        // comprobar si la persona que esta tratando de acceder al proyecto fue el q lo creo sino es el no tiene el acceso
        // && hacemos que se cumplan ambos lados de la condicion
        // dentro del some hacemos la condicion para evitar mostrare la alerta al colaborador
        if (proyecto.creador.toString() !== req.usuario._id.toString() && !proyecto.colaboradores.some(colaborador => colaborador._id.toString() === req.usuario._id.toString())) {
            const error = new Error("Accion no Valida")
            // retorno un estatus y muestro el msj linea anterior
            return res.status(401).json({ msg: error.message })
        }

        // obtener  las tareas del proyecto
        // find() va a traer todo
        // .where("proyecto") es el nombre del campo a comparar
        // equals(proyecto._id) es el campo igual a
        const tareas = await Tarea.find().where("proyecto").equals(proyecto._id)


        res.json(
            // aca regreso los proyectos almacenados y las tareas de este proyecto
            proyecto,
            // tareas
        )
    } catch (error) {
        // retorno un estatus y muestro el msj linea anterior
        return res.status(404).json({ msg: 'Hubo un error' })
    }

}

// funcion para editar los proyectos
const editarProyecto = async (req, res) => {
    // leemos el id desde la url como params
    const { id } = req.params
    try {
        // buscamos el proyecto por el id
        const proyecto = await Proyecto.findById(id)

        // si el proyecto no existe
        if (!proyecto) {
            const error = new Error("No encontrado")
            // retorno un estatus y muestro el msj linea anterior
            return res.status(404).json({ msg: error.message })
        }

        // comprobar si la persona que esta tratando de acceder al proyecto fue el q lo creo sino es el no tiene el acceso
        if (proyecto.creador.toString() !== req.usuario._id.toString()) {
            const error = new Error("Accion no Valida")
            // retorno un estatus y muestro el msj linea anterior
            return res.status(401).json({ msg: error.message })
        }

        // reeescribir la instancia de proyecto
        // req.body.nombre si el usuario manda algo y sino utiliza los datos que hay en la base de datos
        proyecto.nombre = req.body.nombre || proyecto.nombre
        proyecto.descripcion = req.body.descripcion || proyecto.descripcion
        proyecto.fechaEntrega = req.body.fechaEntrega || proyecto.fechaEntrega
        proyecto.cliente = req.body.cliente || proyecto.cliente

        try {
            const proyectoAlmacenado = await proyecto.save()
            res.json(proyectoAlmacenado)
        } catch (error) {
            console.log(error);
        }
    } catch (error) {
        // retorno un estatus y muestro el msj linea anterior
        return res.status(404).json({ msg: 'Hubo un error' })
    }
}

// funcion para eliminar los proyectos
const eliminarProyecto = async (req, res) => {
    // leemos el id desde la url como params
    const { id } = req.params

    try {
        // buscamos el proyecto por el id
        const proyecto = await Proyecto.findById(id)

        // si el proyecto no existe
        if (!proyecto) {
            const error = new Error("No encontrado")
            // retorno un estatus y muestro el msj linea anterior
            return res.status(404).json({ msg: error.message })
        }

        // comprobar si la persona que esta tratando de acceder al proyecto fue el q lo creo sino es el no tiene el acceso
        if (proyecto.creador.toString() !== req.usuario._id.toString()) {
            const error = new Error("Accion no Valida")
            // retorno un estatus y muestro el msj linea anterior
            return res.status(401).json({ msg: error.message })
        }

        try {
            await proyecto.deleteOne();
            return res.json({ msg: "Proyecto Eliminado" })

        } catch (error) {
            console.log(error);
        }
    } catch (error) {
        return res.status(404).json({ msg: 'Hubo un error' })
    }
}

// funcion para buscar un colaborador 
const buscarColaborador = async (req, res) => {
    console.log(req.body);
    // extraemos el email que mandan en la peticion del frontend
    const { email } = req.body
    // findOne para encontrar algo solamente po un campo
    // con select le digo que campos no quiero que traiga
    const usuario = await Usuario.findOne({ email }).select('-confirmado -createdAt -password -token -updatedAt -__v')

    if (!usuario) {
        const error = new Error("Usuario no encontrado")
        // retorno un estatus y muestro el msj linea anterior
        return res.status(404).json({ msg: error.message })
    }

    // retornamos el usuario como json
    res.json(usuario)
}


// funcion para agregar un colaborador al proyecto
const agregarColaborador = async (req, res) => {
    // console.log(req.params.id);
    // verificamos q el proyecto exista obteniendo el id de la url
    const proyecto = await Proyecto.findById(req.params.id);

    if (!proyecto) {
        const error = new Error("Proyecto no encontrado")
        // retorno un estatus y muestro el msj linea anterior
        return res.status(404).json({ msg: error.message })
    }

    // cuando alguien que no creo el proyecto esta queriendo agregar colaborador
    if (proyecto.creador.toString() !== req.usuario._id.toString()) {
        const error = new Error("Accion no valida")
        // retorno un estatus y muestro el msj linea anterior
        return res.status(404).json({ msg: error.message })
    }

    // verificamos que el usuario existe
    // extraemos el email que mandan en la peticion del frontend
    const { email } = req.body
    // findOne para encontrar algo solamente po un campo
    // con select le digo que campos no quiero que traiga
    const usuario = await Usuario.findOne({ email }).select('-confirmado -createdAt -password -token -updatedAt -__v')

    if (!usuario) {
        const error = new Error("Usuario no encontrado")
        // retorno un estatus y muestro el msj linea anterior
        return res.status(404).json({ msg: error.message })
    }


    // el colaborador no es el admin del proyecto si se trata de agregar el mismo
    if (proyecto.creador.toString() === usuario._id.toString()) {
        const error = new Error("El creador del proyecto no puede ser colaborador")
        // retorno un estatus y muestro el msj linea anterior
        return res.status(404).json({ msg: error.message })
    }

    // que no este agregado ya al proyecto
    // revisar si un arreglo ya tiene ciertos elementos
    if (proyecto.colaboradores.includes(usuario._id)) {
        const error = new Error("El Usuario ya pertenece al proyecto")
        // retorno un estatus y muestro el msj linea anterior
        return res.status(404).json({ msg: error.message })
    }

    //Si todo esta bien agregamos el colaborador al proyecto
    // push() para agregarlo al final de un arreglo
    // proyecto es la tabla de la base colaboradores el campo q es un arreglo
    proyecto.colaboradores.push(usuario._id)
    // para guardarlo ya en la base
    await proyecto.save();
    res.json({ msg: 'Colaborador Agregado Correctamente' })
}

// funcion para eliminar un colaborador del proyecto
const eliminarColaborador = async (req, res) => {

    // verificar si el proyecto existe
    const proyecto = await Proyecto.findById(req.params.id);

    if (!proyecto) {
        const error = new Error("Proyecto no encontrado")
        // retorno un estatus y muestro el msj linea anterior
        return res.status(404).json({ msg: error.message })
    }

    // cuando alguien que no creo el proyecto esta queriendo eliminar el colaborador
    if (proyecto.creador.toString() !== req.usuario._id.toString()) {
        const error = new Error("Accion no valida")
        // retorno un estatus y muestro el msj linea anterior
        return res.status(404).json({ msg: error.message })
    }

    //Si todo esta bien eliminamos el colaborador al proyecto
    // pull() es para sacar un elementos de un arreglo
    // proyecto es la tabla de la base colaboradores el campo q es un arreglo
    console.log(req.body.id);
    proyecto.colaboradores.pull(req.body.id)
    // para guardarlo ya en la base

    await proyecto.save();
    res.json({ msg: 'Colaborador Eliminado Correctamente' })

}


export {
    obtenerProyectos,
    nuevoProyecto,
    obtenerProyecto,
    editarProyecto,
    eliminarProyecto,
    buscarColaborador,
    agregarColaborador,
    eliminarColaborador,

}