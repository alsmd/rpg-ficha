import pymysql
import os

# Variáveis de ambiente no Lambda
DB_HOST = os.environ['DB_HOST']
DB_NAME = os.environ['DB_NAME']
DB_USER = os.environ['DB_USER']
DB_PASSWORD = os.environ['DB_PASSWORD']
DB_PORT = int(os.environ['DB_PORT'])  # Certifique-se que a porta seja um número

def lambda_handler(event, context):
    try:
        # Conectar ao banco de dados
        connection = pymysql.connect(
            host=DB_HOST,
            user=DB_USER,
            password=DB_PASSWORD,
            database=DB_NAME,
            port=DB_PORT,
            cursorclass=pymysql.cursors.DictCursor
        )

        with connection.cursor() as cursor:
            cursor.execute("SELECT NOW() as current_time;")
            result = cursor.fetchone()

        connection.close()
        return {
            "statusCode": 200,
            "body": f"Conexão bem-sucedida! Hora do banco: {result['current_time']}"
        }

    except Exception as e:
        return {
            "statusCode": 500,
            "body": f"Erro ao conectar: {str(e)}"
        }
