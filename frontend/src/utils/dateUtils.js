export const isReservationWindowOpen = () => {
    return new Date().getDay() === 1;
};

export const getUpcomingWeekDates = () => {
    const dates = [];
    const today = new Date();
    const day = today.getDay();
    // Find next Monday (if today is Sunday, it's tomorrow; if today is Monday, it's 7 days away)
    const daysToNextMonday = (1 - day + 7) % 7 || 7;
    
    const nextMonday = new Date(today);
    nextMonday.setDate(today.getDate() + daysToNextMonday);
    
    for (let i = 0; i < 7; i++) {
        const d = new Date(nextMonday);
        d.setDate(nextMonday.getDate() + i);
        dates.push(d.toISOString().split('T')[0]);
    }
    return dates;
};

export const getNextOpeningTime = () => {
    return "Dimanche";
};

export const formatFullDate = (dateString) => {
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('fr-FR', options);
};

export const formatDateTime = (dateString) => {
    const options = {
        year: 'numeric', month: '2-digit', day: '2-digit',
        hour: '2-digit', minute: '2-digit'
    };
    return new Date(dateString).toLocaleDateString('fr-FR', options);
};
