import { User } from '../../schemas'

export const saveUser = async(deviceId) => {
    try {
        const user = User({
            deviceId
        })

        await user.save()
    }
    catch(err) {
        throw(err)
    }
} 