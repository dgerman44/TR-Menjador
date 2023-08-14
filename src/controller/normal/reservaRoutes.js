// import {Router} from 'express';
// EL módulo 'express-promise-router' extiende el Router de express.
// Este nuevo Router tiene la gracia de que implementa un error handler
// para las peticiones asíncronas que cascan, de manera que no se para 
// la aplicación
import Router from 'express-promise-router';
import {goReservaAnual, goNewReserva, goPago, doPagoCompletado, goPagoCancelado, doCancelaPago} from './reservaController.js';

const router = Router();
router.get('/reservaAnual', goReservaAnual);
router.post('/newReserva', goNewReserva);
router.post('/pago', goPago);
router.post('/pagoCompletado', doPagoCompletado);
router.get('/pagoCancelado', goPagoCancelado);
router.post('/cancelaPedido', doCancelaPago)


export default router;