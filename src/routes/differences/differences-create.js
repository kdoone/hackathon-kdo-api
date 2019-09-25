import { Differences } from "../../schemas";

export const differencesCreate = async(deviceId, items) => {
    try {
        const differencesToCreate = Differences({
            deviceId,            
            items,
            updateId: 0
        })

        await differencesToCreate.save()
    }
    catch(err) {
        throw(err)
    }
} 