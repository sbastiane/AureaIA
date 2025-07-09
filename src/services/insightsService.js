export const generateInsights = async (token) => {
    const conversationId = localStorage.getItem('conversationId') || 'conv_default';
    try {
        const response = await fetch('https://aureapi-933872953103.us-central1.run.app/api_pymeup/generate-insights', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
                conversation_id: conversationId
            })
        });

        if (!response.ok) {
            throw new Error('Error al generar insights');
        }

        return await response.json();
    } catch (error) {
        console.error('Error en insightsService:', error);
        throw error;
    }
};