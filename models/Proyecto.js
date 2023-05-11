import mongoose from "mongoose";


// la estructura de la base de datos
// como queremos q luzca el Schema que es como la informacion que voy a grabar en la base
const proyectosSchema = mongoose.Schema({
    nombre: {
        type: String,
        required: true, //indica q el campo es obligatorio
        trim: true // quita los espacios del principio y el final
    },
    descripcion: {
        type: String,
        required: true, //indica q el campo es obligatorio
        trim: true // quita los espacios del principio y el final
    },
    fechaEntrega: {
        type: Date,
        default: Date.now(),
    },
    cliente: {
        type: String,
        required: true, //indica q el campo es obligatorio
        trim: true // quita los espacios del principio y el final
    },
    creador: {
        type: mongoose.Schema.Types.ObjectId, // como hacer coleccionres relacionadas de tablas en la base de datos no relacional
        ref: "Usuario",  //es de donde va a tener la referencia el nombre del Schema
    },
    // como arreglo de usuario como van hacer muchos x eso asi
    tareas: [
        {
            type: mongoose.Schema.Types.ObjectId, // como hacer coleccionres relacionadas de tablas en la base de datos no relacional
            ref: "Tarea",  //es de donde va a tener la referencia el nombre del Schema
        }
    ],
    // como arreglo de usuario como van hacer muchos x eso asi
    colaboradores: [
        {
            type: mongoose.Schema.Types.ObjectId, // como hacer coleccionres relacionadas de tablas en la base de datos no relacional
            ref: "Usuario",  //es de donde va a tener la referencia el nombre del Schema
        }
    ],
   
}, {
    // crea dos columnas mas de creado y actualizado
    timestamps: true
});


// Usuario es como se va a llamar en otro archivo y el Schema q va a utilizar
export const Proyecto = mongoose.model("Proyecto", proyectosSchema);
// export default Usuario;