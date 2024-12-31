import express from 'express';
import Listing from '../models/Listing.js';
import Booking from '../models/Bookings.js';
import User from '../models/User.js';
import mongoose from 'mongoose';
import { verifyToken } from '../middlewares/authMiddleware.js';
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
router.use(verifyToken);
router.get('/bookings/:id', async (req, res) => {
    try {
        const { id } = req.params;
        
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ error: 'Invalid ObjectId format' });
        }

        const bookings = await Booking.find({ userId: id }).populate('listingId');
        console.log(bookings); 

        if (bookings.length === 0) {
            return res.status(404).json({ error: 'No bookings found for this user.' });
        }

        res.status(200).json(bookings);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Something went wrong while fetching bookings.' });
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
        const datediff = new Date(checkOut) - new Date(checkIn);
        const days = datediff / (1000 * 3600 * 24);
        const amount = days * listing.price;

        const newBooking = new Booking({
            listingId: new mongoose.Types.ObjectId(listingId),
            userId: new mongoose.Types.ObjectId(userId),
            checkIn,
            checkOut,
            price: amount
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


export default router;
