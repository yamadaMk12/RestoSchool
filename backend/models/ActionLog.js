import mongoose from 'mongoose';

const actionLogSchema = new mongoose.Schema({
    cef: { type: String, ref: 'User' },
    role: { type: String },
    action: { type: String, required: true },
    details: { type: Object, default: {} }
}, {
    timestamps: true
});

const ActionLog = mongoose.model('ActionLog', actionLogSchema);
export default ActionLog;
