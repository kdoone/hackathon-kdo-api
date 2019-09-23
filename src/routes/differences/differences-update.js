import { Differences } from "../../schemas";
const generateWhatUpdate = (items) => ({ 
    '$set': { items }
})

export const update = (deviceId, updateObj) => {    
        
    const toUpdate = {
        'deviceId': deviceId
    }            
    return Differences.updateOne(toUpdate, generateWhatUpdate(updateObj))
}