import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../models/User.js';
import Reservation from '../models/Reservation.js';
import Notification from '../models/Notification.js';
import Log from '../models/ActionLog.js';
import Presence from '../models/Presence.js';
import Report from '../models/Report.js';
import Sanction from '../models/Sanction.js';

dotenv.config();

const seed = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB Connected for seeding...');

        // Clear existing data
        await User.deleteMany();
        await Reservation.deleteMany();
        await Notification.deleteMany();
        await Log.deleteMany();
        await Presence.deleteMany();
        await Report.deleteMany();
        await Sanction.deleteMany();

        // Create Admin
        await User.create({
            CIN: 'L697511',
            CEF: '2005010500357',
            nom: 'Elhalimi',
            prenom: 'Mohamed',
            genre: 'M',
            role: 'admin',
            password: 'L697511!CMCTTA'
        });

        // Create Students
        const studentPassword = 'test123';
        const students = [
            { CIN: 'BK111111', CEF: 'ELE001', nom: 'Lalami', prenom: 'Yassine', genre: 'M', room: '1', password: studentPassword },
            { CIN: 'BK222222', CEF: 'ELE002', nom: 'Berrada', prenom: 'Sara', genre: 'F', room: '2', password: studentPassword },
            { CIN: 'BK333333', CEF: 'ELE003', nom: 'Idrissi', prenom: 'Mehdi', genre: 'M', room: '3', password: studentPassword },
            { CIN: 'BK444444', CEF: 'ELE004', nom: 'Tazi', prenom: 'Kenza', genre: 'F', room: '4', password: studentPassword },
            { CIN: 'BK555555', CEF: 'ELE005', nom: 'Naciri', prenom: 'Omar', genre: 'M', room: '5', password: studentPassword }
        ];

        for (const s of students) {
            await User.create(s);
        }

        // Create Reservations
        const todayObj = new Date();
        const dates = [];
        for (let i = 6; i >= 0; i--) {
            const d = new Date();
            d.setDate(todayObj.getDate() - i);
            dates.push(d.toISOString().split('T')[0]);
        }
        const tomorrow = new Date(todayObj.getTime() + 86400000).toISOString().split('T')[0];
        dates.push(tomorrow);

        const reservationsData = [];
        dates.forEach((date, index) => {
            const isPast = index < 6; // index 6 is today, 7 is tomorrow
            const isToday = index === 6;
            
            reservationsData.push(
                { cef: 'ELE001', date, repas: ['dejeuner', 'diner'], statut: isPast ? 'present' : (isToday ? 'en_attente' : 'en_attente') },
                { cef: 'ELE002', date, repas: ['petit_dejeuner', 'dejeuner'], statut: isPast ? 'present' : (isToday ? 'present' : 'en_attente') },
                { cef: 'ELE003', date, repas: ['diner'], statut: isPast ? 'absent' : 'en_attente' },
                { cef: 'ELE004', date, repas: ['petit_dejeuner', 'dejeuner', 'diner'], statut: isPast ? 'present' : (isToday ? 'absent' : 'en_attente') },
                { cef: 'ELE005', date, repas: ['dejeuner'], statut: isPast ? 'present' : 'en_attente' }
            );
        });

        await Reservation.insertMany(reservationsData);

        // Create Notifications
        // enums 'confirmation', 'sanction', 'levee_suspension', 'info'
        await Notification.insertMany([
            { cef: 'ELE001', titre: 'Bienvenue', message: 'Bienvenue sur le système de réservation du restaurant scolaire.', type: 'info' },
            { cef: 'ELE002', titre: 'Réservation Validée', message: 'Votre réservation pour aujourd\'hui a été validée.', type: 'confirmation' },
            { cef: 'ELE003', titre: 'Rappel', message: 'N\'oubliez pas de réserver vos repas pour demain.', type: 'info' },
            { cef: 'ELE004', titre: 'Repas Consommé', message: 'Merci d\'avoir utilisé nos services.', type: 'confirmation' }
        ]);


        // Create Logs
        await Log.insertMany([
            { cef: 'ELE001', action: 'Connexion', date: new Date(), role: 'stagiaire' },
            { cef: 'ELE002', action: 'Réservation', date: new Date(), role: 'stagiaire' }
        ]);

        // Create Presence
        // presence need reservationId
        // await Presence.insertMany([
        //     { cef: 'ELE001', date: today, repas: 'dejeuner', present: true, reservationId: '1' },
        //     { cef: 'ELE002', date: today, repas: 'petit_dejeuner', present: true, reservationId: '2' },
        //     { cef: 'ELE004', date: today, repas: 'diner', present: true, reservationId: '3' }
        // ]);

        // Create Reports
        /*
        cef: { type: String, required: true },
    message: { type: String, required: true },
    attachments: [{ type: String }], // file URLs
    response: { type: String, default: '' },
    statut: { type: String, enum: ['ouverte', 'en_cours', 'fermee'], default: 'ouverte' }*/
        await Report.insertMany([
            { cef: 'ELE005', message: 'Bruit excessif au réfectoire', attachments: [], response: '', statut: 'ouverte' },
            { cef: 'ELE006', message: 'Oubli de plateau', attachments: [], response: '', statut: 'fermee' }
        ]);

        // Create Sanctions
        /*cef: { type: String, required: true },
            reservationId: { type: mongoose.Schema.Types.ObjectId, ref: 'Reservation' },
            motif: { type: String, default: 'Absence non justifiée' },
            dateDebut: { type: Date },
            dateFin: { type: Date }, // dateDebut + 24h
            leveeParAdmin: { type: String, default: null },
            leveeA: { type: Date, default: null },
            isActive: { type: Boolean, default: true } */
        // await Sanction.insertMany([
        //     { cef: 'ELE005', reservationId: '1', motif: 'Comportement inapproprié', dateDebut: today, dateFin: new Date(today.getTime() + 24 * 60 * 60 * 1000), leveeParAdmin: null, leveeA: null, isActive: true },
        //     { cef: 'ELE007', reservationId: '2', motif: 'Non-respect des consignes', dateDebut: today, dateFin: new Date(today.getTime() + 24 * 60 * 60 * 1000), leveeParAdmin: null, leveeA: null, isActive: true }
        // ]);

        console.log('Data seeded successfully!');
        process.exit();
    } catch (error) {
        console.error(`Error: ${error.message}`);
        process.exit(1);
    }
};

seed();