// models/Listing.js
import mongoose from 'mongoose';
const ListingSchema = new mongoose.Schema({
    name: String,
    summary: String,
    property_type: String,
    bedrooms: Number,
    bathrooms: Number,
    price: Number,
    address: {
        street: String,
        suburb: String,
        country: String
    },
    amenities: [String],
    images: {
        picture_url: String
    }
});
const Listing = mongoose.model('Listing', ListingSchema,'Listings');
export default Listing;