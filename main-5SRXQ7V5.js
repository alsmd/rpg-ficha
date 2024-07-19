
Para resolver o problema de binding dos dados ao canvas, podemos utilizar o método de atualização dos dados diretamente no Chart.js. Aqui está uma abordagem alternativa:

1. Instale as Dependências
Já instalamos as dependências anteriormente:

sh
Copiar código
npm install chart.js
npm install ng2-charts
2. Serviço para Buscar os Dados da API
Como anteriormente, configure o serviço para buscar os dados da API.

typescript
Copiar código
// metricas.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface IMetrica {
  numero_emitido: string;
  mes: string;
  ano: string;
}

export interface IIndicadoresAws {
  aws_emitidos_manuais: IMetrica[];
  aws_emitidos_api: IMetrica[];
  aws_emitidos_totais: IMetrica[];
}

@Injectable({
  providedIn: 'root'
})
export class MetricasService {
  private apiUrl = 'URL_DA_SUA_API';

  constructor(private http: HttpClient) {}

  getIndicadoresAws(): Observable<IIndicadoresAws> {
    return this.http.get<IIndicadoresAws>(this.apiUrl);
  }
}
3. Componente para Exibir o Gráfico
Vamos configurar o componente para exibir o gráfico e usar métodos do Chart.js para atualizar os dados.

typescript
Copiar código
// grafico-metricas.component.ts
import { Component, OnInit } from '@angular/core';
import { Chart, ChartData, ChartOptions, ChartType } from 'chart.js';
import { MetricasService, IIndicadoresAws } from '../metricas.service';

@Component({
  selector: 'app-grafico-metricas',
  templateUrl: './grafico-metricas.component.html',
  styleUrls: ['./grafico-metricas.component.css']
})
export class GraficoMetricasComponent implements OnInit {
  public chart: any;

  constructor(private metricasService: MetricasService) {}

  ngOnInit(): void {
    this.createChart();
    this.metricasService.getIndicadoresAws().subscribe((data: IIndicadoresAws) => {
      this.updateChartData(data);
    });
  }

  createChart(): void {
    const ctx = document.getElementById('myChart') as HTMLCanvasElement;
    this.chart = new Chart(ctx, {
      type: 'bar' as ChartType,
      data: {
        labels: [],
        datasets: [
          { label: 'Emitidos Manuais', data: [], backgroundColor: 'rgba(75, 192, 192, 0.6)' },
          { label: 'Emitidos API', data: [], backgroundColor: 'rgba(153, 102, 255, 0.6)' },
          { label: 'Emitidos Totais', data: [], backgroundColor: 'rgba(255, 159, 64, 0.6)' }
        ]
      },
      options: {
        responsive: true,
        scales: {
          x: {},
          y: { beginAtZero: true }
        }
      }
    });
  }

  updateChartData(data: IIndicadoresAws): void {
    const labels = data.aws_emitidos_totais.map(metrica => `${metrica.mes}/${metrica.ano}`);
    const manualData = data.aws_emitidos_manuais.map(metrica => +metrica.numero_emitido);
    const apiData = data.aws_emitidos_api.map(metrica => +metrica.numero_emitido);
    const totalData = data.aws_emitidos_totais.map(metrica => +metrica.numero_emitido);

    this.chart.data.labels = labels;
    this.chart.data.datasets[0].data = manualData;
    this.chart.data.datasets[1].data = apiData;
    this.chart.data.datasets[2].data = totalData;
    this.chart.update();
  }
}
4. Template do Componente
No template, apenas referencie o canvas.

html
Copiar código
<!-- grafico-metricas.component.html -->
<div style="display: block;">
  <canvas id="myChart"></canvas>
</div>
