Aqui está um exemplo de como uma resposta JSON para o endpoint /Objects/Services?location=shared pode ser estruturada:

json
Copiar código
{
  "response": {
    "status": "success",
    "result": {
      "entry": [
        {
          "@name": "HTTP",
          "protocol": "tcp",
          "port": "80",
          "description": "HTTP traffic"
        },
        {
          "@name": "HTTPS",
          "protocol": "tcp",
          "port": "443",
          "description": "HTTPS traffic"
        },
        {
          "@name": "SSH",
          "protocol": "tcp",
          "port": "22",
          "description": "SSH traffic"
        },
        {
          "@name": "DNS",
          "protocol": "udp",
          "port": "53",
          "description": "DNS queries"
        },
        {
          "@name": "Custom-Protocol",
          "protocol": "tcp",
          "port": "12345",
          "description": "Custom TCP service for specific application"
        }
      ]
    }
  }
}
Explicação dos Campos
@name: O nome do objeto de serviço, que identifica o serviço dentro do firewall. Este nome é usado em regras de segurança para referenciar o serviço.

protocol: O protocolo associado ao serviço, como tcp, udp, ou sctp. Isso especifica o tipo de tráfego que o serviço representa.

port: A porta ou intervalo de portas que o serviço utiliza. Por exemplo, 80 para HTTP, 443 para HTTPS, e 22 para SSH.

description: Uma descrição opcional do serviço, fornecendo mais contexto sobre o que o serviço faz ou para que é usado.

Detalhes Adicionais
location=shared: Indica que os serviços retornados são compartilhados entre todos os device groups ou contextos de configuração no sistema. Isso significa que esses objetos estão disponíveis para uso em todo o ambiente configurado.
