Aqui está um exemplo de como uma resposta JSON para o endpoint /application_objects?location=shared pode ser estruturada:

json
Copiar código
{
  "response": {
    "status": "success",
    "result": {
      "entry": [
        {
          "@name": "facebook",
          "category": "social-networking",
          "subcategory": "social-networking",
          "technology": "browser-based",
          "risk": "high",
          "description": "Facebook application for social networking"
        },
        {
          "@name": "youtube",
          "category": "streaming-media",
          "subcategory": "video-streaming",
          "technology": "browser-based",
          "risk": "high",
          "description": "YouTube video streaming application"
        },
        {
          "@name": "ssh",
          "category": "networking",
          "subcategory": "remote-access",
          "technology": "network-protocol",
          "risk": "medium",
          "description": "SSH protocol for secure remote access"
        },
        {
          "@name": "dns",
          "category": "networking",
          "subcategory": "infrastructure",
          "technology": "network-protocol",
          "risk": "low",
          "description": "DNS protocol for domain name resolution"
        },
        {
          "@name": "custom-app",
          "category": "custom",
          "subcategory": "custom-subcategory",
          "technology": "custom-technology",
          "risk": "unknown",
          "description": "Custom application object for specific needs"
        }
      ]
    }
  }
}
Explicação dos Campos
@name: O nome do objeto de aplicação. Este nome é usado em regras de segurança para identificar o tipo de aplicação que está sendo gerenciada ou monitorada.

category: A categoria geral da aplicação, como social-networking, streaming-media, ou networking. Isso ajuda a agrupar aplicações semelhantes.

subcategory: Uma subcategoria mais específica dentro da categoria, que fornece mais detalhes sobre a aplicação. Por exemplo, video-streaming dentro de streaming-media.

technology: A tecnologia associada à aplicação, como browser-based para aplicações que funcionam em navegadores, ou network-protocol para protocolos de rede.

risk: O nível de risco associado à aplicação, como high, medium, low, ou unknown. Isso ajuda a determinar a criticidade da aplicação em termos de segurança.

description: Uma descrição opcional que fornece mais contexto sobre a aplicação e sua finalidade.

Detalhes Adicionais
location=shared: Indica que os objetos de aplicação retornados são compartilhados entre todos os device groups ou contextos de configuração no sistema. Esses objetos podem ser usados em qualquer parte da configuração que tenha acesso ao contexto shared.
