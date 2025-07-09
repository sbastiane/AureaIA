export const analyzeFinancial = async (token) => {
    try {
        const response = await fetch('https://aureapi-933872953103.us-central1.run.app/api_pymeup/analyze-financial', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
                conversation_id: 'conv12'
            })
        });

        if (!response.ok) {
            throw new Error('Error al analizar datos financieros');
        }

        return await response.json();
    } catch (error) {
        console.error('Error en financialAnalysisService:', error);
        throw error;
    }
};