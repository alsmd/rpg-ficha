import boto3
import time

def lambda_handler(event, context):
    # Inicializar o cliente Athena
    athena_client = boto3.client('athena', region_name='us-east-1')
    
    # Parâmetros
    database = '<database-name>'
    query = "SELECT * FROM <table-name> LIMIT 10;"
    
    # Inicia a execução da query
    response = athena_client.start_query_execution(
        QueryString=query,
        QueryExecutionContext={'Database': database}
    )
    
    query_execution_id = response['QueryExecutionId']
    
    # Verificar o status da consulta
    while True:
        query_status = athena_client.get_query_execution(QueryExecutionId=query_execution_id)
        status = query_status['QueryExecution']['Status']['State']
        
        if status in ['SUCCEEDED', 'FAILED', 'CANCELLED']:
            break
        time.sleep(1)
    
    if status == 'SUCCEEDED':
        # Obter os resultados diretamente
        result = athena_client.get_query_results(QueryExecutionId=query_execution_id)
        
        # Processar as linhas dos resultados
        rows = []
        for row in result['ResultSet']['Rows']:
            rows.append([col.get('VarCharValue', None) for col in row['Data']])
        
        # Opcional: Separar cabeçalhos e dados
        headers = rows[0]  # Primeira linha são os cabeçalhos
        data = rows[1:]    # Linhas seguintes são os dados
        
        return {
            'statusCode': 200,
            'headers': headers,
            'data': data
        }
    else:
        return {
            'statusCode': 500,
            'message': f"Query failed with status: {status}"
        }
