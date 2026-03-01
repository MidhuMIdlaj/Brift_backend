import { Router }                from 'express';
import { registrationController } from '../../infrastructure/DIContainer/index.js';

const router = Router();

router.get('/modules', registrationController.getModules);

router.post('/company', registrationController.registerCompany);

router.post('/payment/initiate', registrationController.initiatePayment);

router.post('/payment/verify', registrationController.verifyPayment);

export default router;