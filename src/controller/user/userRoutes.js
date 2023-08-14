// import {Router} from 'express';
// EL módulo 'express-promise-router' extiende el Router de express.
// Este nuevo Router tiene la gracia de que implementa un error handler
// para las peticiones asíncronas que cascan, de manera que no se para 
// la aplicación
import Router from 'express-promise-router';
import { goUserManagement, goNewUser, doNewUser, doDeleteUser, goEditUser, doUpdateUser } from './userController.js';

const router = Router();

router.get('/userManagement', goUserManagement);
router.get('/userNew', goNewUser);
router.post('/userNew', doNewUser);
router.get('/userDelete', doDeleteUser);
router.get('/userEdit', goEditUser);
router.post('/userUpdate', doUpdateUser);

export default router;
