require('dotenv').config()
//async errors
require('express-async-errors')
const express= require('express')
const app= express() 
const connectDB= require('./db/connect')
const url= process.env.MONGO_URL
const productRouter= require('./routes/products')

const notFoundMiddleware=require('./middleware/not-found')
const errorMiddleware= require('./middleware/error-handler')

//middleware
app.use(express.json())
//routes
app.get('/',(req,res)=>{
    res.send('<h1>Store API </h1><a href="api/v1/products">products route</a>')

})

//products route
app.use('/api/v1/products',productRouter)

app.use(notFoundMiddleware)
app.use(errorMiddleware)

const port= process.env.PORT || 3000
const start=async()=>{
    try {
        await connectDB(url)
        console.log('connected')
        app.listen(port,console.log(`Server is litening port ${port}...`))
    } catch (error) {
        console.log(error)
    }
}

start()
