export const getReclamations = async () => {
    return [
        { id: 1, message: 'Problème avec mon repas du midi.', status: 'FERMÉE', response: 'Nous avons pris en compte votre remarque.', date: '2024-05-10' },
        { id: 2, message: 'Erreur de pointage présence.', status: 'EN_COURS', date: '2024-05-19' },
    ];
};

export const createReclamation = async (formData) => {
    // Mock with timeout
    await new Promise(resolve => setTimeout(resolve, 1500));
    return { success: true };
};
