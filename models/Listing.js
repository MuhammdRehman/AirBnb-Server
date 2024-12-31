import mongoose from 'mongoose';

const ListingSchema = new mongoose.Schema({
    
    name: { type: String, required: true },
    summary: { type: String, required: true },
    property_type: { type: String, required: true },
    bedrooms: { type: Number, required: true },
    bathrooms: { type: Number, required: true },
    price: { type: Number, required: true },
    guests: { type: Number, required: true },
    rating: { type: Number, required:true }, 
    feedbackbypeople:{type: Number,required:true, default:1},
    address: {
        street: { type: String, required: true },
        city: { type: String, required: true },
        country: { type: String, required: true }
    },
    amenities:[String],
    images: [String],
    HostID: { type: mongoose.Schema.Types.ObjectId, ref: 'User',  required: true},
    
});

const Listing = mongoose.model('Listing', ListingSchema, 'Listings');
export default Listing;

