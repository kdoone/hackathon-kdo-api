import { Differences } from "../../schemas";

export const differencesFind = (deviceId) => {
    const toFind = {
        'deviceId': deviceId
    }

    return Differences.findOne(toFind, '' , err => {
        if(err) throw(err);
    })
}