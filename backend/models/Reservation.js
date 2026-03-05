import mongoose from 'mongoose';

const reservationSchema = new mongoose.Schema({
    cef: { type: String, required: true },
    date: { type: String, required: true }, // 'YYYY-MM-DD'
    repas: [{ type: String, enum: ['petit_dejeuner', 'dejeuner', 'diner'] }],
    statut: { type: String, enum: ['en_attente', 'present', 'absent'], default: 'en_attente' }
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

// Virtual populate for student info
reservationSchema.virtual('student', {
    ref: 'User',
    localField: 'cef',
    foreignField: 'CEF',
    justOne: true
});

// Unique compound index: { cef, date }
reservationSchema.index({ cef: 1, date: 1 }, { unique: true });

const Reservation = mongoose.model('Reservation', reservationSchema);
export default Reservation;
