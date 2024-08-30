O endpoint /Objects/Addresses?location=shared do Palo Alto é utilizado para recuperar uma lista de endereços IP ou ranges de endereços configurados como objetos de endereço no contexto "shared" do firewall. Esses objetos de endereço são frequentemente usados em regras de segurança, NAT, e outras políticas.

Aqui está um exemplo de uma possível resposta JSON para uma solicitação GET a esse endpoint:

json
Copiar código
{
  "response": {
    "status": "success",
    "result": {
      "entry": [
        {
          "@name": "Web-Server-1",
          "ip-netmask": "192.168.1.10/32",
          "description": "Primary web server",
          "tag": {
            "member": "Critical-Servers"
          },
          "vsys": "vsys1",
          "location": "shared"
        },
        {
          "@name": "Database-Cluster",
          "ip-range": "192.168.2.100-192.168.2.110",
          "description": "Database cluster IP range",
          "tag": {
            "member": "Database-Servers"
          },
          "vsys": "vsys1",
          "location": "shared"
        },
        {
          "@name": "Office-Network",
          "ip-netmask": "10.0.0.0/24",
          "description": "Corporate office network",
          "tag": {
            "member": "Internal-Networks"
          },
          "vsys": "vsys1",
          "location": "shared"
        }
      ]
    }
  }
}
Detalhes da Resposta:
entry: Cada entrada representa um objeto de endereço configurado.
@name: Nome do objeto de endereço.
ip-netmask: Endereço IP ou bloco de endereços definido pelo objeto, usando notação CIDR (ex: 192.168.1.10/32 para um único IP).
ip-range: Intervalo de endereços IP se o objeto for configurado como um range (ex: 192.168.2.100-192.168.2.110).
description: Descrição opcional do objeto de endereço para ajudar na identificação do seu propósito.
tag: Tags associadas ao objeto, usadas para organização e categorização.
member: Nome do tag associado ao objeto.
vsys: Identifica o sistema virtual (vsys) ao qual o objeto pertence, se aplicável.
location: Indica que o objeto está na localização "shared", tornando-o disponível para uso em todos os sistemas virtuais do dispositivo.
Este exemplo inclui três objetos de endereço:

Web-Server-1: Um IP único para um servidor web.
Database-Cluster: Um intervalo de IPs para um cluster de banco de dados.
Office-Network: Um bloco de rede que cobre um escritório corporativo.
Esses objetos de endereço podem ser referenciados em políticas e regras no firewall para controlar e monitorar o tráfego relacionado a essas entidades.
