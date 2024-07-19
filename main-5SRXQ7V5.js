
Para criar um componente Angular que busca dados de uma API e exibe-os em um gráfico usando Chart.js, siga os passos abaixo:

1. Instale as Dependências
Primeiro, instale o Chart.js e a biblioteca ng2-charts para integrar o Chart.js com Angular.

sh
Copiar código
npm install chart.js
npm install ng2-charts
2. Crie o Serviço para Buscar os Dados da API
Crie um serviço Angular que buscará os dados da API.

sh
Copiar código
ng generate service metricas
Em metricas.service.ts, adicione o código para buscar os dados da API:

typescript
Copiar código
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
3. Crie o Componente para Exibir o Gráfico
Crie um componente que exibirá o gráfico.

sh
Copiar código
ng generate component grafico-metricas
Em grafico-metricas.component.ts, configure o gráfico:

typescript
Copiar código
import { Component, OnInit } from '@angular/core';
import { ChartData, ChartOptions } from 'chart.js';
import { MetricasService, IIndicadoresAws } from '../metricas.service';

@Component({
  selector: 'app-grafico-metricas',
  templateUrl: './grafico-metricas.component.html',
  styleUrls: ['./grafico-metricas.component.css']
})
export class GraficoMetricasComponent implements OnInit {
  public chartData: ChartData<'bar'>;
  public chartOptions: ChartOptions = {
    responsive: true,
    scales: {
      x: {},
      y: { beginAtZero: true }
    }
  };

  constructor(private metricasService: MetricasService) {}

  ngOnInit(): void {
    this.metricasService.getIndicadoresAws().subscribe((data: IIndicadoresAws) => {
      this.chartData = this.transformDataToChart(data);
    });
  }

  transformDataToChart(data: IIndicadoresAws): ChartData<'bar'> {
    const labels = data.aws_emitidos_totais.map(metrica => `${metrica.mes}/${metrica.ano}`);
    const manualData = data.aws_emitidos_manuais.map(metrica => +metrica.numero_emitido);
    const apiData = data.aws_emitidos_api.map(metrica => +metrica.numero_emitido);
    const totalData = data.aws_emitidos_totais.map(metrica => +metrica.numero_emitido);

    return {
      labels,
      datasets: [
        { label: 'Emitidos Manuais', data: manualData, backgroundColor: 'rgba(75, 192, 192, 0.6)' },
        { label: 'Emitidos API', data: apiData, backgroundColor: 'rgba(153, 102, 255, 0.6)' },
        { label: 'Emitidos Totais', data: totalData, backgroundColor: 'rgba(255, 159, 64, 0.6)' }
      ]
    };
  }
}
Em grafico-metricas.component.html, adicione o elemento do gráfico:

html
Copiar código
<div style="display: block;">
  <canvas baseChart
    [data]="chartData"
    [options]="chartOptions"
    chartType="bar">
  </canvas>
</div>
4. Configure o Módulo
Assegure-se de que o módulo importe os módulos necessários.

Em app.module.ts, importe os módulos:

typescript
Copiar código
import { HttpClientModule } from '@angular/common/http';
import { NgChartsModule } from 'ng2-charts';

@NgModule({
  declarations: [
    // outros componentes
    GraficoMetricasComponent
  ],
  imports: [
    // outros módulos
    HttpClientModule,
    NgChartsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
5. Use o Componente no Template
Agora, use o componente onde deseja exibir o gráfico, por exemplo, em app.component.html:

html
Copiar código
<app-grafico-metricas></app-grafico-metricas>
6. Estilize o Componente
Adicione estilos ao seu componente em grafico-metricas.component.css se necessário.

css
Copiar código
/* Exemplo de estilos */
canvas {
  max-width: 100%;
  height: auto;
}
Com esses pas
