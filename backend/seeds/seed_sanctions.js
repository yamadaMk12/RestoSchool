import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../models/User.js';
import Sanction from '../models/Sanction.js';

dotenv.config();

const seedSanctions = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB Connected...');

        // Pick 5 students to suspend
        const students = await User.find({ role: 'stagiaire' }).limit(5);
        
        if (students.length === 0) {
            console.log('No students found in the database.');
            process.exit(1);
        }

        const now = new Date();
        const motifs = [
            'Absence non justifiée',
            'Comportement inapproprié au réfectoire',
            'Non-respect des consignes',
            'Gaspillage alimentaire répété',
            'Absence non justifiée'
        ];

        for (let i = 0; i < students.length; i++) {
            const student = students[i];
            const suspensionEnd = new Date(now.getTime() + (i + 1) * 24 * 60 * 60 * 1000); // 1-5 days from now

            // Update user suspension status
            await User.findByIdAndUpdate(student._id, {
                isSuspended: true,
                suspensionEnd: suspensionEnd
            });

            // Create sanction record
            await Sanction.create({
                cef: student.CEF,
                motif: motifs[i],
                dateDebut: now,
                dateFin: suspensionEnd,
                isActive: true
            });

            console.log(`Suspended: ${student.nom} ${student.prenom} (CEF: ${student.CEF}) until ${suspensionEnd.toLocaleDateString('fr-FR')}`);
        }

        console.log(`\nDone! Suspended ${students.length} students.`);
        process.exit();
    } catch (error) {
        console.error(`Error: ${error.message}`);
        process.exit(1);
    }
};

seedSanctions();
