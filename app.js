import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import  dotenv  from 'dotenv';
import userRoutes from './routes/userRoutes.js';
import listingRoutes from './routes/listingRoutes.js';
dotenv.config();

const app = express();
const PORT = 3001;

const URI = process.env.MONGODB_URI;
console.log(URI);
// Middleware
app.use(cors()); 
app.use(express.json());
    

mongoose.connect(URI);
const connection = mongoose.connection;
connection.once('open',()=>{
    console.log("MongoDB Connection Established sucessfully!!!");
});
connection.on("error",(err)=>{
    console.log("MongoDB connection failed with error:",err);
});
connection.on("disconnect",()=>{
    console.log("MongoDB is Disconnected!!!");
});



const bookings = [];


//app.use('/api/listing',listingRoutes);
// Routes

app.use('/api/auth',userRoutes);
app.use('/api/listing',listingRoutes);




app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
