// import {Router} from 'express';
// EL módulo 'express-promise-router' extiende el Router de express.
// Este nuevo Router tiene la gracia de que implementa un error handler
// para las peticiones asíncronas que cascan, de manera que no se para 
// la aplicación
import Router from 'express-promise-router';
import { login, getAllProducts, createProduct, updateProduct, deleteProduct, getProduct } from './productsController.js';
import { ensureToken } from '../../auth/ensureauth.js';

const router = Router();
router.get('/', (req, res) => res.json({ text: 'API works' }));
router.post('/login', login);
router.get('/products', ensureToken, getAllProducts);
router.post('/products', ensureToken, createProduct);
router.put('/products/:id', ensureToken, updateProduct);
router.delete('/products/:id', ensureToken, deleteProduct);
router.get('/products/:id', ensureToken, getProduct);

router.all('/*', (req, res, next) => {
    res.status(404).json({
        message: 'Endpoint not found: ' + req.originalUrl
    });
})

export default router;

