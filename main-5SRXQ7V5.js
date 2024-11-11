Para usar o AWS Glue para extrair dados de uma tabela no Amazon Athena e armazená-los em uma instância de banco de dados RDS, você pode seguir estes passos:

1. Criar o Crawler no Glue para Catalogar a Tabela Athena
Primeiro, você precisa de um AWS Glue Crawler que identifique e catalogue as tabelas do Amazon S3 usadas pelo Athena.

No console do AWS Glue, vá para a seção de Crawlers e crie um novo.
Configure o Crawler para apontar para o bucket S3 onde estão os dados que você consulta pelo Athena.
Defina as configurações para que ele catalogue a tabela no Glue Data Catalog.
Execute o Crawler para garantir que a tabela apareça no Glue Data Catalog.
2. Configurar o Glue Job para Extrair os Dados
Após catalogar a tabela, crie um Glue Job para extrair os dados do Glue Data Catalog (ou diretamente do Athena) e salvá-los no Amazon RDS.

No console do AWS Glue, vá para a seção de Jobs e crie um novo Job.
Selecione o Glue Data Catalog como a fonte de dados (escolha a tabela catalogada pelo Crawler).
Selecione Amazon RDS como o destino e configure as credenciais de conexão com o banco de dados RDS.
Para isso, você vai precisar de uma Connection:

Vá para a seção Connections no Glue, e crie uma conexão que aponta para a instância RDS.
Insira o endpoint, nome do banco, usuário e senha do RDS.
Se a instância RDS está em uma VPC, você deve configurar permissões e definir uma role para que o Glue possa acessar a VPC.
3. Escrever o Script de Transformação (Opcional)
Se precisar transformar os dados (por exemplo, ajustar o schema ou processar colunas), você pode usar o editor do Glue para personalizar o script.

O AWS Glue usa PySpark, então você pode personalizar seu Job em Python (Spark) para manipular os dados.
Exemplo de um script básico:

python
Copy code
import sys
from awsglue.transforms import *
from awsglue.utils import getResolvedOptions
from pyspark.context import SparkContext
from awsglue.context import GlueContext
from awsglue.job import Job

args = getResolvedOptions(sys.argv, ['JOB_NAME'])
sc = SparkContext()
glueContext = GlueContext(sc)
spark = glueContext.spark_session
job = Job(glueContext)
job.init(args['JOB_NAME'], args)

# Ler a tabela catalogada do Glue Data Catalog
datasource = glueContext.create_dynamic_frame.from_catalog(
    database="nome_do_seu_catalogo",
    table_name="nome_da_tabela_athena"
)

# (Opcional) Transformação de dados

# Carregar os dados no Amazon RDS
glueContext.write_dynamic_frame.from_jdbc_conf(
    frame=datasource,
    catalog_connection="sua_conexao_rds",
    connection_options={"dbtable": "nome_da_tabela_destino", "database": "nome_do_database"},
    transformation_ctx="datasink"
)

job.commit()
4. Configurar Permissões e IAM Role
Certifique-se de que o Glue Job Role possui permissões necessárias para:

Acessar o bucket S3 (para ler dados via Athena).
Acessar o Glue Data Catalog.
Conectar-se ao Amazon RDS.
Acessar a VPC (caso o RDS esteja em uma VPC).
5. Executar o Glue Job
Execute o Job e verifique no RDS se os dados foram salvos conforme esperado.






