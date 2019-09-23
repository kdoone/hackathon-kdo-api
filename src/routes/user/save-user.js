import { User } from '../../schemas'

export const saveUser = async(deviceId, version) => {
    try {
        const user = User({
            deviceId,
            version
        })

        await user.save()
    }
    catch(err) {
        throw(err)
    }
} 