import { Router } from 'express'
import { update } from './differences-update'
import { updateAllItems } from './differences-update-all-items'

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

router.post('/update-all', async(req,res) => {
    try {        
        await updateAllItems(0)
        res.send('updated-all')
    }
    catch(err) {
        console.log(err)
    }
})

export const differences = router