// import {Router} from 'express';
// EL módulo 'express-promise-router' extiende el Router de express.
// Este nuevo Router tiene la gracia de que implementa un error handler
// para las peticiones asíncronas que cascan, de manera que no se para 
// la aplicación
import Router from 'express-promise-router';
import { goWellcome, goSignup, doSignup, goLogin, doLoginLocal, 
    goLoginMicrosoft, loginMicrosoftCallback, 
    goLoginGoogle, loginGoogleCallback, 
    logout, goForgotPassword, doForgotPassword, goProfile, goProfileEdit, doProfileEdit} from './authController.js';

const router = Router();

router.get('/', goWellcome);
router.get('/signup', goSignup);
router.post('/signup', doSignup);
router.get('/login', goLogin);
router.post('/login/local', doLoginLocal);
router.get('/login/microsoft', goLoginMicrosoft);
router.get('/login/microsoft/callback', loginMicrosoftCallback);
router.get('/login/google', goLoginGoogle);
router.get('/login/google/callback', loginGoogleCallback);
router.get('/logout', logout);
router.get('/forgotPassword', goForgotPassword);
router.post('/forgotPassword', doForgotPassword);
router.get('/profile', goProfile);
router.get('/profile-edit', goProfileEdit);
router.post('/profile-edit', doProfileEdit);


export default router;
