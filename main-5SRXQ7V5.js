import boto3
import pandas as pd
import time

# Configurações
DATABASE = 'meu_catalogo'
OUTPUT_BUCKET = 's3://meu-bucket-saida/'
ATHENA_CLIENT = boto3.client('athena')

def execute_query(query):
    """Executa uma query no Athena e retorna o QueryExecutionId."""
    response = ATHENA_CLIENT.start_query_execution(
        QueryString=query,
        QueryExecutionContext={'Database': DATABASE},
        ResultConfiguration={'OutputLocation': OUTPUT_BUCKET}
    )
    return response['QueryExecutionId']

def wait_for_query(query_execution_id):
    """Aguarda a conclusão de uma query no Athena."""
    while True:
        status = ATHENA_CLIENT.get_query_execution(QueryExecutionId=query_execution_id)
        state = status['QueryExecution']['Status']['State']
        if state in ['SUCCEEDED', 'FAILED', 'CANCELLED']:
            return state
        time.sleep(2)

def get_query_results(query_execution_id):
    """Obtém todos os resultados da query no Athena usando paginação."""
    paginator = ATHENA_CLIENT.get_paginator('get_query_results')
    results_iter = paginator.paginate(QueryExecutionId=query_execution_id)

    rows = []
    for page in results_iter:
        for row in page['ResultSet']['Rows'][1:]:  # Ignora cabeçalho
            rows.append([col.get('VarCharValue', '') for col in row['Data']])
    return rows

# Consultas
query_servidor = """
SELECT nome, ip, status
FROM servidor
WHERE status != 'Aposentado';
"""

query_sigla = """
SELECT DISTINCT nome, servidor
FROM sigla;
"""

query_responsavel = """
SELECT sigla, nome_responsavel, func_responsavel, grupo_suporte
FROM responsavel;
"""

# Executar as consultas
query_ids = {
    "servidor": execute_query(query_servidor),
    "sigla": execute_query(query_sigla),
    "responsavel": execute_query(query_responsavel)
}

# Aguardar a conclusão
for key, query_id in query_ids.items():
    if wait_for_query(query_id) != "SUCCEEDED":
        raise Exception(f"Query {key} falhou.")

# Obter os resultados
servidores = get_query_results(query_ids["servidor"])
siglas = get_query_results(query_ids["sigla"])
responsaveis = get_query_results(query_ids["responsavel"])

# Criar DataFrames
df_servidores = pd.DataFrame(servidores, columns=['nome_servidor', 'ip', 'status'])
df_siglas = pd.DataFrame(siglas, columns=['sigla', 'nome_servidor'])
df_responsaveis = pd.DataFrame(responsaveis, columns=['sigla', 'nome_responsavel', 'func_responsavel', 'grupo_suporte'])

# Mesclar os dados
df_merged = (
    df_servidores.merge(df_siglas, on='nome_servidor', how='inner')
    .merge(df_responsaveis, on='sigla', how='inner')
    [['ip', 'nome_servidor', 'sigla', 'nome_responsavel', 'func_responsavel', 'grupo_suporte']]
)

# Salvar no S3
output_file = '/tmp/output.csv'
df_merged.to_csv(output_file, index=False)

s3_client = boto3.client('s3')
s3_client.upload_file(output_file, 'meu-bucket-saida', 'nova_tabela.csv')

print("Arquivo gerado com sucesso e enviado para o S3.")
