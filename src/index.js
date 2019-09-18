import express from 'express'

import { allRoutes } from './routes';

const port = 3000
const app = express()

// Initialize all routes
app.use('/api', allRoutes);

app.listen(port, () => {
    console.log(`Server running at ${port}` );
})


