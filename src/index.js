import express from 'express'
import mongoose from 'mongoose'

import { allRoutes } from './routes';

const port = 3000
const app = express()

mongoose.connect('mongodb://localhost:27017/admin', 
{ useNewUrlParser: true, useUnifiedTopology: true, }, 
err => {
    if(err) {
        throw(err)
    }

    console.log('connected')
})

// Initialize all routes
app.use('/api', allRoutes);

app.listen(port, () => {
    console.log(`Server running at ${port}` );
})


