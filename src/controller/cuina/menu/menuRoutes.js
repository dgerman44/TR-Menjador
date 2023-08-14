// import {Router} from 'express';
// EL módulo 'express-promise-router' extiende el Router de express.
// Este nuevo Router tiene la gracia de que implementa un error handler
// para las peticiones asíncronas que cascan, de manera que no se para 
// la aplicación
import Router from 'express-promise-router';
import {goMenuAnual, goMenuDia, goNewMenu, doUpdateMenu, goEditMenu} from './menuController.js';

const router = Router();
router.get('/actualitzaMenu', goMenuAnual);
router.post('/menuDia', goMenuDia);
router.post('/newMenu', goNewMenu);
router.post('/updateMenu', doUpdateMenu);
router.post('/editMenu', goEditMenu);

export default router;