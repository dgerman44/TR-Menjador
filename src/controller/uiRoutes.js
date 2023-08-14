// import {Router} from 'express';
// EL módulo 'express-promise-router' extiende el Router de express.
// Este nuevo Router tiene la gracia de que implementa un error handler
// para las peticiones asíncronas que cascan, de manera que no se para 
// la aplicación
import Router from 'express-promise-router';
import axios from 'axios';
import { ensureAuth } from './auth/ensureauth.js';

const router = Router();

router.get('/dashboard', ensureAuth, (req, res) => {
    res.render('dashboard', {});
});

router.get('/posts', ensureAuth, async (req, res) => {
    const response = await axios.get('https://jsonplaceholder.typicode.com/posts');
    res.render('posts', { posts: response.data });
});

router.get('/products', ensureAuth, async (req, res) => {
    try {
        const currentUser = req.user;
        const token = currentUser.createToken();
        const response = await axios.get('http://localhost:3000/api/products', {
            headers: { "Authorization" : "Bearer " + token }
        });
        res.render('products', { products: response.data });
    } catch (err) {
        return res.render('products', {
            products: [],
            message: {
                type: 'error',
                text: 'Error recuperando la lista de productos: ' + err.message
            }
        })
    }
});

router.get('/about', (req, res) => {
    res.render('about', {});
});

router.get('/contact', ensureAuth, (req, res) => {
    res.render('contact', {});
});

export default router;

