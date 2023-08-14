// import {Router} from 'express';
// EL módulo 'express-promise-router' extiende el Router de express.
// Este nuevo Router tiene la gracia de que implementa un error handler
// para las peticiones asíncronas que cascan, de manera que no se para 
// la aplicación
import Router from 'express-promise-router';
import {goComandes, goDetalle, doProcesat} from './comandesController.js';

const router = Router();
router.get('/comandes', goComandes);
router.post('/comandes', goComandes);
router.post('/detalle', goDetalle);
router.post('/procesa', doProcesat);

export default router;