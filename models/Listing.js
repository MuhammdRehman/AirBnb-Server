import mongoose from 'mongoose';

const ListingSchema = new mongoose.Schema({
    name: { type: String, required: true },
    summary: { type: String, required: true },
    property_type: { type: String, required: true },
    bedrooms: { type: Number, required: true },
    bathrooms: { type: Number, required: true },
    price: { type: Number, required: true },
    guests: { type: Number, required: true },
    rating: { type: Number }, 
    feedbackbypeople:{type: Number},
    address: {
        street: { type: String, required: true },
        city: { type: String, required: true },
        country: { type: String, required: true }
    },
    amenities:[String],
    images: [String],
    
});

const Listing = mongoose.model('Listing', ListingSchema, 'Listings');
export default Listing;

