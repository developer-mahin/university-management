import { Router } from 'express';
import { adminController } from './admin.controller';
import validateRequest from '../../middleware/validation';
import { AdminSchemaValidation } from './admin.validation';

const router = Router();

router.get('/', adminController.getAllAdmins);
router.get('/:id', adminController.getSingleAdmin);
router.patch(
  '/:id',
  validateRequest(AdminSchemaValidation.updateAdminSchema),
  adminController.updateAdmin,
);
router.delete('/:id', adminController.deleteAdmin);

export const adminRoutes = router;
