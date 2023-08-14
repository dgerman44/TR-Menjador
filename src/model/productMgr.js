import { pool } from './mysql.js';

function createProductMgr() {
    class ProductMgr {

        constructor() { }

        async getAll() {
            const [rows] = await pool.query('SELECT * from products');
            return rows;
        }

        async find(id) {
            const [rows] = await pool.query('SELECT * from products WHERE id=?', [id]);
            return rows.length <= 0 ? null : rows[0];
        }

        async add(p) {
            const [rows] = await pool.query('INSERT into products (name, price) VALUES (?, ?)', [p.name, p.price]);
            const newProduct = { ...p, "id": rows.insertId }
            return newProduct;
        }

        async update(id, newData) {
            const product = await this.find(id);
            if (!product) return null;
            const updatedProduct = { ...product, ...newData };            
            const [result] = await pool.query('UPDATE products SET name=?, price=? WHERE id=?', [updatedProduct.name, updatedProduct.price, updatedProduct.id]);
            return result.affectedRows <= 0 ? null : updatedProduct;
        }

        async delete(id) {
            const deletedProduct = await this.find(id);
            if (!deletedProduct) return null;
            const [result] = await pool.query('DELETE from products WHERE id=?', [deletedProduct.id]);
            return result.affectedRows <= 0 ? null : deletedProduct;
        }
    }

    return new ProductMgr();
}

const productMgr = createProductMgr();

export default productMgr;


