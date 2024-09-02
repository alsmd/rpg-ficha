O endpoint /Objects/CustomURLCategories da API do Palo Alto Panorama retorna informações sobre categorias de URLs personalizadas que foram configuradas no sistema. Essas categorias personalizadas permitem que os administradores agrupem e classifiquem URLs para aplicar políticas de segurança específicas, como bloqueio ou permissão de acesso a determinados sites.

Aqui está um exemplo de como uma possível resposta desse endpoint poderia ser:

json
Copy code
{
  "response": {
    "status": "success",
    "result": {
      "entry": [
        {
          "@name": "blocked-social-media",
          "description": "Custom category for blocking social media sites",
          "list": [
            "www.facebook.com",
            "www.twitter.com",
            "www.instagram.com"
          ],
          "type": "URL List",
          "action": "block",
          "tag": {
            "member": [
              "social-media",
              "blocked"
            ]
          }
        },
        {
          "@name": "allowed-news-sites",
          "description": "Custom category for allowing specific news websites",
          "list": [
            "www.cnn.com",
            "www.bbc.com",
            "www.nytimes.com"
          ],
          "type": "URL List",
          "action": "allow",
          "tag": {
            "member": [
              "news",
              "allowed"
            ]
          }
        },
        {
          "@name": "restricted-shopping",
          "description": "Custom category for restricting access to shopping websites",
          "list": [
            "www.amazon.com",
            "www.ebay.com",
            "www.aliexpress.com"
          ],
          "type": "URL List",
          "action": "alert",
          "tag": {
            "member": [
              "shopping",
              "restricted"
            ]
          }
        }
      ]
    }
  }
}
Explicação dos Campos
@name: Nome da categoria personalizada de URLs, servindo como identificador único.

description: Descrição opcional que explica o propósito ou o conteúdo da categoria de URLs.

list: Lista de URLs ou padrões de URLs que pertencem a essa categoria personalizada. Essas URLs são aquelas que serão classificadas sob essa categoria para a aplicação de políticas.

type: Tipo de categoria. Geralmente será "URL List" para listas específicas de URLs.

action: Ação associada a essa categoria. Pode ser block, allow, alert, etc., dependendo de como a categoria será utilizada nas políticas de segurança.

tag: Lista de tags associadas à categoria personalizada de URLs, usadas para organização e categorização.

Tipos de Categorias de URLs
Categorias de URLs Personalizadas: São criadas pelo administrador para atender a necessidades específicas de controle de acesso, que não são cobertas pelas categorias padrão do sistema.
Uso Prático
Categorias de URLs personalizadas são usadas para aplicar políticas específicas a grupos de URLs que o administrador deseja gerenciar de maneira particular. Isso permite, por exemplo, bloquear, permitir ou monitorar o acesso a determinados tipos de sites com base em regras de negócios ou políticas de segurança.

Exemplos de Aplicação
Categoria Personalizada para Bloqueio de Redes Sociais (blocked-social-media): Inclui URLs de redes sociais como Facebook, Twitter e Instagram. Essa categoria poderia ser usada em uma política que bloqueia o acesso a redes sociais durante o horário de trabalho.

Categoria Personalizada para Permissão de Sites de Notícias (allowed-news-sites): Inclui URLs de sites de notícias confiáveis. Esta categoria poderia ser utilizada em uma política que permite o acesso a certos sites de notícias, enquanto outros permanecem bloqueados.

Categoria Personalizada para Restrição de Compras Online (restricted-shopping): Inclui URLs de sites de compras como Amazon, eBay e AliExpress. Esta categoria poderia ser usada em uma política que monitora ou restringe o acesso a sites de compras para evitar distrações no ambiente de trabalho.

Esses exemplos mostram como as categorias de URLs personalizadas permitem uma maior flexibilidade e controle na aplicação de políticas de segurança, adaptadas às necessidades específicas da organização.
