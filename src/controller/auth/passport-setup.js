import passport from 'passport';
import LocalStrategy from 'passport-local';
import MicrosoftStrategy from 'passport-microsoft';
import GoogleStrategy from 'passport-google-oauth20';
import UserMgr from '../../model/userMgr.js';
import { cfg } from '../../config.js'


passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
    const user = await UserMgr.getUserById(id);
    done(null, user);
});

passport.use('local', new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true
}, async (req, email, password, done) => {
    const u = await UserMgr.getUserByEmail(email);
    let errorMessage = null;
    if (!u) errorMessage = 'Usuario y/o contraseña incorrectos';
    else if (u.authType !== 'local') errorMessage = 'Este usuario se debe autenticar a través de su cuenta de ' + u.authType;
    else if (!u.compararPassword(password)) errorMessage = 'Usuario y/o contraseña incorrectos';

    if (errorMessage) {
        req.session.loginMessage = req.session.loginMessage || {
            type: 'error',
            text: errorMessage
        };
        return done(null, false);
    }
    done(null, u);
}));

passport.use(new MicrosoftStrategy.Strategy({
    clientID: cfg.microsoftAuth.MICROSOFT_GRAPH_CLIENT_ID,
    clientSecret: cfg.microsoftAuth.MICROSOFT_GRAPH_CLIENT_SECRET,
    callbackURL: cfg.general.APP_URL + '/login/microsoft/callback',
    scope: ['user.read'],
    passReqToCallback: true
},
    async function (req, accessToken, refreshToken, profile, done) {
        const email = profile._json.userPrincipalName;
        let u = await UserMgr.getUserByEmail(email);
        if (!u) {
            // El usuario ha sido autenticado correctamente por Microsoft,
            // pero no se encuentra en la BBDD de la aplicación
            // ==> Lo añadimos a la BBDD
            const firstName = profile.name.givenName;
            const lastName = profile.name.familyName;
            u = await UserMgr.addUser({
                authType: 'microsoft',
                rol: 'normal',
                email, firstName, lastName
            });

            return done(null, u);
        }
        done(null, u);

    }
));

passport.use(new GoogleStrategy.Strategy({
    clientID: cfg.googleAuth.GOOGLE_CLIENT_ID,
    clientSecret: cfg.googleAuth.GOOGLE_CLIENT_SECRET,
    callbackURL: cfg.general.APP_URL + '/login/google/callback',
    passReqToCallback: true
},
    async function (req, accessToken, refreshToken, profile, done) {
        const email = profile._json.email;
        const firstName = profile.name.givenName;
        const lastName = profile.name.familyName;
        let u = await UserMgr.getUserByEmail(email);
        if (!u) {
            // El usuario ha sido autenticado correctamente por Google,
            // pero no se encuentra en la BBDD de la aplicación
            // ==> Lo añadimos a la BBDD
            u = await UserMgr.addUser({
                authType: 'google',
                rol: 'normal',
                email, firstName, lastName
            });

            return done(null, u);
        }
        done(null, u);

    }
));

console.log('passport initialized');