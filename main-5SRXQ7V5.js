import matplotlib.pyplot as plt
import networkx as nx
from django.conf import settings
from django.apps import apps
from django.db import models

# Configura Django
settings.configure(
    INSTALLED_APPS=[
        # Adicione o nome da sua aplicação aqui
        'myapp',
    ],
    DATABASES={
        'default': {
            'ENGINE': 'django.db.backends.sqlite3',
            'NAME': 'db.sqlite3',
        }
    },
)

# Inicialize Django
import django
django.setup()

# Crie um grafo direcionado
G = nx.DiGraph()

# Obtenha todos os modelos
for model in apps.get_models():
    model_name = model.__name__
    # Adiciona o nó para o modelo
    G.add_node(model_name, shape='box', style='filled', color='lightblue')

    # Adiciona arestas para as relações ForeignKey
    for field in model._meta.get_fields():
        if isinstance(field, models.ForeignKey):
            related_model = field.related_model.__name__
            # Adiciona uma aresta do modelo para o modelo relacionado
            G.add_edge(model_name, related_model)

# Definir a posição dos nós
pos = nx.spring_layout(G)

# Desenhar o grafo
plt.figure(figsize=(12, 10))
nx.draw(G, pos, with_labels=True, node_size=3000, node_color='lightblue', font_size=10, font_weight='bold', edge_color='gray')
plt.title('Diagrama de Relacionamentos dos Modelos Django')
plt.show()
