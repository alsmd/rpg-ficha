import ast
import networkx as nx
import matplotlib.pyplot as plt

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
                                    # Verificar se o argumento é uma string (nome do modelo)
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

# Função para criar o grafo completo
def create_full_graph(classes):
    G = nx.DiGraph()
    
    # Adicionar nós e arestas
    for class_name, fields in classes.items():
        G.add_node(class_name)
        for field in fields:
            if "to" in field:
                parts = field.split("to")
                if len(parts) > 1:
                    related_model = parts[-1].strip().split()[0]
                    if related_model in classes:
                        G.add_edge(class_name, related_model)
                        # Adicionar também as relações inversas
                        G.add_edge(related_model, class_name)
    
    return G

# Função para criar um subgrafo com a classe solicitada e suas relações
def create_subgraph(G, class_name):
    if class_name not in G:
        print(f"Classe '{class_name}' não encontrada.")
        return None
    
    # Obter todos os vizinhos da classe e também adicionar as relações inversas
    neighbors = set(G.neighbors(class_name))
    additional_nodes = set(neighbors)
    
    for neighbor in neighbors:
        additional_nodes.update(G.neighbors(neighbor))
    
    sub_nodes = list(additional_nodes) + [class_name]
    sub_graph = G.subgraph(sub_nodes).copy()
    return sub_graph

# Função para desenhar o grafo
def draw_graph(G, pos, title="Diagrama de Relacionamentos dos Modelos Django"):
    fig, ax = plt.subplots(figsize=(20, 16))
    
    # Desenhar o grafo
    nx.draw(G, pos, with_labels=True, node_size=3000, node_color='lightblue', font_size=8, font_weight='bold', edge_color='gray', node_shape='o', alpha=0.7, ax=ax)
    
    plt.title(title)
    plt.show(block=True)  # Manter a janela aberta até que o usuário a feche

# Solicitar nome da classe ao usuário
def get_class_name():
    class_name = input("Digite o nome da classe para visualizar: ")
    return class_name

# Caminho para o arquivo models.py
models_file_path = "myapp/models.py"

# Analisar os modelos e criar o grafo completo
classes = analyze_models(models_file_path)
G = create_full_graph(classes)

# Solicitar a classe do usuário e desenhar o gráfico correspondente
class_name = get_class_name()
sub_graph = create_subgraph(G, class_name)
if sub_graph:
    sub_pos = nx.spring_layout(sub_graph, k=1.5, iterations=50, scale=2)  # Ajustar a escala e iterações para melhor distribuição
    draw_graph(sub_graph, sub_pos, title=f'Relações de {class_name}')
else:
    print("Nenhum gráfico a ser exibido.")
