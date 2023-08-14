import reservaMgr from '../../../model/reservaMgr.js';
import userMgr from '../../../model/userMgr.js';

export const goComandes = async (req,res) => {
    const estado = req.body.procesado || 'noProcesado';
    const fecha = new Date(new Date().getFullYear(),new Date().getMonth(),new Date().getDate());
    const reservas = await reservaMgr.getAllReservas(fecha, estado);
    res.render('cuina/comandes/comandes',{
        reservas: reservas,
        fecha: formateaFecha(fecha),
        estado:estado
    });
};
export const goDetalle = async (req, res) => {
    const estado = req.body.procesado;
    const fecha = new Date(new Date().getFullYear(),new Date().getMonth(),new Date().getDate());
    const reservaId = req.body.reservaId;
    const reserva = await reservaMgr.getReservaById(reservaId);
    const reservas = await reservaMgr.getAllReservas(fecha, estado);
    res.render('cuina/comandes/comandes', {
        reservas: reservas,
        reserva: reserva,
        fecha: formateaFecha(fecha),
        estado: estado
    })
}
export const doProcesat = async (req, res) => {
    const reservaId = req.body.reservaId;
    const r = await reservaMgr.getReservaById(reservaId);
    r.estado = 'procesado';
    await reservaMgr.updateReserva(r);
    res.redirect('/comandes')
}
const formateaFecha = (f) => {
    const opciones = { year: 'numeric', month: 'long', day: 'numeric' };
    return f.toLocaleDateString('ca-ES', opciones);
};