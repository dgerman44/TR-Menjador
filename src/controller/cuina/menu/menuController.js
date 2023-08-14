import menuMgr from '../../../model/menuMgr.js';

export const goMenuAnual = async (req, res) => {
    const diasConMenu = await menuMgr.getDiasConMenus(new Date().getMonth(), new Date().getFullYear());    
    res.render('cuina/menu/menuAnual', {
        diasConMenu: diasConMenu,
        dia: new Date().getDate(),
        mes: new Date().getMonth()+1,
        anio: new Date().getFullYear()
    });
};
export const goMenuDia = async (req, res) => {
    const {dia, mes, anio} = req.body;
    const fecha = new Date (anio, mes-1, dia);
    const m = await menuMgr.getMenuByDate(fecha);
    let newMenu = null;
    const diasConMenu = await menuMgr.getDiasConMenus(mes-1, anio); 
    res.render('cuina/menu/menuAnual', {
        diasConMenu: diasConMenu,
        menu: m, 
        dia, mes, anio,
        fechaFormateada: formateaFecha(fecha),
        mode: 'view'
    });
};
export const goNewMenu = async (req, res) => {
    const {dia, mes, anio} = req.body;
    const fecha = new Date (anio, mes-1, dia);
    const newMenu = menuMgr.newMenu()
    newMenu.fecha = fecha;
    const diasConMenu = await menuMgr.getDiasConMenus(mes-1, anio);  
    res.render('cuina/menu/menuAnual', {
        diasConMenu: diasConMenu,
        menu: newMenu,
        dia, mes, anio,
        fechaFormateada: newMenu.formateaFecha(fecha),
        mode: 'edit'
    });
};
export const goEditMenu = async (req,res) => {
    const {dia, mes, anio} = req.body;
    const fecha = new Date (anio, mes-1, dia);
    let m = await menuMgr.getMenuByDate(fecha);
    const diasConMenu = await menuMgr.getDiasConMenus(mes-1, anio);
    res.render('cuina/menu/menuAnual', {
        diasConMenu: diasConMenu,
        menu: m,
        dia, mes, anio,
        fechaFormateada: m.formateaFecha(fecha),
        mode: 'edit'
    })

}
export const doUpdateMenu = async (req,res) => {
    const {fecha, prOpcio1, prOpcio2, seOpcio1, seOpcio2, poOpcio1, poOpcio2}= req.body;
    const dFecha = new Date(fecha);
    const props = req.body;
    props.fecha = dFecha;
    let m = await menuMgr.getMenuByDate(fecha);
    if (!m) {
        m = await menuMgr.addMenu(props);
    } else {
        m = await menuMgr.updateMenu(props);
    };
    const diasConMenu = await menuMgr.getDiasConMenus(dFecha.getMonth(), dFecha.getFullYear());
    res.render('cuina/menu/menuAnual', {
        menu: m,        
        diasConMenu: diasConMenu,
        dia: m.fecha.getDate(), 
        mes: m.fecha.getMonth()+1, 
        anio: m.fecha.getFullYear(),
        fechaFormateada: m.formateaFecha(m.fecha),
        mode: 'view'
    });

}

const formateaFecha = (f) => {
    const opciones = { year: 'numeric', month: 'long', day: 'numeric' };
    return f.toLocaleDateString('ca-ES', opciones);
};