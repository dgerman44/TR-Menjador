import menuMgr from '../../model/menuMgr.js';
import reservaMgr from '../../model/reservaMgr.js';

export const goReservaAnual = async (req, res) => {
    const dia = req.session.dia || new Date().getDate();
    const mes = req.session.mes || new Date().getMonth();
    const anio = req.session.anio || new Date().getFullYear();
    const diaSel = new Date(anio, mes, dia);
    const m = await menuMgr.getMenuByDate(diaSel);
    let reserva = m ? await reservaMgr.getReservaByMenuAndUsuario(m, req.session.passport.user) : null;
    const diasConReserva = await reservaMgr.getDiasConReservaDelUsuario(req.session.passport.user, mes, anio);
    const diasConMenu = await menuMgr.getDiasConMenus(mes, anio);
    res.render('normal/reserva', {
        reserva,
        menu: m,
        mode: 'view',
        diasConMenu: diasConMenu,
        diasConReserva: diasConReserva,
        dia: dia,
        mes: mes + 1,
        anio: anio
    });
};
export const goNewReserva = async (req, res) => {
    const { dia, mes, anio } = req.body;
    const diaSel = new Date(anio, mes - 1, dia);
    const m = await menuMgr.getMenuByDate(diaSel);
    const diasConReserva = await reservaMgr.getDiasConReservaDelUsuario(req.user, mes - 1, anio);
    const diasConMenu = await menuMgr.getDiasConMenus(mes - 1, anio);
    let reserva = await reservaMgr.getReservaByMenuAndUsuario(m, req.user);
    var mode = 'view';
    if (!reserva) {
        reserva = reservaMgr.newReserva();
        reserva.menu = m;
        reserva.usuario = req.user;
        req.session.reserva = reserva;
        mode = 'edit';
    }
    res.render('normal/reserva', {
        mode,
        reserva,
        menu: m,
        diasConMenu: diasConMenu,
        diasConReserva: diasConReserva,
        dia,
        mes,
        anio
    });
}
export const goPago = async (req, res) => {
    const { primer, segon, postre, tupper, totalPrice } = req.body;
    const reserva = req.session.reserva;
    reserva.contenido = { primer, segon, postre };
    if (tupper) reserva.tupper = true;
    res.render('normal/pago',{
        precioTotal: totalPrice
    });
}
export const doPagoCompletado = async (req, res) => {
    const reserva = req.session.reserva;
    reserva.menu.fecha = new Date(reserva.menu.fecha);

    await reservaMgr.addReserva(reserva);
    req.session.reserva = null;
    req.session.dia = reserva.menu.fecha.getDate();
    req.session.mes = reserva.menu.fecha.getMonth();
    req.session.anio = reserva.menu.fecha.getFullYear();
    res.redirect('/reservaAnual');
}
export const goPagoCancelado = async (req, res) => {
    req.session.reserva = null;
    res.redirect('/reservaAnual');
}
export const doCancelaPago = async (req, res) => {
    const idReserva = req.body.idReserva;
    await reservaMgr.deleteReserva(idReserva);
    res.redirect('/reservaAnual');
}