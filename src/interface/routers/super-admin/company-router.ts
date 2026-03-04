import { Router } from 'express';
import { companyManagementController } from '../../../infrastructure/DIContainer/index.js';

const router = Router();

router.get('/',               companyManagementController.getAllCompanies);
router.get('/:id',            companyManagementController.getCompanyById);
router.patch('/:id/suspend',  companyManagementController.suspendCompany);
router.patch('/:id/activate', companyManagementController.activateCompany);
router.delete('/:id/delete',   companyManagementController.deleteCompany);

export default router;