import express from 'express';
import multer from 'multer';
import Listing from '../models/Listing.js';
import mongoose from 'mongoose';
import Booking from '../models/Bookings.js';
import { verifyToken, checkHost } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.use(verifyToken);
router.use(checkHost);

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const dir = `uploads/`;
        cb(null, dir);
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    },
});
const upload = multer({ storage });

router.get('/listings/:id', async (req, res) => {
    try {
        const HostID = req.params.id;
        const listings = await Listing.find({ HostID });
        if (!listings) {
            return res.status(404).json({ message: 'No listings found' });
        }
        res.status(200).json(listings);
    } catch (error) {
        res.status(500).json({ error: "Something Went Wrong" });
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
            rating,
            price,
            guests,
            address,
            amenities,
            HostID,
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
            rating:Number(rating),
            feedbackbypeople:1,
            address: parsedAddress,
            amenities: amenitiesArray,
            images: imagePaths,
            HostID,
        });

        await newListing.save();
        res.status(201).json({ message: 'Listing created successfully!', listing: newListing });
    } catch (error) {
        console.error('Error creating listing:', error);
        res.status(500).json({ error: 'An error occurred while creating the listing.' });
    }
});
router.delete('/listings/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const listing = await Listing.findByIdAndDelete(id);
        if (!listing) {
            res.status(404).json({ error: "Listing Not Found" });
        }
        res.status(200).json({ message: "Listing deleted successfully!" });

    } catch (error) {
        res.status(500).json({ error: "Something Went Wrong!!!" });
    }
});

router.get('/bookings/:id', async (req, res) => {
    try {
        const userId  = req.params.id;
        if (!mongoose.Types.ObjectId.isValid(userId)) {
            console.log("Invalid Host ID...");
            return res.status(400).json({ error: "Invalid Host ID" });
        }

        const bookings = await Booking.find({userId})
            .populate('listingId')
            .populate('userId');

        if (!bookings || bookings.length === 0) {
            console.log("No Booking found");
            return res.status(404).json({ error: "No bookings found" });
        }

        res.status(200).json(bookings);
    } catch (error) {
        console.error('Error occurred while fetching bookings:', error);
        res.status(500).json({ error: 'Something went wrong wrong while fetching bookings.' });
    }
});

export default router;
