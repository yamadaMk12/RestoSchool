import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
    CIN: { type: String, required: true },
    CEF: { type: String, required: true, unique: true },
    nom: { type: String, required: true },
    prenom: { type: String, required: true },
    genre: { type: String, enum: ['M', 'F'] },
    salle: { type: String },
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
        next();
    }
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
});

// Method to compare passwords
userSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model('User', userSchema);
export default User;
