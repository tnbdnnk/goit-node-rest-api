import mongoose, { Schema } from "mongoose";

const contactSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Set name for contact'],
    },
    email: {
        type: String,
    },
    phone: {
        type: String,
    },
    favorite: {
        type: Boolean,
        default: false,
        validate: {
            validator: function (value) {
                return typeof value === 'boolean';
            },
            message:'Favourite must be a boolean value'
        }
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
}, { versionKey: false });

export default mongoose.model("Contact", contactSchema);