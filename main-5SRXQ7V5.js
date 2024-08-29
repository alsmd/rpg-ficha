import pydot
from sqlalchemy import create_engine, MetaData
from sqlalchemy.sql import text

# Função para ler o arquivo .SQL e executar os comandos SQL
def parse_sql_file(sql_file):
    with open(sql_file, 'r') as file:
        sql_commands = file.read()

    return sql_commands

# Função para criar e salvar o diagrama
def create_erd_from_sql(sql_file, output_file):
    # Criar engine SQLite em memória
    engine = create_engine('sqlite:///:memory:')
    
    # Criar um objeto MetaData
    metadata = MetaData()
    
    # Ler o arquivo SQL
    sql_commands = parse_sql_file(sql_file)
    
    # Executar os comandos SQL para criar as tabelas
    with engine.connect() as connection:
        connection.execute(text(sql_commands))
        metadata.reflect(bind=connection)

    # Criar o gráfico
    graph = pydot.Dot(graph_type='digraph')

    # Adicionar tabelas e colunas ao gráfico
    for table_name, table in metadata.tables.items():
        node = pydot.Node(
            table_name, 
            shape='record', 
            label='{{{}|{}}}'.format(
                table_name, 
                '|'.join([f"{col.name} : {col.type}" for col in table.columns])
            )
        )
        graph.add_node(node)

    # Adicionar chaves estrangeiras ao gráfico
    for table_name, table in metadata.tables.items():
        for fk in table.foreign_keys:
            edge = pydot.Edge(fk.column.table.name, table_name)
            graph.add_edge(edge)

    # Salvar o gráfico como um arquivo .svg
    graph.write_svg(output_file)

# Caminho do arquivo .SQL e o arquivo de saída .svg
sql_file = 'caminho/para/seu_arquivo.sql'
output_file = 'output.svg'

# Executa a função para gerar o diagrama
create_erd_from_sql(sql_file, output_file)
