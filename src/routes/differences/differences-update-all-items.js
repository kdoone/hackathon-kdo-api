import { Differences } from "../../schemas";
import { defaultDifferences } from "./default-differences";

export const updateAllItems = (updateId) => {    
        
    const toUpdate = {
        'updateId': updateId
    }                    
    return Differences.updateMany(toUpdate, {
        items: defaultDifferences
    })
}