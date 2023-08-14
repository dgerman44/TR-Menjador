import express from 'express';
import * as eta from 'eta';
import morgan from 'morgan';
import path from 'path';
import { fileURLToPath } from 'url';

import uiRoutes from './controller/uiRoutes.js';
import homeRoutes from './controller/auth/authRoutes.js';
import userRoutes from './controller/user/userRoutes.js';
import comandesRoutes from './controller/cuina/comandes/comandesRoutes.js';
import menuRoutes from './controller/cuina/menu/menuRoutes.js';
import reservaRoutes from './controller/normal/reservaRoutes.js';
import { cfg } from './config.js';
import passport from 'passport';
import session from 'express-session';

import './model/mongodb.js';
import './controller/auth/passport-setup.js';
import morgan_custom from './helpers/morgan-custom.js';

const app = express();

// settings
app.set('rootDir', path.dirname(fileURLToPath(import.meta.url)));
app.set('view engine', 'eta'); // Esto le dice a Express que utilice el motor de plantillas de Eta
app.set('views', path.join(app.get('rootDir'), 'view')); // Esto le dice a la 'view engine' la ubicación de las plantillas
app.engine("eta", eta.renderFile);
app.set("view cache", true);

// static content
app.use('/public', express.static(path.join(app.get('rootDir'), 'view', 'public')));

// middlewares
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(morgan(morgan_custom));
app.use(session({
    secret: 'asdfasdfasdfasdf',
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
app.use((req, res, next) => {
    // Si hay un usuario autenticado, ponemos un objeto en la response
    // que podrá ser usado en cualquier render.
    res.locals.currentUser = req.user;
    next();
});

// routes
app.use(homeRoutes);
app.use(uiRoutes);
app.use(userRoutes);
app.use(comandesRoutes);
app.use(menuRoutes);
app.use(reservaRoutes);

app.all('/*', (req, res) => {
    res.status(404).send('404 Page not found: ' + req.originalUrl);
});

app.listen(cfg.general.PORT, () => {
    console.log(`Server on port ${cfg.general.PORT}`);
});
