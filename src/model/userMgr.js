import { User } from './mongodb.js';

function createUserMgr() {
    class UserMgr {
        
        async getUserByEmail(email) {
            const u = await User.findOne({ email });
            return u;
        }
        async getUserById(id) {
            const u = await User.findById(id);
            return u;
        }
        newUser() {
            const u = new User();
            u.firstName = '';
            u.lastName = '';
            u.email = '';
            u.password = '';
            u.phoneNumber = '';
            u.rol = '';
            u.authType = '';
            return u;
        }
        async addUser(props) {
            if (!props) throw new Error('Missing parameter "user properties"');
            const email = props.email;
            const authType = props.authType;
            if (!email || !authType) throw new Error('Missing properties "email" and "authType"');
            if (authType === 'local' && !props.password) throw new Error('Missing "password" for local authType');
            const u = await User.findOne({ email });
            if (u) throw new Error('Ya existe un usuario registrado con ese eMail');
            const newUser = new User();
            newUser.email = email;
            newUser.password = authType === 'local' ? newUser.cifrarPassword(props.password) : null;
            newUser.authType = authType;
            newUser.firstName = props.firstName || null;
            newUser.rol = props.rol;
            newUser.lastName = props.lastName || null;
            newUser.phoneNumber = props.phoneNumber || null;
            await newUser.save();
            return newUser;
        }
        async updateUser(props) {
            const updateUser = await User.findById(props._id);
            if (!updateUser) throw new Error('No existe ningun usuario con ese Id: ' + props._id);
            if (props.email) updateUser.email = props.email;
            if (props.password) updateUser.password = updateUser.cifrarPassword(props.password);
            updateUser.firstName = props.firstName || null;
            updateUser.lastName = props.lastName || null;
            updateUser.phoneNumber = props.phoneNumber || null;
            updateUser.rol = props.rol || 'normal';
            await updateUser.save();
            return updateUser;
        }
        async getAllUsers() {
            const users = await User.find();
            return users;
        }
        async deleteUser(id) {
            await User.findByIdAndDelete(id);
        };
    }
    return new UserMgr();
}


const UserMgr = createUserMgr();

export default UserMgr;