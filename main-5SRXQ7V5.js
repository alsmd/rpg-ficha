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
        }
        .node text {
            font-size: 12px;
            pointer-events: none;
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
    <div id="graph"></div>

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

            const simulation = d3.forceSimulation(data.nodes)
                .force("link", d3.forceLink(data.links).id(d => d.id))
                .force("charge", d3.forceManyBody())
                .force("center", d3.forceCenter(width / 2, height / 2));

            const link = svgElement.append("g")
                .selectAll("line")
                .data(data.links)
                .enter().append("line")
                .attr("stroke", "#999")
                .attr("stroke-width", "1.5px");

            const node = svgElement.append("g")
                .selectAll("circle")
                .data(data.nodes)
                .enter().append("circle")
                .attr("r", 10)
                .attr("fill", "#69b3a2")
                .call(d3.drag()
                    .on("start", dragstarted)
                    .on("drag", dragged)
                    .on("end", dragended));

            node.append("title")
                .text(d => d.id);

            svgElement.append("g")
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

                svgElement.selectAll("text")
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
    </script>
</body>
</html>
