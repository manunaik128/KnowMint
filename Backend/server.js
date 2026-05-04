import 'dotenv/config'
import dns from 'node:dns'
dns.setDefaultResultOrder('ipv4first');
import app from './src/app.js'
import { connectDB } from './src/config/db.js'

const PORT = process.env.PORT

connectDB();

app.listen(PORT, () => {
    console.log(`Server is running on the port ${PORT}`)
})