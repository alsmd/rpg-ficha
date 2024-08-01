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
                                    if isinstance(item.value.args[0], ast.Name):
                                        related_model = item.value.args[0].id
                                    elif isinstance(item.value.args[0], ast.Attribute):
                                        related_model = item.value.args[0].attr
                            if field_type and related_model:
                                fields.append(f"{field_name} ({field_type} to {related_model})")
                            else:
                                fields.append(field_name)
            classes[class_name] = fields
    return classes

# Função para criar o grafo completo
def create_full_graph(classes):
    G = nx.DiGraph()
    
    # Adicionar nós e arestas
    for class_name, fields in classes.items():
        field_labels = "\n".join(fields)
        G.add_node(class_name, label=field_labels, shape='box', style='filled', color='lightblue')
        for field in fields:
            if "to" in field:
                related_model = field.split("to")[-1].strip().split()[0]
                if related_model in classes:
                    G.add_edge(class_name, related_model)
    
    return G

# Função para criar um subgrafo com a classe solicitada e suas relações
def create_subgraph(G, class_name):
    if class_name not in G:
        print(f"Classe '{class_name}' não encontrada.")
        return None
    neighbors = list(G.neighbors(class_name))
    sub_nodes = [class_name] + neighbors
    sub_graph = G.subgraph(sub_nodes).copy()
    return sub_graph

# Função para desenhar o grafo
def draw_graph(G, pos, title="Diagrama de Relacionamentos dos Modelos Django"):
    plt.figure(figsize=(20, 16))
    labels = nx.get_node_attributes(G, 'label')
    nx.draw(G, pos, with_labels=True, labels=labels, node_size=3000, node_color='lightblue', font_size=8, font_weight='bold', edge_color='gray', node_shape='o')
    plt.title(title)
    plt.gca().set_aspect('equal', adjustable='box')  # Manter a proporção igual
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
    sub_pos = nx.spring_layout(sub_graph, k=1.5, iterations=50)
    draw_graph(sub_graph, sub_pos, title=f'Relações de {class_name}')
else:
    print("Nenhum gráfico a ser exibido.")
