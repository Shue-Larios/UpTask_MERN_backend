import { Proyecto } from "../models/Proyecto.js";
import { Tarea } from "../models/Tarea.js";

const agregarTarea = async (req, res) => {
    // asi manejo el error xk sin introducen mas caracteres en el campo proyecto como id
    try {
        // extraigo el campo proyecto del body que es el id del proyecto
        const { proyecto } = req.body


        const existeProyecto = await Proyecto.findById(proyecto)

        // sino existe el proyecto xk el id es diferente
        if (!existeProyecto) {
            const error = new Error("el proyecto no existe")
            return res.status(404).json({ msg: error.message })
        }

        // si la persona que esta dando de alta es la que creo el proyecto
        // ingreso al campo creador que ahi esta el id del usuario que lo creo
        if (existeProyecto.creador.toString() !== req.usuario._id.toString()) {
            const error = new Error("no tienes los permisos para añadir tareas")
            return res.status(403).json({ msg: error.message })
        }

        try {
            const tareaAlmacenada = await Tarea.create(req.body)
            // almacenamos el id de la tarea creada en el arreglo de tareas del proyecto en la base de datos
            // el push en nodejs si se puede hacer sin problema en react NO
            existeProyecto.tareas.push(tareaAlmacenada._id)
            await existeProyecto.save() // para que guarde el cambio del push hecho
            return res.json(tareaAlmacenada)
        } catch (error) {
            console.log(error);
        }


    } catch (error) {
        return res.status(400).json({ msg: "Hubo un error" })
    }


}


const obtenerTarea = async (req, res) => {
    try {
        const { id } = req.params

        // populate("proyecto")proyecto es el nombre del campo q quiero por decir relacionar
        const tarea = await Tarea.findById(id).populate("proyecto")

        if (!tarea) {
            const error = new Error("Tarea no encontrada")
            return res.status(404).json({ msg: error.message })
        }


        // si el usuario autenticado es diferente del que creo la tarea
        if (tarea.proyecto.creador.toString() !== req.usuario._id.toString()) {
            const error = new Error("Accion no permitida")
            return res.status(403).json({ msg: error.message })
        }

        res.json(tarea)

    } catch (error) {
        return res.status(400).json({ msg: "Hubo un error" })
    }

}


const actualizarTarea = async (req, res) => {
    try {
        const { id } = req.params

        // populate("proyecto")proyecto es el nombre del campo q quiero por decir relacionar
        const tarea = await Tarea.findById(id).populate("proyecto")

        if (!tarea) {
            const error = new Error("Tarea no encontrada")
            return res.status(404).json({ msg: error.message })
        }


        // si el usuario autenticado es diferente del que creo la tarea
        if (tarea.proyecto.creador.toString() !== req.usuario._id.toString()) {
            const error = new Error("Accion no permitida")
            return res.status(403).json({ msg: error.message })
        }

        // al campo nombre de la instancia de tarea agrega lo q viene del body sino agrega lo mismo que esta en instancia de tarea
        tarea.nombre = req.body.nombre || tarea.nombre
        tarea.descripcion = req.body.descripcion || tarea.descripcion
        tarea.prioridad = req.body.prioridad || tarea.prioridad
        tarea.fechaEntrega = req.body.fechaEntrega || tarea.fechaEntrega

        try {
            const tareaAlmacenada = await tarea.save()
            return res.json(tareaAlmacenada)
        } catch (error) {
            console.log(error);
        }


    } catch (error) {
        return res.status(400).json({ msg: "Hubo un error" })
    }
}


const eliminarTarea = async (req, res) => {
    try {
        const { id } = req.params

        // populate("proyecto")proyecto es el nombre del campo q quiero por decir relacionar
        const tarea = await Tarea.findById(id).populate("proyecto")

        if (!tarea) {
            const error = new Error("Tarea no encontrada")
            return res.status(404).json({ msg: error.message })
        }


        // si el usuario autenticado es diferente del que creo la tarea
        if (tarea.proyecto.creador.toString() !== req.usuario._id.toString()) {
            const error = new Error("Accion no permitida")
            return res.status(403).json({ msg: error.message })
        }

        try {
            // para eliminar el id de la tarea que hace referencia y que esta guardada en la coleccion de proyectos
            // obtenemos el proyecto
            const proyecto = await Proyecto.findById(tarea.proyecto)
            // con pull sacamos la tarea
            proyecto.tareas.pull(tarea._id)

            // cuando tenemos diferentes await hacerlo asi
            // esto hace que los dos await inicien al mismo tiempo y no se bloquee uno al otro
            await Promise.allSettled([
                await proyecto.save(),

                // deleteOne() es un método que se utiliza para eliminar un documento de una colección
                await tarea.deleteOne()
            ])

            return res.json({ msg: "La Tarea se elimino" })

        } catch (error) {
            console.log(error);
        }

    } catch (error) {
        return res.status(400).json({ msg: "Hubo un error" })
    }
}

const cambiarEstado = async (req, res) => {
    // leo el campo id de la url
    const { id } = req.params

    // populate("proyecto") proyecto es el nombre del campo q quiero por decir relacionar
    const tarea = await Tarea.findById(id).populate("proyecto")

    // si la tarea no esta enconntrada
    if (!tarea) {
        const error = new Error("Tarea no encontrada")
        return res.status(404).json({ msg: error.message })
    }

    // si el usuario autenticado es diferente del que creo la tarea
    if (tarea.proyecto.creador.toString() !== req.usuario._id.toString() && !tarea.proyecto.colaboradores.some(colaborador => colaborador._id.toString() === req.usuario._id.toString())) {
        const error = new Error("Accion no permitida")
        return res.status(403).json({ msg: error.message })
    }
    // !tarea.estado  con esto decimos que va hacer diferente de lo que traiga si viene true lo hace false
    tarea.estado = !tarea.estado;
    tarea.completado = req.usuario._id; //para llenar el campo de la base con el id del usuaio que completo la tarea
    await tarea.save();

    // hago de nuevo la consulta y la envio como respuesta al frontend asi muestra quien la completo sin recargar la pagina
    const tareaAlmacenada = await Tarea.findById(id)
    .populate("proyecto")
    .populate("completado")

    res.json(tareaAlmacenada)

}


export {
    agregarTarea,
    obtenerTarea,
    actualizarTarea,
    eliminarTarea,
    cambiarEstado,
}