import express from 'express';
import Listing from '../models/Listing.js';
import Booking from '../models/Bookings.js';
import User from '../models/User.js';
import mongoose from 'mongoose';
const router = express.Router();


router.get('/', async (req, res) => {
    try {
        const listings = await Listing.find();
        if(!listings){
            return res.status(404).json({ message: "No listings found" });
        }
        res.status(200).json(listings);
    } catch (error) {
        console.error("Error fetching listings:", error);
        res.status(500).json({ error: 'An error occurred while fetching listings' });
    }
});

router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const listing = await Listing.findById(id);
        if (!listing) {
            return res.status(404).json({ error: 'Listing not found' });
        }
        res.status(200).json(listing);
    } catch (error) {
        console.error("Error fetching listing by ID:", error);
        res.status(500).json({ error: 'An error occurred while fetching the listing' });
    }
});


router.post('/bookings/:id', async (req, res) => {
    const { checkIn, checkOut, userId } = req.body; 
    const listingId = req.params.id;

    try {
        if (!userId) {
            return res.status(400).json({ message: 'User ID is required' });
        }

        const listing = await Listing.findById(listingId);
        if (!listing) {
            return res.status(404).json({ message: 'Listing not found' });
        }

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        if (new Date(checkIn) >= new Date(checkOut)) {
            return res.status(400).json({ message: 'Check-in date must be earlier than Check-out date' });
        }

        const newBooking = new Booking({
            listingId: new mongoose.Types.ObjectId(listingId),
            userId: new mongoose.Types.ObjectId(userId),
            checkIn,
            checkOut
        });

        await newBooking.save();

        res.status(201).json({
            message: 'Booking created successfully',
            booking: newBooking
        });
    } catch (error) {
        console.error('Error processing booking:', error.stack);
        res.status(500).json({
            message: 'An error occurred while processing the booking',
            error: error.message,
        });
    }
});




// router.get('/', async (req, res) => {
//     try {

//         const page = parseInt(req.query.page) || null;
//         const limit = parseInt(req.query.limit) || null;
        
//         // Pagination
//         if (!page || !limit) {
//             const listigs = await listings.find();
//             res.json({ listings });
//         }
//         const skip = (page - 1) * limit;

//         const listings = await Listing.find()
//             .skip(skip)        
//             .limit(limit);      

//         res.json({
//             listings
//         });

//         const filter = {};
//         if (req.query.price) {
//             if(req.query.price && isNaN(req.query.price)){
//                 res.status(500).json({ error: 'Price Must be Numeric Value' });   
//             }
//             filter.price = { $lte: req.query.price };  
//         }
//         if (req.query.property_type) {
//             filter.property_type = req.query.property_type;
//         }
//         if (req.query.bedrooms) {
//             if(req.query.bedrooms && isNaN(req.query.bedrooms)){
//                 res.status(500).json({ error: 'Bedrooms Must be Numeric' });   
//             }
//             filter.bedrooms = parseInt(req.query.bedrooms);
//         }


//     } catch (error) {
//         console.error("Error fetching listings:", error);
//         res.status(500).json({ error: 'An error occurred while fetching listings' });
//     }
// });

export default router;
