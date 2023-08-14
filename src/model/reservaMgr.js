import { Reserva } from './mongodb.js';
import { Menu } from './mongodb.js';

function createReservaMgr() {
    class ReservaMgr {
        
        async getReservaByMenuAndUsuario(menu, usuario) {
            const r = await Reserva.findOne({ 
                menu: menu, 
                usuario: usuario 
            }).populate('menu').populate('usuario');
            return r;
        }

        async getAllReservas(fecha, estado) {   
            const r2 = await Reserva.find({
                menu: {
                    $in: await Menu.find({ fecha })
                },
estado
            }).populate('menu').populate('usuario');
            return r2;
        }
        async getReservaById (id) {
            const r = await Reserva.findById(id).populate('menu').populate('usuario');
            return r;
        }
 
        async getDiasConReservaDelUsuario(usuario, mes, anio) {
            const inicioMes = new Date(anio, mes, 1);
            const finMes = new Date(anio, mes+1, 0, 23, 59, 59, 999); // Último día del mes
            
            const fechasDeReserva = await Reserva.aggregate([
                {
                    $lookup: {
                        from: 'menus', // Nombre de la colección de menús (pluralizado)
                        localField: 'menu',
                        foreignField: '_id',
                        as: 'menuInfo'
                    }
                },
                {
                    $unwind: '$menuInfo' // Deshace el array
                },
                {
                    $match: {
                        usuario: usuario,
                        'menuInfo.fecha': {
                            $gte: inicioMes,
                            $lte: finMes
                        }
                    }
                },
                {
                    $group: {
                        _id: {
                            year: { $year: "$menuInfo.fecha" },
                            month: { $month: "$menuInfo.fecha" },
                            day: { $dayOfMonth: "$menuInfo.fecha" }
                        }
                    }
                },
                {
                    $project: {
                        fecha: {
                            $dateFromParts: {
                                year: "$_id.year",
                                month: "$_id.month",
                                day: "$_id.day"
                            }
                        },
                        _id: 0
                    }
                }
            ]);
    
            return fechasDeReserva.map(item => item.fecha.getDate()+1);       
        }
        
        newReserva() {
            const r = new Reserva();
            r.menu = null;
            r.usuario = null;
            r.contenido = '';
            r.tupper = false;
            r.estado = 'noProcesado';
            return r;
        }
        async addReserva (props) {
            if (!props) throw new Error('Missing parameter "Reserva properties"');
            const menu = props.menu;
            const usuario = props.usuario;
            if (!menu || !usuario) throw new Error('Missing properties "menu" or "usuario"');
            const r = await Reserva.findOne({ 
                menu, 
                usuario
            });
            if (r) throw new Error('Ja existeix una reserva per a aquest menú');
            const newReserva = new Reserva();
            newReserva.menu = menu;
            newReserva.usuario = usuario;
            newReserva.contenido = props.contenido;
            newReserva.tupper = props.tupper;
            newReserva.estado = props.estado;
            await newReserva.save();
            return newReserva;
        }
        async updateReserva(props) {
            const updateReserva = await Reserva.findById(props._id);
            if (!updateReserva) throw new Error('No existe ninguna reserva con ese Id: ' + props._id);
            if (props.usuario) updateReserva.usuario = props.usuario;
            if (props.menu) updateReserva.menu = props.menu;
            updateReserva.contenido = props.contenido;
            updateReserva.tupper = props.tupper;
            updateReserva.estado = props.estado;
            await updateReserva.save();
            return updateReserva;
        }
       async deleteReserva(id) {
            await Reserva.findByIdAndDelete(id);
        };
    }
    return new ReservaMgr();
}

const ReservaMgr = createReservaMgr();

export default ReservaMgr;