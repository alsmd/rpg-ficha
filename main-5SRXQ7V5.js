import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Chart, ChartData, ChartType } from 'chart.js';
import { MetricasService, IIndicadoresAws, IMetrica } from '../metricas.service';

@Component({
  selector: 'app-grafico-metricas',
  templateUrl: './grafico-metricas.component.html',
  styleUrls: ['./grafico-metricas.component.css']
})
export class GraficoMetricasComponent implements OnInit {
  @ViewChild('chartCanvas', { static: true }) chartCanvas!: ElementRef;
  public chart: any;
  public years: number[] = [];
  public selectedYear: number | null = null;
  public chartTypes: ChartType[] = ['bar', 'line', 'pie'];
  public selectedChartType: ChartType = 'bar';
  private rawData: IIndicadoresAws | null = null;

  constructor(private metricasService: MetricasService) {}

  ngOnInit(): void {
    this.createChart();
    this.metricasService.getIndicadoresAws().subscribe((data: IIndicadoresAws) => {
      this.rawData = data;
      this.extractYears(data);
      this.updateChartData();
    });
  }

  createChart(): void {
    const ctx = this.chartCanvas.nativeElement.getContext('2d');
    this.chart = new Chart(ctx, {
      type: this.selectedChartType,
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
          x: { display: this.selectedChartType !== 'pie' },
          y: { display: this.selectedChartType !== 'pie', beginAtZero: true }
        }
      }
    });
  }

  extractYears(data: IIndicadoresAws): void {
    const yearsSet = new Set<number>();
    data.aws_emitidos_manuais.forEach(metrica => yearsSet.add(+metrica.ano));
    data.aws_emitidos_api.forEach(metrica => yearsSet.add(+metrica.ano));
    data.aws_emitidos_totais.forEach(metrica => yearsSet.add(+metrica.ano));
    this.years = Array.from(yearsSet).sort();
  }

  updateChartData(): void {
    if (!this.rawData) return;

    const filteredData = this.filterDataByYear(this.rawData, this.selectedYear);
    const processedData = this.processData(filteredData);
    this.chart.data.labels = processedData.labels;
    this.chart.data.datasets[0].data = processedData.manualData;
    this.chart.data.datasets[1].data = processedData.apiData;
    this.chart.data.datasets[2].data = processedData.totalData;
    this.chart.update();
  }

  filterDataByYear(data: IIndicadoresAws, year: number | null): IIndicadoresAws {
    if (year === null) return data;

    const filterByYear = (metrica: IMetrica) => +metrica.ano === year;

    return {
      aws_emitidos_manuais: data.aws_emitidos_manuais.filter(filterByYear),
      aws_emitidos_api: data.aws_emitidos_api.filter(filterByYear),
      aws_emitidos_totais: data.aws_emitidos_totais.filter(filterByYear),
    };
  }

  processData(data: IIndicadoresAws) {
    const consolidatedData = new Map<string, { manual: number, api: number, total: number }>();

    const addData = (metrica: IMetrica, type: 'manual' | 'api' | 'total') => {
      const key = `${metrica.ano}-${metrica.mes}`;
      if (!consolidatedData.has(key)) {
        consolidatedData.set(key, { manual: 0, api: 0, total: 0 });
      }
      consolidatedData.get(key)![type] += +metrica.numero_emitido;
    };

    data.aws_emitidos_manuais.forEach(metrica => addData(metrica, 'manual'));
    data.aws_emitidos_api.forEach(metrica => addData(metrica, 'api'));
    data.aws_emitidos_totais.forEach(metrica => addData(metrica, 'total'));

    const sortedKeys = Array.from(consolidatedData.keys()).sort((a, b) => new Date(a).getTime() - new Date(b).getTime());

    const labels = sortedKeys;
    const manualData = sortedKeys.map(key => consolidatedData.get(key)!.manual);
    const apiData = sortedKeys.map(key => consolidatedData.get(key)!.api);
    const totalData = sortedKeys.map(key => consolidatedData.get(key)!.total);

    return { labels, manualData, apiData, totalData };
  }

  onYearChange(event: any): void {
    this.selectedYear = event.target.value ? +event.target.value : null;
    this.updateChartData();
  }

  onChartTypeChange(event: any): void {
    this.selectedChartType = event.target.value;
    this.chart.destroy();
    this.createChart();
    this.updateChartData();
  }
}
2. Atualize o Template do Componente
Adicione um seletor de tipo de gráfico no template para permitir que o usuário selecione qual gráfico exibir.

html
Copy code
<!-- grafico-metricas.component.html -->
<div style="display: block;">
  <label for="year-select">Selecione o Ano:</label>
  <select id="year-select" (change)="onYearChange($event)">
    <option value="">Todos</option>
    <option *ngFor="let year of years" [value]="year">{{ year }}</option>
  </select>
</div>
<div style="display: block;">
  <label for="chart-type-select">Selecione o Tipo de Gráfico:</label>
  <select id="chart-type-select" (change)="onChartTypeChange($event)">
    <option *ngFor="let chartType of chartTypes" [value]="chartType">{{ chartType }}</option>
  </select>
</div>
<div style="display: block;">
  <canvas #chartCanvas></canvas>
</div>
3. Teste a Solução
Agora, ao selecionar um tipo de gráfico no dropdown, o gráfico será atualizado para exibir o tipo selecionado. Caso o usuário selecione um ano específico, apenas os dados desse ano serão exibidos.

Com essa abordagem, você permite que o usuário selecione diferentes tipos de gráficos (barras, linhas, pizza) e filtre os dados por ano, garantindo uma experiência interativa e personalizável.
