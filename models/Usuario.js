import mongoose from "mongoose";
// libreria para encriptar contraseña npm i bcryptjs
import bcrypt from "bcryptjs"

// la estructura de la base de datos
// como queremos q luzca el Schema que es como la informacion que voy a grabar en la base
const usuarioSchema = mongoose.Schema({
    nombre: {
        type: String,
        required: true, //indica q el campo es obligatorio
        trim: true // quita los espacios del principio y el final
    },
    password: {
        type: String,
        required: true, //indica q el campo es obligatorio
        trim: true // quita los espacios del principio y el final
    },
    email: {
        type: String,
        required: true, //indica q el campo es obligatorio
        trim: true, // quita los espacios del principio y el final
        unique: true, //indica que es unico
    },
    token: {
        type: String, //indica q el campo es obligatorio
    },
    confirmado: {
        type: Boolean,
        default: false, // valor por defecto
    },
}, {
    // crea dos columnas mas de creado y actualizado
    timestamps: true
});

// este es un middleware moongose
// este codigo se ejecuta antes de guardar cualquier cosa de este quema en la base de datos
// encriptar la contraseña
usuarioSchema.pre("save", async function (next) {
    // isModified es una funcion de mongoose
    // va a revisar si el password no ha sido modificado(haseado)
    if (!this.isModified("password")) {
        // asi evito hashear el password dos vcs
        next(); // solo pasa al siguiente middleware
    }
    const salt = await bcrypt.genSalt(10);
    // dentro del hash la primera es la cadena sin hashear
    // genera un hash y lo almacena en el this.password
    this.password = await bcrypt.hash(this.password, salt)

})


// funcion para comprobar el password
usuarioSchema.methods.comprobarPassword = async function(passwordFormulario) {
    return await bcrypt.compare(passwordFormulario, this.password)
}

// Usuario es como se va a llamar en otro archivo y el Schema q va a utilizar
export const Usuario = mongoose.model("Usuario", usuarioSchema);
// export default Usuario;