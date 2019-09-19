import { User } from "../../schemas";

export const findUser = (deviceId) => {

    return User.findOne({ 'deviceId': deviceId }, '', err => {
        if(err) throw(err);        
    })

}