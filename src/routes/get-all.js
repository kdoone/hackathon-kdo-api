import { Router } from 'express'
const router = Router()

router.get('/', (req,res) => {
    console.log('hello')
})

export const getAll = router