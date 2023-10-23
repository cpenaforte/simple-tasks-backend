import app, {
    Router,
} from 'express';
const router: Router = app.Router();
import {
    login, logout,
} from '../controllers/loginController';

router.post('/login', login);
router.post('/logout', logout);

export default router;