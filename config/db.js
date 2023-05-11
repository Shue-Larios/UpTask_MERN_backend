// aca esta toda la configuracion para conectarme a la base de datos
// para instalarlo npm i mongoose
import mongoose from 'mongoose'




export const conectarDB = async () => {
    // en caso que no se pueda conectar 
    try {
        
        const connection = await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });

        const url = `${connection.connection.host}:${connection.connection.port}`
        console.log(`Shue MongoDB conectado en: ${url}`);
    } catch (error) {
        console.log(`error: ${error.message}`);
        // sirve para forzar que el proceso termine
        process.exit(1);
    }
}

