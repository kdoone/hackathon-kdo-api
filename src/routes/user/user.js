import { Router } from 'express'
import { saveUser } from './save-user'
import { findUser } from './find-user'
import { differencesCreate, differencesFind, defaultDifferences } from '../differences'

const router = Router()

const findDifferenceAndSend = async(res, deviceId) => {
    const foundDifference = await differencesFind(deviceId)
    res.send(foundDifference)
}

router.post('/', async(req,res) => {
    try {               
        const { deviceId, version } = req.body
        const isUserWithId = await findUser(deviceId)

        if(!isUserWithId) {

            await saveUser(deviceId)        
            await differencesCreate(deviceId, version, defaultDifferences)
            await findDifferenceAndSend(res, deviceId)
            return
        }
                
        findDifferenceAndSend(res, deviceId)        
    }
    catch(err) {
        throw(err)
    }
})

export const user = router

