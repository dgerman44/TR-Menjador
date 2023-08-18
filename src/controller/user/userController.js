import userMgr from '../../model/userMgr.js';

export const goUserManagement = async (req, res) => {
    const users = await userMgr.getAllUsers();
    res.render('user/userList', {
        users
    });
};
export const goNewUser = (req, res) => {
    const u = userMgr.newUser();
    res.render('user/newEditUser', {
        user: u
    });
};
export const doNewUser = async (req, res) => {
    const u = req.body;
    try {        
        const { email, password, password2, firstName, lastName, phoneNumber, rol } = req.body;
        if (!email || !password || !phoneNumber) {
            return res.render('user/newEditUser', {
                user: u,
                message: {
                    type: 'error',
                    text: "Els camps 'correu', 'contrassenya' i 'numero de telèfon' son obigatoris"
                }
            });
        }
        if (rol === '0') {
            return res.render('user/newEditUser', {
                user: u,
                message: {
                    type: 'error',
                    text: 'Ha de tenir un rol'
                }
            });
        }
        if (!password2 | password2 !== password) {
            return res.render('user/newEditUser', {
                user: u,
                message: {
                    type: 'error',
                    text: 'El camp "contrassenya" i "Confirmar contrassenya" han de ser idèntics'
                }
            });
        }
        const newUser = await userMgr.addUser({
            authType: 'local',
            email, password, firstName, lastName, phoneNumber, rol
        });

        res.redirect('/userManagement');
    } catch (err) {
        return res.render('user/newEditUser', {
            user: u,
            message: {
                type: 'error',
                text: err.message
            }
        });
    };
};
export const doDeleteUser = async (req, res) => {
    const userId = req.query.id;
    await userMgr.deleteUser(userId);
    res.redirect('/userManagement');
};
export const goEditUser = async (req, res) => {
    const userId = req.query.id;
    const u = await userMgr.getUserById(userId);
    res.render('user/newEditUser', {
        user: u
    })
};
export const doUpdateUser = async (req, res) => {
    const u = req.body;
    try {        
        const { _id, email, password, password2, firstName, lastName, phoneNumber, rol } = req.body;
        if (!email || !phoneNumber) {
            return res.render('user/newEditUser', {
                user: u,
                message: {
                    type: 'error',
                    text: "Els camps 'correu' i 'numero de telèfon' son obigatoris"
                }
            });
        }
        if (rol === '0') {
            return res.render('user/newEditUser', {
                user: u,
                message: {
                    type: 'error',
                    text: 'Ha de tenir un rol'
                }
            });
        }
        if (password2 !== password) {
            return res.render('user/newEditUser', {
                user: u,
                message: {
                    type: 'error',
                    text: 'El camp "contrassenya" i "Confirmar contrassenya" han de ser idèntics'
                }
            });
        }

        const updateUser = await userMgr.updateUser({
            _id, email, password, firstName, lastName, phoneNumber, rol
        });

        res.redirect('/userManagement');
    } catch (err) {
        return res.render('user/newEditUser', {
            user: u,
            message: {
                type: 'error',
                text: err.message
            }
        });
    };
};
