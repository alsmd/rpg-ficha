import sys
from awsglue.transforms import *
from awsglue.utils import getResolvedOptions
from pyspark.context import SparkContext
from awsglue.context import GlueContext
from awsglue.job import Job
import boto3

# Inicialização do Glue Context
args = getResolvedOptions(sys.argv, ["JOB_NAME"])
sc = SparkContext()
glueContext = GlueContext(sc)
spark = glueContext.spark_session
job = Job(glueContext)
job.init(args["JOB_NAME"], args)

# Caminhos S3
source_path = "s3://source-bucket/src/"
destination_path = "s3://destination-bucket/target/"

# Função para limpar o destino
def clear_s3_path(bucket_name, prefix):
    s3 = boto3.resource("s3")
    bucket = s3.Bucket(bucket_name)
    print(f"Limpando o caminho: s3://{bucket_name}/{prefix}")
    bucket.objects.filter(Prefix=prefix).delete()

# Extrair nome do bucket e prefix do destino
dest_bucket = "destination-bucket"
dest_prefix = "target/"

# Limpa os dados existentes no destino
try:
    clear_s3_path(dest_bucket, dest_prefix)
    print("Destino limpo com sucesso.")
except Exception as e:
    print(f"Erro ao limpar o destino: {e}")
    job.commit()
    sys.exit(1)

# Lê os dados do bucket de origem
try:
    dynamic_frame = glueContext.create_dynamic_frame.from_options(
        connection_type="s3",
        connection_options={"paths": [source_path]},
        format="json"  # Substitua pelo formato correto: 'csv', 'parquet', etc.
    )
    print("Leitura dos dados concluída.")
except Exception as e:
    print(f"Erro ao ler dados da origem: {e}")
    job.commit()
    sys.exit(1)

# Verifica se há dados no DynamicFrame
if dynamic_frame.count() == 0:
    print("Nenhum dado encontrado na origem. Verifique o caminho ou o formato.")
    job.commit()
    sys.exit(1)

# Grava os dados no bucket de destino
try:
    glueContext.write_dynamic_frame.from_options(
        frame=dynamic_frame,
        connection_type="s3",
        connection_options={"path": destination_path},
        format="json"  # Substitua pelo formato desejado: 'csv', 'parquet', etc.
    )
    print("Gravação dos dados concluída.")
except Exception as e:
    print(f"Erro ao gravar dados no destino: {e}")

job.commit()
