import sys
from awsglue.transforms import *
from awsglue.utils import getResolvedOptions
from pyspark.context import SparkContext
from awsglue.context import GlueContext
from awsglue.job import Job

# Parâmetros e inicialização
args = getResolvedOptions(sys.argv, ["JOB_NAME"])
sc = SparkContext()
glueContext = GlueContext(sc)
spark = glueContext.spark_session
job = Job(glueContext)
job.init(args["JOB_NAME"], args)

# Defina os buckets de origem e destino
source_bucket = "s3://source-bucket/path/to/data/"
destination_bucket = "s3://destination-bucket/path/to/data/"

# Leia os dados do bucket de origem
dynamic_frame = glueContext.create_dynamic_frame.from_options(
    connection_type="s3",
    connection_options={"paths": [source_bucket]},
    format="json"  # Altere para o formato do seu dado, ex.: 'parquet', 'csv'
)

# Opcional: Transformação de dados (se necessário)
# Aqui você pode aplicar filtros, seleção de colunas, etc.
transformed_frame = dynamic_frame  # Sem transformações no exemplo

# Grave os dados no bucket de destino
glueContext.write_dynamic_frame.from_options(
    frame=transformed_frame,
    connection_type="s3",
    connection_options={"path": destination_bucket},
    format="json"  # Altere para o formato desejado
)

job.commit()
