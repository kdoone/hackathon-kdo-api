import { Router } from 'express'
const router = Router()

import { user } from './user';
import { differences } from './differences';

router.use('/user', user)
router.use('/differences', differences)

export const allRoutes = router