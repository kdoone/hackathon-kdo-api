import { Differences } from "../../schemas";

const pushToUpdateObj = (item, obj, itemId) => {
    if(item !== null) {
        obj.$set[`items.${itemId}.life`] = item
    }
}

const generateWhatUpdate = (updateObj) => {

    const { 
        itemId,  
        life = null,
        hint = null,
        isPassed = null,
        points = null
    } = updateObj;

    let whatUpdate = { '$set': {} }
    
    pushToUpdateObj(life, whatUpdate, itemId)
    pushToUpdateObj(hint, whatUpdate, itemId)
    pushToUpdateObj(isPassed, whatUpdate, itemId)
    pushToUpdateObj(points, whatUpdate, itemId)

    return whatUpdate
}

export const update = (deviceId, updateObj) => {    
        
    const toUpdate = {
        'deviceId': deviceId
    }            
    return Differences.updateMany(toUpdate, generateWhatUpdate(updateObj))
}