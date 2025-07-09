import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { Bar, Pie } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement } from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

const Dashboard = () => {
  const navigate = useNavigate();
  const [projection, setProjection] = useState(null);
  const [insights, setInsights] = useState(null);
  const [financialAnalysis, setFinancialAnalysis] = useState(null);

  const userName = localStorage.getItem('greeting');

  useEffect(() => {
    const savedProjection = localStorage.getItem('projection');
    const savedInsights = localStorage.getItem('insights');
    const savedFinancialAnalysis = localStorage.getItem('financialAnalysis');
    
    if (savedProjection) setProjection(JSON.parse(savedProjection));
    if (savedInsights) setInsights(JSON.parse(savedInsights));
    if (savedFinancialAnalysis) setFinancialAnalysis(JSON.parse(savedFinancialAnalysis));
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('greeting');
    localStorage.removeItem('projection');
    localStorage.removeItem('insights');
    localStorage.removeItem('financialAnalysis');
    navigate('/login');
  };

  // Configuración para el gráfico de barras
  const financialData = {
    labels: projection?.projection?.proyeccion_mensual?.map(item => item.mes) || [],
    datasets: [
      {
        label: 'Ingresos',
        data: projection?.projection?.proyeccion_mensual?.map(item => item.ingresos) || [],
        backgroundColor: 'rgba(75, 192, 192, 0.7)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
      },
      {
        label: 'Gastos',
        data: projection?.projection?.proyeccion_mensual?.map(item => item.gastos) || [],
        backgroundColor: 'rgba(255, 99, 132, 0.7)',
        borderColor: 'rgba(255, 99, 132, 1)',
        borderWidth: 1,
      },
      {
        label: 'Utilidad',
        data: projection?.projection?.proyeccion_mensual?.map(item => item.utilidad) || [],
        backgroundColor: 'rgba(54, 162, 235, 0.7)',
        borderColor: 'rgba(54, 162, 235, 1)',
        borderWidth: 1,
      }
    ],
  };

  // Configuración para el gráfico de torta
  const expensesPieData = {
    labels: ['Gastos Administrativos', 'Costos Operativos', 'Nómina'],
    datasets: [
      {
        data: [
          financialAnalysis?.financial_data?.gastos_administrativos || 0,
          financialAnalysis?.financial_data?.costos_operativos || 0,
          financialAnalysis?.financial_data?.nomina || 0
        ],
        backgroundColor: [
          'rgba(255, 99, 132, 0.7)',
          'rgba(54, 162, 235, 0.7)',
          'rgba(255, 206, 86, 0.7)'
        ],
        borderColor: [
          'rgba(255, 99, 132, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 206, 86, 1)'
        ],
        borderWidth: 1,
      },
    ],
  };

  const pieOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'right',
      },
      title: {
        display: true,
        text: 'Distribución de Gastos',
        font: {
          size: 16
        }
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            const label = context.label || '';
            const value = context.raw || 0;
            const total = context.dataset.data.reduce((acc, data) => acc + data, 0);
            const percentage = Math.round((value / total) * 100);
            return `${label}: $${value.toLocaleString()} (${percentage}%)`;
          }
        }
      }
    }
  };

  const barOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Proyección Financiera Mensual',
        font: {
          size: 16
        }
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            return `${context.dataset.label}: $${context.raw.toLocaleString()}`;
          }
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: function(value) {
            return `$${value.toLocaleString()}`;
          }
        },
        title: {
          display: true,
          text: 'Monto ($)'
        }
      },
      x: {
        title: {
          display: true,
          text: 'Meses'
        }
      }
    },
    barPercentage: 0.8,
    categoryPercentage: 0.8
  };

  const getUrgencyColor = (urgency) => {
    switch(urgency.toLowerCase()) {
      case 'alta': return 'bg-red-100 text-red-800';
      case 'media': return 'bg-orange-100 text-orange-800';
      case 'baja': return 'bg-green-100 text-green-800';
      default: return 'bg-blue-100 text-blue-800';
    }
  };

  return (
    <section className='font-[Poppins]'>
      <header className='w-full h-[230px] bg-[#3B3AEF] p-3 flex'>
        <div>
          <h1 className='text-[30px] font-medium'>Dashboard</h1>
          <p className='text-[15px] ml-1 mt-[-5px] text-[#ffffffab]'>Welcome Back <span className='font-semibold'>{userName}</span>!</p>
        </div>
        <div className='w-[50px] h-[50px] rounded-full overflow-hidden bg-white mt-[5px] ml-auto flex items-center justify-center'>
          <img src="/users/user-default.png" className='w-full' alt="profile picture of" />
        </div>
      </header>
      
      <div className='w-[90%] h-[50px] bg-white mx-auto mt-[-135px] rounded-2xl p-1.5 flex items-center justify-between'>
        <div className='flex items-center'>
          <div className='w-[35px] h-[35px] flex items-center justify-center ml-1.5 bg-[#4e4ef3] rounded-[5px]'>
            <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" className="bi bi-cash-stack w-[25px]" viewBox="0 0 16 16">
              <path d="M1 3a1 1 0 0 1 1-1h12a1 1 0 0 1 1 1zm7 8a2 2 0 1 0 0-4 2 2 0 0 0 0 4" />
              <path d="M0 5a1 1 0 0 1 1-1h14a1 1 0 0 1 1 1v8a1 1 0 0 1-1 1H1a1 1 0 0 1-1-1zm3 0a2 2 0 0 1-2 2v4a2 2 0 0 1 2 2h10a2 2 0 0 1 2-2V7a2 2 0 0 1-2-2z" />
            </svg>
          </div>
          <div className='w-[60px] h-[40px] text-black flex flex-col justify-center ml-2'>
            <p className='text-[13px]'>Balance</p>
            <h2 className='text-[15px] mt-[-3px] font-semibold'>$ 0.00</h2>
          </div>
        </div>
        <Link to={"/chat"} className='w-[120px] h-[30px] rounded-[6px] flex items-center justify-center gap-1 mr-1.5 bg-[#4e4ef3]'>
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-rocket-takeoff-fill" viewBox="0 0 16 16">
            <path d="M12.17 9.53c2.307-2.592 3.278-4.684 3.641-6.218.21-.887.214-1.58.16-2.065a3.6 3.6 0 0 0-.108-.563 2 2 0 0 0-.078-.23V.453c-.073-.164-.168-.234-.352-.295a2 2 0 0 0-.16-.045 4 4 0 0 0-.57-.093c-.49-.044-1.19-.03-2.08.188-1.536.374-3.618 1.343-6.161 3.604l-2.4.238h-.006a2.55 2.55 0 0 0-1.524.734L.15 7.17a.512.512 0 0 0 .433.868l1.896-.271c.28-.04.592.013.955.132.232.076.437.16.655.248l.203.083c.196.816.66 1.58 1.275 2.195.613.614 1.376 1.08 2.191 1.277l.082.202c.089.218.173.424.249.657.118.363.172.676.132.956l-.271 1.9a.512.512 0 0 0 .867.433l2.382-2.386c.41-.41.668-.949.732-1.526zm.11-3.699c-.797.8-1.93.961-2.528.362-.598-.6-.436-1.733.361-2.532.798-.799 1.93-.96 2.528-.361s.437 1.732-.36 2.531Z" />
            <path d="M5.205 10.787a7.6 7.6 0 0 0 1.804 1.352c-1.118 1.007-4.929 2.028-5.054 1.903-.126-.127.737-4.189 1.839-5.18.346.69.837 1.35 1.411 1.925" />
          </svg>
          Analizar
        </Link>
      </div>
      
      <main className='w-full min-h-[400px] text-black bg-[#6868681f] mt-5 p-4 space-y-6'>
        <h3 className='text-[20px]'>Análisis Financiero</h3>
        
        {/* Sección de Proyección Financiera */}
        <div className='bg-white rounded-lg shadow-md p-4'>
          <h4 className='text-lg font-semibold mb-2'>Proyección Financiera</h4>
          {projection ? (
            <>
              <p className='text-sm text-gray-600 mb-4 italic'>{projection.message}</p>
              <div className='h-[400px]'>
                <Bar data={financialData} options={barOptions} />
              </div>
            </>
          ) : (
            <div className='text-center py-8'>
              <p className='text-gray-500 mb-4'>No hay datos de proyección disponibles.</p>
            </div>
          )}
        </div>

        {/* Sección de Distribución de Gastos */}
        <div className='bg-white rounded-lg shadow-md p-4'>
          <h4 className='text-lg font-semibold mb-2'>Distribución de Gastos</h4>
          {financialAnalysis ? (
            <>
              <p className='text-sm text-gray-600 mb-4 italic'>{financialAnalysis.message}</p>
              <div className='h-[400px]'>
                <Pie data={expensesPieData} options={pieOptions} />
              </div>
            </>
          ) : (
            <div className='text-center py-8'>
              <p className='text-gray-500 mb-4'>No hay datos de gastos disponibles.</p>
            </div>
          )}
        </div>

        {/* Sección de Insights y Recomendaciones */}
        <div className='bg-white rounded-lg shadow-md p-4'>
          <h4 className='text-lg font-semibold mb-2'>Recomendaciones Clave</h4>
          {insights ? (
            <>
              <p className='text-sm text-gray-600 mb-4 italic'>{insights.message}</p>
              <div className='space-y-3'>
                {insights.insights.recomendaciones
                  .sort((a, b) => {
                    const urgencyOrder = { alta: 3, media: 2, baja: 1 };
                    return urgencyOrder[b.urgencia.toLowerCase()] - urgencyOrder[a.urgencia.toLowerCase()];
                  })
                  .map((item, index) => (
                    <div key={index} className='p-3 border rounded-lg hover:shadow-sm transition-shadow'>
                      <div className='flex justify-between items-start mb-1'>
                        <h5 className='font-medium text-[#3B3AEF]'>{item.accion}</h5>
                        <span className={`px-2 py-1 rounded text-xs font-medium ${getUrgencyColor(item.urgencia)}`}>
                          {item.urgencia.toUpperCase()}
                        </span>
                      </div>
                      <p className='text-sm text-gray-600'><span className='font-medium'>Motivo:</span> {item.motivo}</p>
                    </div>
                  ))}
              </div>
            </>
          ) : (
            <div className='text-center py-8'>
              <p className='text-gray-500 mb-4'>No hay recomendaciones disponibles.</p>
            </div>
          )}
        </div>
      </main>
      
      <div className='text-center my-6'>
        <button
          onClick={handleLogout}
          className='bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-6 rounded-lg'
        >
          Cerrar sesión
        </button>
      </div>
    </section>
  );
};

export default Dashboard;