import mongoose from 'mongoose';
import dotenv from 'dotenv';
import fs from 'fs';
import User from '../models/User.js';
import Reservation from '../models/Reservation.js';
import Notification from '../models/Notification.js';
import Log from '../models/ActionLog.js';
import Presence from '../models/Presence.js';
import Report from '../models/Report.js';
import Sanction from '../models/Sanction.js';

dotenv.config();

const seedCustom = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB Connected for custom seeding...');

        const data = JSON.parse(fs.readFileSync('./seeds/seed.json', 'utf-8'));
        
        await User.deleteMany();
        await Reservation.deleteMany();
        await Notification.deleteMany();
        await Log.deleteMany();
        await Presence.deleteMany();
        await Report.deleteMany();
        await Sanction.deleteMany();
        console.log('Cleared all collections.');

        let successCount = 0;

        for (const item of data) {
            const genre = item.Sexe === 'G' ? 'M' : 'F'; // G for Garçon, map to M
            const isMohamedElhalimi = item.CEF === '2005010500357' || (item.Nom === 'ELHALIMI' && item['Prénom'] === 'MOHAMED');
            
            await User.create({
                CIN: item.CIN,
                CEF: item.CEF,
                nom: item.Nom,
                prenom: item['Prénom'],
                genre: genre,
                room: item.CHAMBRE,
                role: isMohamedElhalimi ? 'admin' : 'stagiaire',
                password: item.CEF + "CMCTTA" 
            });
            successCount++;
        }

        // Add dummy data for other collections using the first few students
        const testCefs = data.slice(0, 6).map(item => item.CEF);
        const [cef1, cef2, cef3, cef4, cef5, cef6] = testCefs;

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
            const isPast = index < 6;
            const isToday = index === 6;
            
            reservationsData.push(
                { cef: cef1, date, repas: ['dejeuner', 'diner'], statut: isPast ? 'present' : 'en_attente' },
                { cef: cef2, date, repas: ['petit_dejeuner', 'dejeuner'], statut: isPast ? 'present' : (isToday ? 'present' : 'en_attente') },
                { cef: cef3, date, repas: ['diner'], statut: isPast ? 'absent' : 'en_attente' },
                { cef: cef4, date, repas: ['petit_dejeuner', 'dejeuner', 'diner'], statut: isPast ? 'present' : (isToday ? 'absent' : 'en_attente') },
                { cef: cef5, date, repas: ['dejeuner'], statut: isPast ? 'present' : 'en_attente' }
            );
        });

        await Reservation.insertMany(reservationsData);

        // Create Notifications
        await Notification.insertMany([
            { cef: cef1, titre: 'Bienvenue', message: 'Bienvenue sur le système de réservation du restaurant scolaire.', type: 'info' },
            { cef: cef2, titre: 'Réservation Validée', message: 'Votre réservation pour aujourd\'hui a été validée.', type: 'confirmation' },
            { cef: cef3, titre: 'Rappel', message: 'N\'oubliez pas de réserver vos repas pour demain.', type: 'info' },
            { cef: cef4, titre: 'Repas Consommé', message: 'Merci d\'avoir utilisé nos services.', type: 'confirmation' }
        ]);

        // Create Logs
        await Log.insertMany([
            { cef: cef1, action: 'Connexion', date: new Date(), role: 'stagiaire' },
            { cef: cef2, action: 'Réservation', date: new Date(), role: 'stagiaire' }
        ]);

        // Create Reports
        await Report.insertMany([
            { cef: cef5, message: 'Bruit excessif au réfectoire', attachments: [], response: '', statut: 'ouverte' },
            { cef: cef6, message: 'Oubli de plateau', attachments: [], response: '', statut: 'fermee' }
        ]);

        console.log(`Seeding complete. Inserted: ${successCount} Users, plus reservations, notifications, logs, and reports.`);
        process.exit();
    } catch (error) {
        console.error(`Error: ${error.message}`);
        process.exit(1);
    }
};

seedCustom();
