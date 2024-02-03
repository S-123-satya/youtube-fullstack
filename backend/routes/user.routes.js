import {Router} from "express" 
import { userLogin, userLogout, userRegister } from "../controllers/user.controllers.js";
import { userRegisterValidator } from "../validators/user.validators.js";
import { validate } from "../validators/validator.js";

const router=Router();

router.post('/register',userRegisterValidator(),validate,userRegister);
router.post('/login',userLoginValidator(),validate,userLogin);

/**
 * @description secure routes => secured by refresh and access token
 */

router.get('/logout',userLogout); // => should pass through tokenExtract middleware
router.post('/register',userRegisterValidator(),validate,userRegister);
router.post('/register',userRegisterValidator(),validate,userRegister);
router.post('/register',userRegisterValidator(),validate,userRegister);
router.post('/register',userRegisterValidator(),validate,userRegister);

export default router;