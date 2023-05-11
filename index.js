// archivo que tiene la configuracion del servidor
// busca el paquete y lo asigna a esa variable
import express from "express";
// a los archivos hechos por mi tengo que ponerle la extension
import { conectarDB } from "./config/db.js";
// para importar las variables de entorno
import dotenv from 'dotenv'
import usuarioRoutes from "./routes/usuarioRoutes.js";
import proyectoRoutes from "./routes/proyectoRoutes.js";
import tareaRoutes from "./routes/tareaRoutes.js";
import cors from "cors";






// ejecutamos la funcion
const app = express();

// procesa la informacion recibida del api de tipo json
app.use(express.json())

// para tener habilitadas las variables de entornoel orden es importante
dotenv.config();

// conectamos la base de datos
conectarDB();

// configurar cors  que nos permite las conexiones desde el dominio del frontend
// El Intercambio de Recursos de Origen Cruzado (CORS (en-US)) es un mecanismo que utiliza cabeceras HTTP adicionales para permitir que un user agent (en-US) obtenga permiso para acceder a recursos seleccionados desde un servidor, en un origen distinto (dominio) al que pertenece
// esto se conoce como whitelist (quienes estan permitidos)
const whitelist = [process.env.FRONTEND_URL]
// opciones de cors
const corsOptions = {
    // quien esta mandando el request
    origin: function (origin, callback) {
        console.log(origin);

        if (whitelist.includes(origin)) {
            // puede consultar la api
            // null xk no hay mensaje de error y true xk le damos el acceso
            callback(null, true)
        } else {
            // no esta permitido
            callback(new Error("Error de Cors"))
        }
    }
}

app.use(cors(corsOptions)) // fin configurar cors


// configuracion de las rutas aca solo nombro los archivos dentro de estos estan las rutas
// Routing
// el orden del req y res si importa
// el use significa que responde a cualquier verbo http (get, post, put, delete)

app.use('/api/usuarios', usuarioRoutes);

app.use('/api/proyectos', proyectoRoutes);

app.use('/api/tareas', tareaRoutes);







// sino existe pone como prioridad el 4000
const PORT = process.env.PORT || 4000

// numero del puerto
// servidor hacemos esa variable para poner el Socket.io sino no se pone
const servidor = app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
})

// IMPORTANTE
// para llamar este archivo en el package.json
// "scripts": {
//     "dev": "node index.js"
//   },



// SOCKET.IO 
// el creador es el mismo que Next.js
import { Server } from 'socket.io'

const io = new Server(servidor, {
    pingTimeout: 60000, // este es el valor por defecto
    // este cors tiene que ser igual al que tenemos arriba
    cors: {
        // manejar con variables de entorno para el deployment sea mas sencillo
        origin: process.env.FRONTEND_URL,
    }
});

// abrir una conexion se Socket.io
// este socket se pasa automaticamente
io.on('connection', (socket) => {
    console.log('conectado a socket.io'); //definir este msj siempre para cuando conecte el frontend ver este log

    // INICIO DE CONFIGURACION (PROBAR SI FUNCIONA) DE SOCKET IO
    // Definir los eventos de socket io como se nombrar en el frontend
    // el evento on es que voy hacer cuando ese evento ocurra
    // (nombre) son datos que estoy recibiendo del socket io client (frontend)
    // socket.on('prueba', (nombre) => {
    //     console.log('Prueba desde socket del evento prueba', nombre);
    // // para enviar un evento al socket io client (frontend)
    // // el siguiente campo son los datos que quiero mandar al cliente (frontend)
    // socket.emit('respuesta', {
    //     nombre:'Rene'
    // })
    // });
    // FIN DE CONFIGURACION (PROBAR SI FUNCIONA) DE SOCKET IO

    // Definir los eventos de socket io como se nombrar en el frontend
    socket.on('abrir proyecto', (proyecto) => {
        // como para hacer salas distintas o cuartos
        socket.join(proyecto)
    })

    // escucha por el evento de nueva tarea q esta en proyectoProvider la parte de crearTarea
    socket.on('nueva tarea', (tarea) => {
        const proyecto = tarea.proyecto // en este campo obtengo el id
        socket.to(proyecto).emit('tarea agregada', tarea)
    })

    // paso 2 eliminar
    socket.on('eliminar tarea', (tarea) => {
        const proyecto = tarea.proyecto
        socket.to(proyecto).emit('tarea eliminada', tarea)
    })


    socket.on('actualizar tarea', (tarea) => {        
          const proyecto = tarea.proyecto._id
          socket.to(proyecto).emit('tarea actualizada', tarea)
    })

    socket.on('cambiar estado', (tarea) => {        
        const proyecto = tarea.proyecto._id
        socket.to(proyecto).emit('nuevo estado', tarea)
  })
});