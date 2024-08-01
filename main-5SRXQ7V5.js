import ast
import networkx as nx
import matplotlib.pyplot as plt
from matplotlib.backend_bases import PickEvent

# Função para analisar o arquivo models.py e extrair classes e relações
def analyze_models(file_path):
    with open(file_path, "r") as file:
        tree = ast.parse(file.read(), filename=file_path)

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
                                    if isinstance(item.value.args[0], ast.Name):
                                        related_model = item.value.args[0].id
                                    elif isinstance(item.value.args[0], ast.Attribute):
                                        related_model = item.value.args[0].attr
                            if field_type and related_model:
                                fields.append((field_name, field_type, related_model))
            classes[class_name] = fields
    return classes

# Função para criar o grafo completo
def create_full_graph(classes):
    G = nx.DiGraph()
    
    # Adicionar nós e arestas
    for class_name, fields in classes.items():
        G.add_node(class_name, shape='box', style='filled', color='lightblue')
        for field_name, field_type, related_model in fields:
            if field_type in ["ForeignKey", "ManyToManyField"]:
                G.add_edge(class_name, related_model)
    
    return G

# Função para criar um subgrafo com as relações de um nó específico
def create_subgraph(G, node):
    neighbors = list(G.neighbors(node))
    sub_nodes = [node] + neighbors
    sub_graph = G.subgraph(sub_nodes).copy()
    return sub_graph

# Função para desenhar o grafo
def draw_graph(G, pos, title="Diagrama de Relacionamentos dos Modelos Django"):
    plt.figure(figsize=(20, 16))
    nx.draw(G, pos, with_labels=True, node_size=3000, node_color='lightblue', font_size=10, font_weight='bold', edge_color='gray', node_shape='o', pickable=True)
    plt.title(title)
    plt.show(block=False)  # Não bloquear o código para permitir a interação

# Callback para eventos de clique nos nós
def on_click(event):
    if event.artist is not None:
        node = event.artist.get_label()
        if node in G:
            plt.clf()  # Limpar a figura
            sub_graph = create_subgraph(G, node)
            sub_pos = nx.spring_layout(sub_graph, k=1.5, iterations=50)
            draw_graph(sub_graph, sub_pos, title=f'Relações de {node}')
            plt.draw()

# Caminho para o arquivo models.py
models_file_path = "myapp/models.py"

# Analisar os modelos e criar o grafo completo
classes = analyze_models(models_file_path)
G = create_full_graph(classes)

# Desenhar o grafo completo
pos = nx.spring_layout(G, k=1.5, iterations=50)
draw_graph(G, pos)

# Conectar o callback de clique
fig = plt.gcf()
fig.canvas.mpl_connect('pick_event', on_click)

# Exibir o grafo
plt.show()
