import express from 'express'


import { ctrlWrapper } from '../utils/ctrlWrapper.js';
import { validateBody } from '../middlewares/validateBody.js';
import { registerUserSchema, loginUserSchema, requestResetEmailSchema, resetPasswordSchema } from '../validation/auth.js';
import { registerUserCtrl, loginUserCtrl, logoutUserCtrl, refreshTokenCtrl, requestSendResetEmailCtrl, resetPasswordCtrl } from '../controllers/auth.js';

const router = express.Router();
const jsonParser = express.json();


router.post('/register', jsonParser, validateBody(registerUserSchema), ctrlWrapper(registerUserCtrl))
router.post('/login', jsonParser, validateBody(loginUserSchema), ctrlWrapper(loginUserCtrl))
router.post('/logout', ctrlWrapper(logoutUserCtrl));
router.post('/refresh', ctrlWrapper(refreshTokenCtrl))
router.post('/send-reset-email', jsonParser, validateBody(requestResetEmailSchema), ctrlWrapper(requestSendResetEmailCtrl))
router.post('/reset-pwd', jsonParser, validateBody(resetPasswordSchema), ctrlWrapper(resetPasswordCtrl))
export default router;