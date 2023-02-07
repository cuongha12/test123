import userController from "../controller/userController";
import express from 'express';
import verifyToken from "../middleware/verifyToken";
import { isAdmin } from "../middleware/role";
const router = express.Router();

const authRouter = (app) => {
    router.get('/', verifyToken, isAdmin,  userController.read)
    router.post('/register', verifyToken, isAdmin, userController.create)
    router.post('/login', userController.login)
    router.put('/user/:id', verifyToken, isAdmin, userController.update)
    router.delete('/user/:id', verifyToken, isAdmin, userController.delete)
    router.delete('/logout', userController.logout)
    return app.use('/auth', router);
}

export default authRouter