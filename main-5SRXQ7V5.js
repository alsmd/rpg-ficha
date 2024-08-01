<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Diagrama de Modelos Django</title>
    <script src="https://d3js.org/d3.v7.min.js"></script>
    <style>
        body {
            font-family: Arial, sans-serif;
        }
        #graph {
            width: 100vw;
            height: 80vh;
            border: 1px solid #ddd;
            margin: 0;
            padding: 0;
            overflow: hidden;
        }
        .node text {
            font-size: 12px;
            pointer-events: none;
        }
        /* Modal styles */
        .modal {
            display: none; /* Hidden by default */
            position: fixed; 
            z-index: 1; 
            left: 0;
            top: 0;
            width: 100%;
            height: 100%;
            overflow: auto; 
            background-color: rgb(0,0,0); 
            background-color: rgba(0,0,0,0.4); 
            padding-top: 60px;
        }
        .modal-content {
            background-color: #fefefe;
            margin: 5% auto; 
            padding: 20px;
            border: 1px solid #888;
            width: 80%; 
        }
        .close {
            color: #aaa;
            float: right;
            font-size: 28px;
            font-weight: bold;
        }
        .close:hover,
        .close:focus {
            color: black;
            text-decoration: none;
            cursor: pointer;
        }
    </style>
</head>
<body>
    <h1>Visualizador de Modelos Django</h1>
    <input type="file" id="fileInput" />
    <button onclick="uploadFile()">Enviar</button>
    <br>
    <input type="text" id="classNameInput" placeholder="Digite o nome da classe" />
    <button onclick="filterGraph()">Filtrar Classe</button>
    <button onclick="showAll()">Mostrar Todos</button>
    <div id="graph"></div>

    <!-- Modal -->
    <div id="myModal" class="modal">
        <div class="modal-content">
            <span class="close">&times;</span>
            <h2>Campos da Classe</h2>
            <div id="modalBody"></div>
        </div>
    </div>

    <script>
        let graphData = null;

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
                graphData = data;
                drawGraph(graphData);
            })
            .catch(error => console.error('Erro:', error));
        }

        function filterGraph() {
            const className = document.getElementById('classNameInput').value;
            if (!graphData || !className) {
                alert('Por favor, envie o arquivo e digite o nome da classe.');
                return;
            }

            const filteredData = createSubgraphData(graphData, className);
            drawGraph(filteredData);
        }

        function showAll() {
            if (!graphData) {
                alert('Por favor, envie o arquivo primeiro.');
                return;
            }

            drawGraph(graphData);
        }

        function createSubgraphData(classes, className) {
            if (!(className in classes)) {
                alert(`Classe '${className}' não encontrada.`);
                return { nodes: [], links: [] };
            }

            const nodes = [];
            const links = [];
            const queue = [className];
            const visited = new Set();

            while (queue.length) {
                const node = queue.shift();
                if (!visited.has(node)) {
                    visited.add(node);
                    nodes.push({ id: node });
                    const fields = classes[node] || [];
                    
                    // Adiciona as relações da classe especificada
                    fields.forEach(field => {
                        const parts = field.split("to");
                        if (parts.length > 1) {
                            const relatedModel = parts[1].trim().split()[0];
                            if (classes[relatedModel] && !visited.has(relatedModel)) {
                                nodes.push({ id: relatedModel });
                                links.push({ source: node, target: relatedModel });
                                queue.push(relatedModel);
                            }
                        }
                    });

                    // Adiciona as relações reversas
                    Object.keys(classes).forEach(relatedClass => {
                        const relatedFields = classes[relatedClass];
                        relatedFields.forEach(field => {
                            const parts = field.split("to");
                            if (parts.length > 1) {
                                const relatedModel = parts[1].trim().split()[0];
                                if (relatedModel === node && !visited.has(relatedClass)) {
                                    nodes.push({ id: relatedClass });
                                    links.push({ source: relatedClass, target: node });
                                    queue.push(relatedClass);
                                }
                            }
                        });
                    });
                }
            }

            return { nodes, links };
        }

        function drawGraph(data) {
            const width = window.innerWidth;
            const height = window.innerHeight * 0.8;
            const svg = d3.select("#graph").selectAll("*").remove(); // Clear existing content
            const svgElement = d3.select("#graph").append("svg")
                .attr("width", width)
                .attr("height", height);

            const zoom = d3.zoom()
                .scaleExtent([0.1, 10])
                .on("zoom", (event) => {
                    svgElement.select("g").attr("transform", event.transform);
                });

            svgElement.call(zoom);

            const container = svgElement.append("g"); // Container for nodes and links

            const simulation = d3.forceSimulation(data.nodes)
                .force("link", d3.forceLink(data.links).id(d => d.id).distance(150)) // Ajuste o valor de distância
                .force("charge", d3.forceManyBody().strength(-300)) // Ajuste a força de repulsão
                .force("center", d3.forceCenter(width / 2, height / 2));

            const link = container.append("g")
                .selectAll("line")
                .data(data.links)
                .enter().append("line")
                .attr("stroke", "#999")
                .attr("stroke-width", "1.5px");

            const node = container.append("g")
                .selectAll("circle")
                .data(data.nodes)
                .enter().append("circle")
                .attr("r", 10)
                .attr("fill", "#69b3a2")
                .on("contextmenu", (event, d) => {
                    event.preventDefault();
                    showModal(d.id);
                })
                .call(d3.drag()
                    .on("start", dragstarted)
                    .on("drag", dragged)
                    .on("end", dragended));

            node.append("title")
                .text(d => d.id);

            container.append("g")
                .selectAll("text")
                .data(data.nodes)
                .enter().append("text")
                .attr("x", d => d.x)
                .attr("y", d => d.y)
                .attr("dy", -15)
                .attr("text-anchor", "middle")
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

                container.selectAll("text")
                    .attr("x", d => d.x)
                    .attr("y", d => d.y);
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

        function showModal(nodeId) {
            const fields = graphData[nodeId] || [];
            const modalBody = document.getElementById('modalBody');
            modalBody.innerHTML = `<strong>${nodeId}</strong><br>${fields.join('<br>')}`;

            const modal = document.getElementById('myModal');
            modal.style.display = "block";

            const span = document.getElementsByClassName("close")[0];
            span.onclick = function() {
                modal.style.display = "none";
            }

            window.onclick = function(event) {
                if (event.target == modal) {
                    modal.style.display = "none";
                }
            }
        }
    </script>
</body>
</html>
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
                                    fields.append(f"{field_name}: {field_type} to {related_model}")
                                else:
                                    field_type = "Other field type"
                                    fields.append(f"{field_name}: {field_type}")
                            else:
                                field_type = "Other field type"
                                fields.append(f"{field_name}: {field_type}")
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
