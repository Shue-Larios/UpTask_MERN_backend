import express from 'express'


import {
    agregarTarea,
    obtenerTarea,
    actualizarTarea,
    eliminarTarea,
    cambiarEstado,
} from "../controllers/tareaController.js";
import { checkAuth } from '../middlewares/checkAuth.js';



const router = express.Router();

// primero el middleware de autenticacion para saber que el usuario tiene que estar autenticado
router.post('/', checkAuth, agregarTarea)



router.route('/:id')
    // todo va a la misma ruta solo cambia el tipo de peticion
    .get(checkAuth, obtenerTarea) //cuando la peticion es tipo get
    .put(checkAuth, actualizarTarea)
    .delete(checkAuth, eliminarTarea)

// para cambiar el estado de la tarea completa/incompleta
router.post('/estado/:id', checkAuth, cambiarEstado)




export default router