import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import {cfg} from '../config.js'


mongoose.set('strictQuery', true);
mongoose.connect(cfg.mongodb.URI, {})
    .then(db => console.log('MongoDB is connected'))
    .catch(err => console.log(err));

const userSchema = new mongoose.Schema({
    email: String,
    password: String,
    authType: String,
    firstName: String,
    lastName: String,
    phoneNumber: String,
    rol: String,
    estado: String
});
userSchema.methods.cifrarPassword = (password) => {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(10));
};

userSchema.methods.compararPassword = function (password) {
    return bcrypt.compareSync(password, this.password);
};

const menuSchema = new mongoose.Schema({
    fecha: Date,
    prOpcio1: String,
    prOpcio2: String,
    seOpcio1: String,
    seOpcio2: String,
    poOpcio1: String,
    poOpcio2: String
});
menuSchema.methods.formateaFecha = function () {
    const opciones = { year: 'numeric', month: 'long', day: 'numeric' };
    return this.fecha.toLocaleDateString('ca-ES', opciones);
}

const reservaSchema = new mongoose.Schema({
    menu: { type: mongoose.Schema.Types.ObjectId, ref: 'Menu' },
    usuario: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    contenido: Object,
    tupper: Boolean,
    estado: String
});
reservaSchema.methods.getPrimer = function () {
    return this.contenido.primer == 1 ? 
            this.menu.prOpcio1 : 
            this.contenido.primer == 2 ? 
                    this.menu.prOpcio2 : 
                    undefined;
}
reservaSchema.methods.getSegon = function () {
    return this.contenido.segon == 3 ? 
            this.menu.seOpcio1 : 
            this.contenido.segon == 4 ? 
                    this.menu.seOpcio2 : 
                    undefined;
}
reservaSchema.methods.getPostre = function () {
    return this.contenido.postre == 5 ? 
            this.menu.poOpcio1 : 
            this.contenido.postre == 6 ? 
                    this.menu.poOpcio2 : 
                    undefined;
}


export const User = mongoose.model('User', userSchema);
export const Menu = mongoose.model('Menu', menuSchema);
export const Reserva = mongoose.model('Reserva', reservaSchema);
