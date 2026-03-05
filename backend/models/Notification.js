import mongoose from 'mongoose';

const notificationSchema = new mongoose.Schema({
    cef: { type: String, ref: 'User', required: true },
    titre: { type: String, required: true },
    message: { type: String, required: true },
    type: { type: String, enum: ['confirmation', 'sanction', 'levee_suspension', 'info'] },
    isRead: { type: Boolean, default: false }
}, {
    timestamps: true
});

const Notification = mongoose.model('Notification', notificationSchema);
export default Notification;
