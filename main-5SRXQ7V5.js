import sys
from awsglue.transforms import *
from awsglue.utils import getResolvedOptions
from pyspark.context import SparkContext
from awsglue.context import GlueContext
from awsglue.job import Job

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

# Lê todos os arquivos do caminho de origem
dynamic_frame = glueContext.create_dynamic_frame.from_options(
    connection_type="s3",
    connection_options={"paths": [source_path]},
    format="json"  # Substitua pelo formato real (csv, parquet, etc.)
)

# Grava todos os arquivos no destino
glueContext.write_dynamic_frame.from_options(
    frame=dynamic_frame,
    connection_type="s3",
    connection_options={"path": destination_path},
    format="json"  # Substitua pelo formato desejado
)

job.commit()
