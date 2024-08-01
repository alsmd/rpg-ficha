pip install Flask
Código do Backend (app.py):

python
Copy code
from flask import Flask, request, jsonify, send_from_directory
import ast
import json

app = Flask(__name__)

# Função para analisar o arquivo models.py e extrair classes e relações
def analyze_models(file_content):
    tree = ast.parse(file_content)
    classes = {}
    for node in ast.walk(tree):
        if isinstance(node, ast.ClassDef):
            class_name = node.name
            fields = []
            for item in node.body:
                if isinstance(item, ast.Assign):
                    for target in item.targets:
                        if isinstance(target, ast.Name):
                            field_name = target.id
                            field_type = None
                            related_model = None
                            if isinstance(item.value, ast.Call):
                                field_type = item.value.func.attr
                                if field_type in ["ForeignKey", "ManyToManyField"]:
                                    if isinstance(item.value.args[0], ast.Constant):
                                        related_model = item.value.args[0].value
                                    elif isinstance(item.value.args[0], ast.Name):
                                        related_model = item.value.args[0].id
                                    elif isinstance(item.value.args[0], ast.Attribute):
                                        related_model = item.value.args[0].attr
                            if field_type and related_model:
                                fields.append(f"{field_name}: {field_type} to {related_model}")
            classes[class_name] = fields
    return classes

@app.route('/upload', methods=['POST'])
def upload_file():
    file = request.files['file']
    file_content = file.read().decode('utf-8')
    classes = analyze_models(file_content)
    return jsonify(classes)

@app.route('/')
def index():
    return send_from_directory('.', 'index.html')

if __name__ == '__main__':
    app.run(debug=True)
2. Criar a Interface HTML + JavaScript
Código HTML (index.html):

html
Copy code
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Diagrama de Modelos Django</title>
    <script src="https://d3js.org/d3.v7.min.js"></script>
    <style>
        #graph {
            width: 100%;
            height: 600px;
        }
    </style>
</head>
<body>
    <h1>Visualizador de Modelos Django</h1>
    <input type="file" id="fileInput" />
    <button onclick="uploadFile()">Enviar</button>
    <div id="graph"></div>

    <script>
        function uploadFile() {
            const fileInput = document.getElementById('fileInput');
            const file = fileInput.files[0];
            if (!file) {
                alert('Por favor, selecione um arquivo.');
                return;
            }

            const formData = new FormData();
            formData.append('file', file);

            fetch('/upload', {
                method: 'POST',
                body: formData
            })
            .then(response => response.json())
            .then(data => {
                drawGraph(data);
            })
            .catch(error => console.error('Erro:', error));
        }

        function drawGraph(classes) {
            const width = 800;
            const height = 600;
            const svg = d3.select("#graph").append("svg")
                .attr("width", width)
                .attr("height", height);

            const nodes = [];
            const links = [];

            // Adicionar nós e arestas
            Object.keys(classes).forEach(className => {
                nodes.push({ id: className });
                classes[className].forEach(field => {
                    const parts = field.split("to");
                    if (parts.length > 1) {
                        const relatedModel = parts[1].trim().split()[0];
                        if (classes[relatedModel]) {
                            nodes.push({ id: relatedModel });
                            links.push({ source: className, target: relatedModel });
                        }
                    }
                });
            });

            // Criação do grafo
            const simulation = d3.forceSimulation(nodes)
                .force("link", d3.forceLink(links).id(d => d.id))
                .force("charge", d3.forceManyBody())
                .force("center", d3.forceCenter(width / 2, height / 2));

            const link = svg.append("g")
                .selectAll("line")
                .data(links)
                .enter().append("line")
                .attr("stroke", "#999")
                .attr("stroke-width", "1.5px");

            const node = svg.append("g")
                .selectAll("circle")
                .data(nodes)
                .enter().append("circle")
                .attr("r", 5)
                .attr("fill", "#69b3a2")
                .call(d3.drag()
                    .on("start", dragstarted)
                    .on("drag", dragged)
                    .on("end", dragended));

            node.append("title")
                .text(d => d.id);

            simulation.on("tick", () => {
                link
                    .attr("x1", d => d.source.x)
                    .attr("y1", d => d.source.y)
                    .attr("x2", d => d.target.x)
                    .attr("y2", d => d.target.y);

                node
                    .attr("cx", d => d.x)
                    .attr("cy", d => d.y);
            });

            function dragstarted(event, d) {
                if (!event.active) simulation.alphaTarget(0.3).restart();
                d.fx = d.x;
                d.fy = d.y;
            }

            function dragged(event, d) {
                d.fx = event.x;
                d.fy = event.y;
            }

            function dragended(event, d) {
                if (!event.active) simulation.alphaTarget(0);
                d.fx = null;
                d.fy = null;
            }
        }
    </script>
</body>
</html>
Explicação
