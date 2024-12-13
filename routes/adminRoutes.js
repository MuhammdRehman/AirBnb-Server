import express from 'express';
import multer from 'multer';
import Listing from '../models/Listing.js';
import Booking from '../models/Bookings.js';
const router = express.Router();

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    },
});
const upload = multer({ storage });

router.get('/listings',async(req,res)=>{
    try {
        const listings = await Listing.find();
        if(!listings){
            return res.status(404).json({message:'No listings found'});
        }
        res.json(listings);
    }catch(error){
        res.status(500).json({error:"Something Went Wrong"});
    }
});


router.post('/listings', upload.array('images', 10), async (req, res) => {
    try {
        const {
            name,
            summary,
            property_type,
            bedrooms,
            bathrooms,
            price,
            guests,
            address,
            amenities,
        } = req.body;

        const parsedAddress = JSON.parse(address);
        const amenitiesArray = amenities.split(',').map((item) => item.trim());

        const imagePaths = req.files.map((file) => `/uploads/${file.filename}`);

        const newListing = new Listing({
            name,
            summary,
            property_type,
            bedrooms: Number(bedrooms),
            bathrooms: Number(bathrooms),
            price: Number(price),
            guests: Number(guests),
            address: parsedAddress,
            amenities: amenitiesArray,
            images: imagePaths,
        });

        await newListing.save();
        res.status(201).json({ message: 'Listing created successfully!', listing: newListing });
    } catch (error) {
        console.error('Error creating listing:', error);
        res.status(500).json({ error: 'An error occurred while creating the listing.' });
    }
});
router.delete('/listings/:id',async(req,res) =>{
    try {
         const {id} = req.params;
         const listing = await Listing.findByIdAndDelete(id);
         if(!listing){
            res.status(404).json({error:"Listing Not Found"});
         }
         res.status(200).json({message:"Listing deleted successfully!"});

    } catch (error) {
        res.status(500).json({error : "Something Went Wrong!!!"});
    }
});
router.get('/bookings', async (req, res) => {
    try {
        const bookings = await Booking.find()
            .populate('listingId')  
            .populate('userId');    

        if (!bookings || bookings.length === 0) {
            return res.status(404).json({ error: "No bookings found" });
        }

        res.status(200).json(bookings);
    } catch (error) {
        console.error('Error occurred while fetching bookings:', error);
        res.status(500).json({ error: 'An error occurred while fetching bookings.' });
    }
});

export default router;
