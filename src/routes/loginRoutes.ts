import app, {
  Router,
} from 'express';
const router: Router = app.Router();
import { login } from '../controllers/loginController';

router.post('/', login);

export default router;