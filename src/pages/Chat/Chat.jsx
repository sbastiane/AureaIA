import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { sendChatMessage } from '../../services/chatService.js';
import { generateProjection } from '../../services/projectionService.js';
import { generateInsights } from '../../services/insightsService.js';
import { analyzeFinancial } from '../../services/financialAnalysisService';

const Chat = () => {
    const [messages, setMessages] = useState([
        { from: 'bot', text: '¡Hola! ¿En qué puedo ayudarte hoy?' },
    ]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [analysisProgress, setAnalysisProgress] = useState(0);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, loading]);

    const handleSendMessage = async () => {
        if (!input.trim()) return;

        const userMessage = { from: 'user', text: input };
        setMessages((prev) => [...prev, userMessage]);
        setInput('');
        setLoading(true);

        const token = localStorage.getItem('token'); 

        try {
            const botText = await sendChatMessage(input, token);
            const botMessage = { from: 'bot', text: botText };
            setMessages((prev) => [...prev, botMessage]);
        } catch (error) {
            setMessages((prev) => [
                ...prev,
                { from: 'bot', text: error.message },
            ]);
        } finally {
            setLoading(false);
        }
    };

    const handleAnalyze = async () => {
        const token = localStorage.getItem('token');
        if (!token) return;

        setIsAnalyzing(true);
        setAnalysisProgress(0);
        
        try {
            // Mensaje inicial de análisis
            setMessages(prev => [...prev, {
                from: 'bot',
                text: 'Iniciando análisis completo de tu situación financiera...'
            }]);

            // Función para simular progreso
            const updateProgress = () => {
                setAnalysisProgress(prev => {
                    const newProgress = prev + Math.random() * 20;
                    return newProgress > 90 ? 90 : newProgress;
                });
            };

            const progressInterval = setInterval(updateProgress, 800);

            // Ejecutar ambas peticiones en paralelo
            const [projection, insights, financialAnalysis] = await Promise.all([
            generateProjection(token),
            generateInsights(token),
            analyzeFinancial(token)
        ]);
            
            clearInterval(progressInterval);
            setAnalysisProgress(100);

            // Guardar ambos resultados
            localStorage.setItem('projection', JSON.stringify(projection));
            localStorage.setItem('insights', JSON.stringify(insights));
            localStorage.setItem('financialAnalysis', JSON.stringify(financialAnalysis));
            
            setMessages(prev => [...prev, {
                from: 'bot',
                text: '✅ Análisis completado con éxito!\n\nHe generado:\n- Proyección financiera a 6 meses\n- Recomendaciones personalizadas\n\nPuedes ver todos los detalles en tu Dashboard.'
            }]);

            // Mostrar resumen de insights en el chat
            setTimeout(() => {
                setMessages(prev => [...prev, {
                    from: 'bot',
                    text: '📌 Resumen de recomendaciones:\n\n' + 
                        insights.insights.recomendaciones.map(r => 
                            `• ${r.accion} (Urgencia: ${r.urgencia})`
                        ).join('\n')
                }]);
            }, 1500);

        } catch (error) {
            setMessages(prev => [...prev, {
                from: 'bot',
                text: '❌ Hubo un error al generar el análisis completo. Por favor intenta nuevamente.'
            }]);
            console.error('Error en análisis:', error);
        } finally {
            setIsAnalyzing(false);
            setAnalysisProgress(0);
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') handleSendMessage();
    };

    return (
        <div className="w-screen h-screen bg-[#f9f9f9] flex flex-col font-sans text-[#555555cc]">
            <header className="h-[70px] bg-white border-b px-6 flex items-center justify-between shadow-sm">
                <h2 className="text-xl font-semibold text-gray-800">
                    Aurea<span className="font-bold text-blue-600">IA</span>
                </h2>
            </header>
            <main className="flex-1 overflow-y-auto px-4 py-6 space-y-4">
                {messages.map((msg, i) => (
                    <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }}
                        className={`rounded-2xl px-4 py-2 max-w-[80%] text-sm ${msg.from === 'bot'
                                ? 'bg-gray-100 text-gray-900 self-start whitespace-pre-wrap'
                                : 'bg-blue-600 text-white self-end ml-[120px]'
                            }`}
                    >
                        {msg.text}
                    </motion.div>
                ))}

                {loading && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ repeat: Infinity, duration: 1 }}
                        className="bg-gray-100 text-gray-500 text-sm px-4 py-2 rounded-2xl w-fit self-start"
                    >
                        <span className="animate-pulse">
                            Escribiendo<span className="animate-bounce">...</span>
                        </span>
                    </motion.div>
                )}

                <div ref={messagesEndRef} />
            </main>
            <footer className="px-4 py-3 bg-white border-t flex flex-col">
                <div className="flex items-center mb-2">
                    <input
                        type="text"
                        placeholder="Escribe un mensaje..."
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={handleKeyDown}
                        className="flex-grow px-4 py-2 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                        disabled={isAnalyzing}
                    />
                    <motion.button
                        whileTap={{ scale: 0.95 }}
                        onClick={handleSendMessage}
                        className="ml-3 text-blue-600 text-xl"
                        disabled={loading || isAnalyzing}
                    >
                        ➤
                    </motion.button>
                </div>
                <button 
                    onClick={handleAnalyze}
                    disabled={isAnalyzing}
                    className={`w-full py-2 rounded-xl text-sm font-medium relative overflow-hidden ${
                        isAnalyzing ? 'bg-blue-400 text-white' : 'bg-blue-600 text-white hover:bg-blue-700'
                    } transition-colors`}
                >
                    {isAnalyzing ? (
                        <>
                            <span className="relative z-10">Analizando... {Math.round(analysisProgress)}%</span>
                            <div 
                                className="absolute top-0 left-0 h-full bg-blue-500 transition-all duration-300"
                                style={{ width: `${analysisProgress}%` }}
                            />
                        </>
                    ) : 'Analizar Finanzas'}
                </button>
            </footer>
        </div>
    );
};

export default Chat;