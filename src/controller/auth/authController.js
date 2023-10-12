import passport from 'passport';
import userMgr from '../../model/userMgr.js';
import menuMgr from '../../model/menuMgr.js';
import reservaMgr from '../../model/reservaMgr.js';

export const goWellcome = async (req, res) => {
    if (!req.user) return res.render('home/home');

    const fecha = new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate());

    if (req.user.rol === 'normal') {
        res.render('home/homeNormal');
    } else if (req.user.rol === 'cuina') {
        const m = await menuMgr.getMenuByDate(fecha);
        const reservas = await reservaMgr.getAllReservas(fecha, 'noProcesado');
        console.log('reservas', reservas)
        const contenidos = reservas.map(r => {
            let o = {};
            if (r.contenido.primer == 1) o.prOpcio1 = 1;
            else o.prOpcio1 = 0;
            if (r.contenido.primer == 2) o.prOpcio2 = 1;
            else o.prOpcio2 = 0;
            if (r.contenido.segon == 3) o.seOpcio1 = 1;
            else o.seOpcio1 = 0;
            if (r.contenido.segon == 4) o.seOpcio2 = 1;
            else o.seOpcio2 = 0;
            if (r.contenido.postre == 5) o.poOpcio1 = 1;
            else o.poOpcio1 = 0;
            if (r.contenido.postre == 6) o.poOpcio2 = 1;
            else o.poOpcio2 = 0;
            return o;
        });
        const totales = contenidos.reduce(function (previous, current) {
            return {
                prOpcio1: previous.prOpcio1 + current.prOpcio1,
                prOpcio2: previous.prOpcio2 + current.prOpcio2,
                seOpcio1: previous.seOpcio1 + current.seOpcio1,
                seOpcio2: previous.seOpcio2 + current.seOpcio2,
                poOpcio1: previous.poOpcio1 + current.poOpcio1,
                poOpcio2: previous.poOpcio2 + current.poOpcio2,
            }
        }, {
            prOpcio1: 0,
            prOpcio2: 0,
            seOpcio1: 0,
            seOpcio2: 0,
            poOpcio1: 0,
            poOpcio2: 0
        });
        res.render('home/homeCuina', {
            totales: totales,
            menu: m
        });
    } else if (req.user.rol === 'admin') {
        res.render('home/homeAdmin');
    } else {
        res.render('home/home');
    }
};

export const goSignup = (req, res) => {
    res.render('home/signup');
};

export const doSignup = async (req, res, next) => {
    try {
        const { email, password, password2, firstName, lastName, phoneNumber } = req.body;
        if (!email || !password || !phoneNumber) {
            return res.render('home/signup', {
                message: {
                    type: 'error',
                    text: 'No se puede crear una cuenta sin un usuario, una contraseña o un numero de telefono'
                }
            });
        }
        if (!password2 | password2 !== password) {
            return res.render('home/signup', {
                message: {
                    type: 'error',
                    text: 'El campo "contraseña" y "Confirmar contraseña" tienen que ser idénticos'
                }
            });
        }

        const newUser = await userMgr.addUser({
            authType: 'local',
            rol: 'normal',
            email, password, firstName, lastName, phoneNumber
        });

        doLoginLocal(req, res, next);
    } catch (err) {
        return res.render('home/signup', {
            message: {
                type: 'error',
                text: err.message
            }
        });
    }
};

export const goLogin = (req, res) => {
    const message = req.session.loginMessage;
    req.session.loginMessage = null;
    res.render('home/login', { message });
};

export const doLoginLocal = (req, res, next) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.render('home/login', {
            message: {
                type: 'error',
                text: 'Hay que especificar usuario y contraseña'
            }
        })
    }
    passport.authenticate('local', {
        successRedirect: '/',
        failureRedirect: '/login'
    })(req, res, next);
};

export const goLoginMicrosoft = (req, res, next) => {
    passport.authenticate('microsoft', {
        // Optionally add any authentication params here
        // prompt: 'select_account'     
    })(req, res, next);
};

export const loginMicrosoftCallback = (req, res, next) => {
    passport.authenticate('microsoft', {
        successRedirect: '/',
        failureRedirect: '/login'
    })(req, res, next);
};

export const goLoginGoogle = (req, res, next) => {
    passport.authenticate('google', {
        scope: ['email', 'profile']
    })(req, res, next);
};

export const loginGoogleCallback = (req, res, next) => {
    passport.authenticate('google', {
        successRedirect: '/',
        failureRedirect: '/login'
    })(req, res, next);
};

export const logout = (req, res, next) => {
    req.logout(err => {
        if (err) return next(err);
        res.redirect('/');
    });
};

export const goForgotPassword = (req, res) => {
    res.render('home/forgotpassword', { message: {} });
};

export const doForgotPassword = async (req, res) => {
    const { email } = req.body;
    if (!email) {
        return res.render('home/forgotpassword', {
            message: {
                type: 'error',
                text: 'Para recuperar la contraseña debe especificar su correo'
            }
        })
    }
    const u = await userMgr.getUserByEmail(email);
    if (!u) {
        return res.render('home/forgotpassword', {
            message: {
                type: 'warn',
                text: `No hay ninguna cuenta registrada a nombre de ${email}`
            }
        });
    }
    if (u.authType !== 'local') {
        return res.render('home/forgotpassword', {
            message: {
                type: 'error',
                text: `Este usuario utiliza la autenticación de ${u.authType}. No tiene contraseña en esta aplicación.`
            }
        });
    }
    return res.render('home/login', {
        message: {
            type: 'ok',
            text: `Hemos enviado un correo a esa dirección con un enlace para restablecer la contraseña`
        }
    });
};

export const goProfile = (req, res) => {
    res.render('home/profile', { message: {} });
};
export const goProfileEdit = (req, res) => {
    res.render('home/profile-edit', { message: {} });
};
export const doProfileEdit = async (req, res) => {
    try {
        const { Nombre, Cognoms, _id, pwd1, pwd2, Telefon } = req.body;

        // Validar pwd1 === pwd2

        const updatedUser = await userMgr.updateUser({
            _id: _id,
            password: pwd1,
            firstName: Nombre,
            lastName: Cognoms,
            phoneNumber: Telefon
        });
        req.user = updatedUser;
        res.redirect('/profile');
        // res.render('home/profile', { message: {
        //     type: 'ok',
        //     text: 'Modificació acabada amb exit'
        // } })
    } catch (err) {
        console.error(err)
        res.render('home/profile', {
            message: {
                type: 'error',
                text: "La modificació no s'ha pogut realitzar"
            }
        })
    }
};
const formateaFecha = (f) => {
    const opciones = { year: 'numeric', month: 'long', day: 'numeric' };
    return f.toLocaleDateString('ca-ES', opciones);
};