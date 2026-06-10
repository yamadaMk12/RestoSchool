import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import Reservation from './Reservation.js';
import Presence from './Presence.js';
import Sanction from './Sanction.js';
import Notification from './Notification.js';
import Report from './Report.js';
import ActionLog from './ActionLog.js';

const userSchema = new mongoose.Schema({
    CIN: { type: String, required: true },
    CEF: { type: String, required: true, unique: true },
    nom: { type: String, required: true },
    prenom: { type: String, required: true },
    genre: { type: String, enum: ['M', 'F'] },
    room: { type: Number },
    role: { type: String, enum: ['stagiaire', 'admin'], default: 'stagiaire' },
    password: { type: String, required: true },
    isSuspended: { type: Boolean, default: false },
    suspensionEnd: { type: Date, default: null }
}, {
    timestamps: true
});

// Hash password before saving
userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) {
        return next();
    }
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

// Check room occupancy before saving (max 4 per gender per room)
userSchema.pre('save', async function (next) {
    if (this.isModified('room') && this.room !== undefined && this.room !== null) {
        const count = await this.constructor.countDocuments({
            room: this.room,
            genre: this.genre,
            _id: { $ne: this._id }
        });

        if (count >= 4) {
            const label = this.genre === 'M' ? 'garçons' : 'filles';
            const error = new Error(`La chambre est déjà complète pour les ${label} (maximum 4)`);
            return next(error);
        }
    }
    next();
});

// CASCADE DELETE: remove all related documents when a user is deleted
userSchema.pre('deleteOne', { document: true, query: false }, async function () {
    const cef = this.CEF;

    // Get reservation IDs to delete associated presences
    const reservations = await Reservation.find({ cef }).select('_id');
    const reservationIds = reservations.map(r => r._id);

    // Delete all related documents
    await Promise.all([
        Presence.deleteMany({ $or: [{ cef }, { reservationId: { $in: reservationIds } }] }),
        Reservation.deleteMany({ cef }),
        Sanction.deleteMany({ cef }),
        Notification.deleteMany({ cef }),
        Report.deleteMany({ cef }),
        ActionLog.deleteMany({ cef })
    ]);
});

// Method to compare passwords
userSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model('User', userSchema);
export default User;