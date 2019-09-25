import { Schema, model } from 'mongoose'

const user = Schema({
    deviceId: { type: String, required: true }      
});

export const User = model('User', user, 'users');
