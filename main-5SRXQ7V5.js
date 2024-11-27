<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Gráfico de Evolução</title>
    <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
    <script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>
</head>
<body>
    <h1>Gráfico de Evolução</h1>
    <canvas id="grafico-evolucao" width="400" height="200"></canvas>
    <script>
        const valores = JSON.parse('{{ valores|safe }}');  // Passar dados do backend para o frontend

        // Processar os dados
        const labels = valores.map(item => item.data.split(' ')[0]); // Apenas a data
        const dataValues = valores.map(item => item.valor);

        // Configuração do gráfico
        const ctx = document.getElementById('grafico-evolucao').getContext('2d');
        const myChart = new Chart(ctx, {
            type: 'line', // Gráfico de linha
            data: {
                labels: labels, // Datas
                datasets: [{
                    label: 'Evolução dos Valores',
                    data: dataValues, // Valores
                    backgroundColor: 'rgba(75, 192, 192, 0.2)',
                    borderColor: 'rgba(75, 192, 192, 1)',
                    borderWidth: 1,
                    tension: 0.4 // Suaviza as linhas
                }]
            },
            options: {
                scales: {
                    x: {
                        title: {
                            display: true,
                            text: 'Data'
                        }
                    },
                    y: {
                        title: {
                            display: true,
                            text: 'Valor'
                        },
                        beginAtZero: true // Inicia o eixo Y no zero
                    }
                }
            }
        });
    </script>
</body>
</html>
