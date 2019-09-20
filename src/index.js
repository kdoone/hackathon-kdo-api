import express, { json, urlencoded } from 'express'
import { connect }  from 'mongoose'

import { allRoutes } from './routes';

const port = 3000
const app = express()

connect('mongodb://localhost:27017/findDifference', 
{ useNewUrlParser: true, useUnifiedTopology: true, }, err => {

    if(err) {
        throw(err)
    }

    console.log('Сonnected to mongodb')
})


// Initialize all routes
app.use( json() )
app.use( urlencoded({ extended: true }) )
app.use('/api', allRoutes);

app.listen(port, () => {
    console.log(`Server running at ${port}` );
})


