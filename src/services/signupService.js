export const signupUser = async ({ email, password, name }) => {
    const response = await fetch('https://aureapi-933872953103.us-central1.run.app/api_pymeup/register', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password, name })
    })

    if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message || 'Error en el registro')
    }

    const data = await response.json();
    // Generar un ID de conversación único para el nuevo usuario
    const conversationId = 'conv_' + Math.random().toString(36).substr(2, 9);
    return {
        ...data,
        conversationId // Incluir el ID de conversación en la respuesta
    };
}