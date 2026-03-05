export const isReservationWindowOpen = () => {
    const now = new Date();
    const hours = now.getHours();
    return hours >= 18 || hours < 6;
};

export const getNextOpeningTime = () => {
    return "18h00";
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
