import { Menu } from './mongodb.js';

function createMenuMgr() {
    class MenuMgr {

        async getMenuByDate(fecha) {
            const m = await Menu.findOne({ fecha });
            return m;
        };
        async getMenuById(Id) {
            const m = await Menu.findOne({ Id });
            return m;
        };
        async getDiasConMenus(mes, anio) {
            const inicioMes = new Date(anio, mes, 1);
            const finMes = new Date(anio, mes+1, 0, 23, 59, 59, 999); // Último día del mes
            
            const fechasDeMenu = await Menu.aggregate([
                {
                    $match: {
                        fecha: {
                            $gte: inicioMes,
                            $lte: finMes
                        }
                    }
                },
                {
                    $group: {
                        _id: {
                            year: { $year: "$fecha" },
                            month: { $month: "$fecha" },
                            day: { $dayOfMonth: "$fecha" }
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
    
            return fechasDeMenu.map(item => item.fecha.getDate()+1);
   
            //const fechas = [new Date(2023, 7, 27), new Date(2023,7,28), new Date(2023,7,29)];//this.Menu.findMany();
            //return fechas;
        };      
        newMenu() {
            const m = new Menu();
            m.fecha = Date.now;
            m.prOpcio1 = '';
            m.prOpcio2 = '';
            m.seOpcio1 = '';
            m.seOpcio2 = '';
            m.poOpcio1 = 'Fruita';
            m.poOpcio2 = 'Làctic';
            return m;
        }
        async addMenu(props) {
            if (!props) throw new Error('Missing parameter "menu properties"');
            const fecha = props.fecha;
            if (!fecha || !props.prOpcio1 || !props.prOpcio2 || !props.seOpcio1 || !props.seOpcio2 || !props.poOpcio1 || !props.poOpcio2)
                throw new Error('El menu esta incompert');
            const m = await Menu.findOne({ fecha });
            if (m) throw new Error('Ja existeix un menu en aquest dia');
            const newMenu = new Menu();
            newMenu.fecha = fecha;
            newMenu.prOpcio1 = props.prOpcio1;
            newMenu.prOpcio2 = props.prOpcio2;
            newMenu.seOpcio1 = props.seOpcio1;
            newMenu.seOpcio2 = props.seOpcio2;
            newMenu.poOpcio1 = props.poOpcio1;
            newMenu.poOpcio2 = props.poOpcio2;
            await newMenu.save();
            return newMenu;
        }
        async updateMenu(props) {
            const updateMenu = await Menu.findOne({ fecha: props.fecha });
            if (!updateMenu) throw new Error('No existeix cap menu aquesta data ' + props.fecha);
            updateMenu.prOpcio1 = props.prOpcio1;
            updateMenu.prOpcio2 = props.prOpcio2;
            updateMenu.seOpcio1 = props.seOpcio1;
            updateMenu.seOpcio2 = props.seOpcio2;
            updateMenu.poOpcio1 = props.poOpcio1;
            updateMenu.poOpcio2 = props.poOpcio2;
            await updateMenu.save();
            return updateMenu;
        }
        async deleteMenu(id) {
            await Menu.findByIdAndDelete(id);
        };
    }
    return new MenuMgr();
}


const MenuMgr = createMenuMgr();

export default MenuMgr;