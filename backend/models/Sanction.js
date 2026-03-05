import mongoose from 'mongoose';

const sanctionSchema = new mongoose.Schema({
    cef: { type: String, required: true },
    reservationId: { type: mongoose.Schema.Types.ObjectId, ref: 'Reservation' },
    motif: { type: String, default: 'Absence non justifiée' },
    dateDebut: { type: Date },
    dateFin: { type: Date }, // dateDebut + 24h
    leveeParAdmin: { type: String, default: null },
    leveeA: { type: Date, default: null },
    isActive: { type: Boolean, default: true }
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

// Virtual populate for student info
sanctionSchema.virtual('student', {
    ref: 'User',
    localField: 'cef',
    foreignField: 'CEF',
    justOne: true
});

const Sanction = mongoose.model('Sanction', sanctionSchema);
export default Sanction;
