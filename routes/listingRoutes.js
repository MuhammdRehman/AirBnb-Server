// routes/listings.js
import express from 'express';
import Listing from '../models/Listing.js';
import mongoose from 'mongoose';
const router = express.Router();


router.get('/', async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        const listings = await Listing.find()
            .skip(skip)
            .limit(limit)
            .select('name');

        res.status(200).json({
            page,
            limit,
            data: listings,
        });
    } catch (error) {
        console.error("Error fetching listings:", error);
        res.status(500).json({ error: 'An error occurred while fetching listings' });
    }
});

// Get Listing by ID
router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const listing = await Listing.findById(id);
        if (!listing) {
            return res.status(404).json({ error: 'Listing not found' });
        }

        // Send the listing as response
        res.status(200).json(listing);
    } catch (error) {
        console.error("Error fetching listing by ID:", error);
        res.status(500).json({ error: 'An error occurred while fetching the listing' });
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
