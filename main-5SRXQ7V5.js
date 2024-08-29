import pydot
from sqlalchemy import create_engine, MetaData

# Ler o arquivo SQL
sql_file = 'caminho/para/seu_arquivo.sql'
with open(sql_file, 'r') as file:
    sql_commands = file.read()

# Criar um engine de SQLite para parsing
engine = create_engine('sqlite:///:memory:')
with engine.connect() as conn:
    conn.execute(sql_commands)
    metadata = MetaData(bind=engine)
    metadata.reflect()

# Criar o gráfico
graph = pydot.Dot(graph_type='digraph')

# Adicionar tabelas e colunas ao gráfico
for table_name, table in metadata.tables.items():
    node = pydot.Node(table_name, shape='record', label='{{{}|{}}}'.format(
        table_name, '|'.join([col.name for col in table.columns])))
    graph.add_node(node)

# Adicionar chaves estrangeiras ao gráfico
for table_name, table in metadata.tables.items():
    for fk in table.foreign_keys:
        edge = pydot.Edge(fk.column.table.name, table_name)
        graph.add_edge(edge)

# Salvar o gráfico como um arquivo .svg
graph.write_svg('output.svg')
