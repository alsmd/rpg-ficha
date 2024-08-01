import ast
import os
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
            base_names = [base.id for base in node.bases if isinstance(base, ast.Name)]
            if "models.Model" in base_names:
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
                                if field_type and related_model:
                                    fields.append((field_name, field_type, related_model))
                classes[class_name] = fields
    return classes

# Função para criar o diagrama
def create_diagram(classes):
    G = nx.DiGraph()
    
    # Adicionar nós e arestas
    for class_name, fields in classes.items():
        G.add_node(class_name, shape='box', style='filled', color='lightblue')
        for field_name, field_type, related_model in fields:
            if field_type in ["ForeignKey", "ManyToManyField"]:
                G.add_edge(class_name, related_model)
    
    # Desenhar o grafo
    pos = nx.spring_layout(G)
    plt.figure(figsize=(12, 10))
    nx.draw(G, pos, with_labels=True, node_size=3000, node_color='lightblue', font_size=10, font_weight='bold', edge_color='gray')
    plt.title('Diagrama de Relacionamentos dos Modelos Django')
    plt.show()

# Caminho para o arquivo models.py
models_file_path = "myapp/models.py"

# Analisar os modelos e criar o diagrama
classes = analyze_models(models_file_path)

# Verificação de depuração
print("Classes e Relações Encontradas:")
for class_name, fields in classes.items():
    print(f"Classe: {class_name}")
    for field in fields:
        print(f"  Campo: {field[0]}, Tipo: {field[1]}, Relacionado a: {field[2]}")

create_diagram(classes)
