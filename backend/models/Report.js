import mongoose from 'mongoose';

const reportSchema = new mongoose.Schema({
    cef: { type: String, required: true },
    message: { type: String, required: true },
    attachments: [{ type: String }], // file URLs
    response: { type: String, default: '' },
    statut: { type: String, enum: ['ouverte', 'en_cours', 'fermee'], default: 'ouverte' }
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

// Virtual populate for student info
reportSchema.virtual('student', {
    ref: 'User',
    localField: 'cef',
    foreignField: 'CEF',
    justOne: true
});

const Report = mongoose.model('Report', reportSchema);
export default Report;
