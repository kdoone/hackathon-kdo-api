import { Router } from 'express'
import { update } from './differences-update'

const router = Router()

router.post('/', async(req,res) => {
    try {   
        const { deviceId, items } = req.body

        await update(deviceId, items)
        res.send('updated')
    }
    catch(err) {
        res.status(500).send(err)        
    }
})

export const differences = router