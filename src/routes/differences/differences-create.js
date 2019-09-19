import { Differences } from "../../schemas";

export const differencesCreate = async(deviceId, version, items) => {
    try {
        const differencesToCreate = Differences({
            deviceId,
            version,
            items
        })

        await differencesToCreate.save()
    }
    catch(err) {
        throw(err)
    }
} 