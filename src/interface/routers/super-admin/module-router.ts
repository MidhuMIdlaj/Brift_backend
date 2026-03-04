import { Router } from 'express';
import { moduleManagementController } from '../../../infrastructure/DIContainer/index.js';

const router = Router();

router.get('/',       moduleManagementController.getAllModules);
router.get('/:id',    moduleManagementController.getModuleById);
router.post('/add',      moduleManagementController.addModule);
router.patch('/:id/edit',  moduleManagementController.editModule);
router.delete('/:id/delete', moduleManagementController.deleteModule);

export default router;