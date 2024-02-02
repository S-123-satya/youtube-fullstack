import {Router} from "express" 
import { userRegister } from "../controllers/user.controllers.js";
import { userRegisterValidator } from "../validators/user.validators.js";
import { validate } from "../validators/validator.js";

const router=Router();

router.post('/register',userRegisterValidator(),validate,userRegister);

export default router;