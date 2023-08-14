import productMgr from "../../../model/productMgr.js";
import UserMgr from "../../../model/userMgr.js";

export const login = async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) return responseError(res, "Missing credentials", 404);
    const u = await UserMgr.getUserByEmail(email);
    if (!u) return responseError(res, "Wrong credentials", 403);
    if (u.authType !== 'local') return responseError(res, `The specified user cannot use the API. It does not have a password because it authenticates through its ${u.authType} account`, 403);
    if (!u.compararPassword(password)) return responseError(res, "Wrong credentials", 403);    

    res.json({ token: u.createToken() });
};

export const getAllProducts = async (req, res) => {
    const products = await productMgr.getAll();
    res.json(products);
};

export const getProduct = async (req, res) => {
    const product = await productMgr.find(req.params.id);
    if (!product) return responseError(res, "Producto no encontrado.", 404);
    res.json(product);
};

export const createProduct = async (req, res) => {
    const newProduct = await productMgr.add(req.body);
    res.json(newProduct);
};

export const updateProduct = async (req, res) => {
    const newData = req.body;
    const updatedProduct = await productMgr.update(req.params.id, newData);
    if (!updatedProduct) return responseError(res, "Producto no encontrado.", 404);
    res.json(updatedProduct);
};

export const deleteProduct = async (req, res) => {
    const deletedProduct = await productMgr.delete(req.params.id);
    if (!deletedProduct) return responseError(res, "Producto no encontrado.", 404);
    res.sendStatus(204);
};

function responseError(res, message, status) {
    if (!message && !status) throw new Error('One of "message" or "status" must be not null to respond something to the client');
    if (!message) return res.sendStatus(status);
    if (!status) return res.json({
        errorMessage: message
    });
    res.status(status).json({
        errorMessage: message 
    })
}
