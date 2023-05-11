import mongoose from "mongoose";


// la estructura de la base de datos
// como queremos q luzca el Schema que es como la informacion que voy a grabar en la base
const tareaSchema = mongoose.Schema({
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
    estado: {
        type: Boolean,
        default: false, // valor por defecto
    },
    fechaEntrega: {
        type: Date,
        required: true, //indica q el campo es obligatorio
        default: Date.now(),
    },
    prioridad: {
        type: String, //indica q el campo es obligatorio
        required: true,
        enum: ["Baja", "Media", "Alta"]
    },
    proyecto: {
        type: mongoose.Schema.Types.ObjectId,
        ref: ("Proyecto")
    },
    // para saber quien lo completo
    completado: {
        type: mongoose.Schema.Types.ObjectId,
        ref: ("Usuario")
    }
}, {
    // crea dos columnas mas de creado y actualizado
    timestamps: true
});


// Usuario es como se va a llamar en otro archivo y el Schema q va a utilizar
export const Tarea = mongoose.model("Tarea", tareaSchema);
// export default Usuario;