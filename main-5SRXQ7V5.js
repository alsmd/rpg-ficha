import { Component, OnInit } from '@angular/core';
import { MetricasService, IIndicadoresAws } from '../metricas.service';

@Component({
  selector: 'app-header-metricas',
  templateUrl: './header-metricas.component.html',
  styleUrls: ['./header-metricas.component.css']
})
export class HeaderMetricasComponent implements OnInit {
  public totalManuais: number = 0;
  public totalApi: number = 0;
  public totalGeral: number = 0;

  constructor(private metricasService: MetricasService) {}

  ngOnInit(): void {
    this.metricasService.getIndicadoresAws().subscribe((data: IIndicadoresAws) => {
      this.calculateTotals(data);
    });
  }

  calculateTotals(data: IIndicadoresAws): void {
    this.totalManuais = data.aws_emitidos_manuais.reduce((sum, metrica) => sum + +metrica.numero_emitido, 0);
    this.totalApi = data.aws_emitidos_api.reduce((sum, metrica) => sum + +metrica.numero_emitido, 0);
    this.totalGeral = data.aws_emitidos_totais.reduce((sum, metrica) => sum + +metrica.numero_emitido, 0);
  }
}
3. Template do Componente do Header
No arquivo header-metricas.component.html, exiba as informações gerais.

html
Copy code
<!-- header-metricas.component.html -->
<div class="header-metricas">
  <h1>Resumo das Métricas</h1>
  <p>Total Emitidos Manuais: {{ totalManuais }}</p>
  <p>Total Emitidos API: {{ totalApi }}</p>
  <p>Total Emitidos Totais: {{ totalGeral }}</p>
</div>
4. Estilize o Header
Adicione estilos ao seu componente em header-metricas.component.css se necessário.

css
Copy code
/* header-metricas.component.css */
.header-metricas {
  background-color: #f8f9fa;
  padding: 1em;
  border-radius: 0.5em;
  box-shadow: 0 0.125rem 0.25rem rgba(0, 0, 0, 0.075);
  text-align: center;
  margin-bottom: 1em;
}

.header-metricas h1 {
  margin-bottom: 0.5em;
  font-size: 1.5em;
}

.header-metricas p {
  margin: 0.5em 0;
  font-size: 1.2em;
                                                      }
