import { Differences } from "../../schemas";
import { defaultDifferences } from "./default-differences";

export const updateAllItems = (version) => {    
        
    const toUpdate = {
        'version': version
    }                    
    return Differences.updateOne(toUpdate, {
        items: defaultDifferences
    })
}