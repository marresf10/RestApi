import { Router } from "express";
const router = Router();
import { authJwt } from '../middlewares';

//export default router;
import * as productsCtrl from '../controllers/products.controller';
import { verifyToken } from "../middlewares/authJwt";

//Establecer la ruta de los productos mediante el método GET
router.get('/', productsCtrl.getProducts);
router.post('/',[authJwt.verifyToken,authJwt.isAdmin],productsCtrl.createProduct);
router.get('/:productId', productsCtrl.getProductById);
router.put('/:productId',[authJwt.verifyToken,authJwt.isAdminOrModerator], productsCtrl.updateProductById);
router.delete('/:productId',[authJwt.verifyToken,authJwt.isAdminOrModerator], productsCtrl.deleteProductById);

export default router;