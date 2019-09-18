import { Router } from 'express'
const router = Router()

import { getAll } from './get-all'

router.use('/all', getAll);

export const allRoutes = router

