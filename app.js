import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import  dotenv  from 'dotenv';
import userRoutes from './routes/userRoutes.js';
import listingRoutes from './routes/listingRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import hostRoutes from './routes/hostRoutes.js';
dotenv.config();

const app = express();
const PORT = 3001;

const URI = process.env.MONGODB_URI;
console.log(URI);
// Middleware
app.use(cors()); 
app.use(express.json());
app.use('/uploads', express.static('uploads'));
    

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

app.use('/api/auth',userRoutes);
app.use('/api/listings',listingRoutes);
app.use('/api/admin',adminRoutes);
app.use('/api/host',hostRoutes);    
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
