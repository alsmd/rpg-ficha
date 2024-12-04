import boto3
import csv
import io

# Configurações do S3
S3_BUCKET = 'meu-bucket-saida'
CSV_FILE_KEY = 'nova_tabela.csv'

def lambda_handler(event, context):
    ip = event.get('ip')
    if not ip:
        return {"error": "IP não fornecido no evento"}

    s3_client = boto3.client('s3')
    
    # Configuração do S3 Select
    expression = f"SELECT * FROM S3Object WHERE _3 = '{ip}'"  # '_3' refere-se à coluna IP
    input_serialization = {"CSV": {"FileHeaderInfo": "Use"}}
    output_serialization = {"CSV": {}}
    
    try:
        response = s3_client.select_object_content(
            Bucket=S3_BUCKET,
            Key=CSV_FILE_KEY,
            ExpressionType='SQL',
            Expression=expression,
            InputSerialization=input_serialization,
            OutputSerialization=output_serialization,
        )

        # Processar os resultados
        result_rows = []
        for event_stream in response['Payload']:
            if 'Records' in event_stream:
                records = event_stream['Records']['Payload']
                csv_lines = records.decode('utf-8')
                reader = csv.reader(io.StringIO(csv_lines))
                result_rows.extend(list(reader))
        
        # Retornar os resultados
        return {"ip": ip, "resultados": result_rows}
    
    except Exception as e:
        return {"error": str(e)}
