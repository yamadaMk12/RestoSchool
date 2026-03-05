import mongoose from 'mongoose';

const presenceSchema = new mongoose.Schema({
    reservationId: { type: mongoose.Schema.Types.ObjectId, ref: 'Reservation', required: true },
    cef: { type: String },
    date: { type: String },
    statut: { type: String, enum: ['present', 'absent'] },
    marqueParAdmin: { type: String }, // admin CEF
    marqueA: { type: Date }
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

// Virtual populate for student info
presenceSchema.virtual('student', {
    ref: 'User',
    localField: 'cef',
    foreignField: 'CEF',
    justOne: true
});

const Presence = mongoose.model('Presence', presenceSchema);
export default Presence;
