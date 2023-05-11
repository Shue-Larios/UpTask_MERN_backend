import express from 'express'
import {
    obtenerProyectos,
    nuevoProyecto,
    obtenerProyecto,
    editarProyecto,
    eliminarProyecto,
    buscarColaborador,
    agregarColaborador,
    eliminarColaborador,
} from "../controllers/proyectoController.js";
import { checkAuth } from "../middlewares/checkAuth.js";
 const router = express.Router();

// revisamos la autenticacion y despues obtenemos los proyectos
// agrupamos xk son la misma ruta diferente envio post o get
router
    .route('/')
    // revisamos primero la autenticacion y luego pasa el siguiente middleware
    .get(checkAuth, obtenerProyectos)
    .post(checkAuth, nuevoProyecto);

router
    .route('/:id')
    .get(checkAuth, obtenerProyecto)
    .put(checkAuth, editarProyecto)
    // un delete es para eliminar un recurso completo
    .delete(checkAuth, eliminarProyecto);


router.post('/colaboradores', checkAuth, buscarColaborador)


router.post('/colaboradores/:id', checkAuth, agregarColaborador)


// este post tambien elimina pero solo una parte del recurso
// este id aca es el id del proyecto NO del usuario
router.post('/eliminar-colaborador/:id', checkAuth, eliminarColaborador)


// para exportarlo por defecto y cuando lo ocupe nombrarlo como yo lo quiera
export default router