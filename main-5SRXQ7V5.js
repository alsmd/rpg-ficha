O endpoint /Policies/SecurityPreRules na API do Palo Alto Panorama retorna as regras de segurança pré-configuradas (ou "Pre-Rules") em um dispositivo ou grupo de dispositivos gerenciados. As Pre-Rules são políticas de segurança que são aplicadas antes das regras locais específicas de um dispositivo.

Aqui está um exemplo de como uma possível resposta desse endpoint poderia ser:

json
Copy code
{
  "response": {
    "status": "success",
    "result": {
      "rules": {
        "entry": [
          {
            "@name": "Allow-Web-Traffic",
            "from": {
              "member": ["trust"]
            },
            "to": {
              "member": ["untrust"]
            },
            "source": {
              "member": ["any"]
            },
            "destination": {
              "member": ["any"]
            },
            "source-user": {
              "member": ["any"]
            },
            "category": {
              "member": ["any"]
            },
            "application": {
              "member": ["web-browsing", "ssl"]
            },
            "service": {
              "member": ["application-default"]
            },
            "hip-profiles": {
              "member": ["any"]
            },
            "action": "allow",
            "log-setting": "Log-Forwarding-Profile",
            "log-start": "yes",
            "log-end": "yes",
            "description": "Allow all web traffic to external networks",
            "tag": {
              "member": ["web-traffic"]
            },
            "group": "Security Group 1"
          },
          {
            "@name": "Deny-Unauthorized-Access",
            "from": {
              "member": ["untrust"]
            },
            "to": {
              "member": ["trust"]
            },
            "source": {
              "member": ["any"]
            },
            "destination": {
              "member": ["any"]
            },
            "source-user": {
              "member": ["any"]
            },
            "category": {
              "member": ["any"]
            },
            "application": {
              "member": ["any"]
            },
            "service": {
              "member": ["any"]
            },
            "hip-profiles": {
              "member": ["any"]
            },
            "action": "deny",
            "log-setting": "Log-Forwarding-Profile",
            "log-start": "yes",
            "log-end": "yes",
            "description": "Deny all unauthorized access to internal networks",
            "tag": {
              "member": ["security"]
            },
            "group": "Security Group 2"
          }
        ]
      }
    }
  }
}
Explicação dos Campos
@name: Nome da regra de segurança. Este é o identificador da regra.

from: Define a zona de origem (por exemplo, trust, untrust). Indica de onde o tráfego está vindo.

to: Define a zona de destino. Indica para onde o tráfego está indo.

source: Especifica os endereços IP de origem para os quais a regra se aplica. any significa qualquer IP de origem.

destination: Especifica os endereços IP de destino para os quais a regra se aplica. any significa qualquer IP de destino.

source-user: Define os usuários de origem. any significa qualquer usuário.

category: Define as categorias de URL, se aplicável. any significa qualquer categoria.

application: Especifica as aplicações que esta regra cobre (por exemplo, web-browsing, ssl).

service: Define os serviços que a regra cobre. application-default refere-se aos serviços padrão das aplicações especificadas.

hip-profiles: Define os perfis HIP (Host Information Profile) aplicáveis. any significa qualquer perfil HIP.

action: A ação da regra, como allow (permitir) ou deny (negar).

log-setting: Nome do perfil de log associado à regra.

log-start e log-end: Indicadores de que o início e/ou o fim da sessão deve ser registrado nos logs.

description: Uma descrição da regra para ajudar na identificação do propósito da regra.

tag: Tags associadas à regra, para facilitar a categorização e gestão.

group: Nome do grupo de segurança ao qual a regra pertence.

Exemplos de Uso
Allow-Web-Traffic: Esta regra permite o tráfego da zona trust (geralmente a rede interna) para a zona untrust (geralmente a internet) para as aplicações de navegação na web (web-browsing, ssl). O tráfego é permitido e o início e fim das sessões são registrados nos logs.

Deny-Unauthorized-Access: Esta regra nega todo o tráfego de entrada da zona untrust para a zona trust, prevenindo acessos não autorizados. Também registra o início e fim das tentativas de acesso.

Aplicação Prática
As Pre-Rules são especialmente úteis em ambientes onde múltiplos dispositivos compartilham uma configuração centralizada. Ao configurar regras como essas no Panorama, você assegura que todos os dispositivos dentro de um grupo seguem as mesmas políticas de segurança, simplificando a gestão e aumentando a consistência das regras aplicadas em toda a infraestrutura de segurança.
