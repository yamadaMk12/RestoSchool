import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import User from '../models/User.js';
import Reservation from '../models/Reservation.js';
import Notification from '../models/Notification.js';

dotenv.config();

const seed = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB Connected for seeding...');

        // Clear existing data
        await User.deleteMany();
        await Reservation.deleteMany();
        await Notification.deleteMany();

        // Create Admin
        const salt = await bcrypt.genSalt(12);
        const adminPassword = await bcrypt.hash('admin123', salt);

        await User.create({
            CIN: 'L697511',
            CEF: '2005010500357',
            nom: 'Elhalimi',
            prenom: 'Mohamed',
            genre: 'M',
            role: 'admin',
            password: 'L697511!CMCTTA' // Will be hashed by pre-save middleware if we didn't hash it here, but we'll use the middleware
        });

        // Create Students
        const studentPassword = 'test123';
        const students = [
            { CIN: 'BK111111', CEF: 'ELE001', nom: 'Lalami', prenom: 'Yassine', genre: 'M', salle: 'B201', password: studentPassword },
            { CIN: 'BK222222', CEF: 'ELE002', nom: 'Berrada', prenom: 'Sara', genre: 'F', salle: 'B202', password: studentPassword },
            { CIN: 'BK333333', CEF: 'ELE003', nom: 'Idrissi', prenom: 'Mehdi', genre: 'M', salle: 'B203', password: studentPassword },
            { CIN: 'BK444444', CEF: 'ELE004', nom: 'Tazi', prenom: 'Kenza', genre: 'F', salle: 'A101', password: studentPassword },
            { CIN: 'BK555555', CEF: 'ELE005', nom: 'Naciri', prenom: 'Omar', genre: 'M', salle: 'A102', password: studentPassword }
        ];

        for (const s of students) {
            await User.create(s);
        }

        // Create some sample data
        const today = new Date().toISOString().split('T')[0];
        await Reservation.create({
            cef: 'ELE001',
            date: today,
            repas: ['dejeuner', 'diner'],
            statut: 'en_attente'
        });

        await Notification.create({
            cef: 'ELE001',
            titre: 'Bienvenue',
            message: 'Bienvenue sur le système de réservation du restaurant scolaire.',
            type: 'info'
        });

        console.log('Data seeded successfully!');
        process.exit();
    } catch (error) {
        console.error(`Error: ${error.message}`);
        process.exit(1);
    }
};

seed();
