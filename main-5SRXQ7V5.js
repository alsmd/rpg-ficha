Glossário de Termos de Firewall e Regras
Regras (Rules):

Definição: Instruções específicas que definem se o tráfego de rede deve ser permitido ou bloqueado em um firewall.
Relacionamento: Regras são configuradas dentro de uma lista de acesso (access-list) e geralmente incluem informações como IPs de origem e destino, portas, e protocolos.
Grupos de Regras (Rule Groups):

Definição: Conjunto de regras organizadas sob um único identificador, usado para aplicar políticas comuns a múltiplas regras ou simplificar a administração.
Relacionamento: Grupos de regras podem ser usados em class-maps ou policy-maps para definir políticas de firewall mais complexas.
Grupos de IPs (IP Groups):

Definição: Coleção de endereços IP ou sub-redes agrupadas sob um nome comum para simplificar a criação de regras de firewall.
Relacionamento: Usado dentro de regras para referenciar múltiplos IPs ou sub-redes, ao invés de especificar cada IP individualmente.
IPs (Internet Protocol Addresses):

Definição: Identificadores únicos atribuídos a dispositivos na rede, usados para enviar e receber dados.
Relacionamento: Usados em regras de firewall para definir a origem e o destino do tráfego de rede.
Grupos de Serviço (Service Groups):

Definição: Conjunto de portas de serviços ou protocolos agrupados sob um nome comum.
Relacionamento: Facilita a configuração de regras de firewall que aplicam as mesmas ações a múltiplas portas ou protocolos.
Portas (Ports):

Definição: Números usados para identificar tipos específicos de tráfego de rede, como HTTP (porta 80) ou HTTPS (porta 443).
Relacionamento: Especificados nas regras de firewall para definir quais tipos de tráfego são permitidos ou bloqueados.
Protocolo (Protocol):

Definição: Conjunto de regras que define como os dados são transmitidos na rede (ex.: TCP, UDP, ICMP).
Relacionamento: Incluído nas regras de firewall para determinar como o tráfego é tratado.
Protocolo_Grupo (Protocol Group):

Definição: Coleção de protocolos agrupados para facilitar a criação de regras de firewall.
Relacionamento: Usado para aplicar a mesma regra a múltiplos protocolos ao mesmo tempo.
Keyword (Palavra-chave):

Definição: Termos específicos usados em regras para detalhar condições adicionais, como eq (igual a), range (intervalo), ou log (registrar).
Relacionamento: Adiciona funcionalidade ou especificidade extra às regras de firewall.
Hitcnt (Contador de Hits):

Definição: Contador que mostra o número de vezes que uma regra foi acionada.
Relacionamento: Usado para monitorar a eficácia e o uso de uma regra específica em uma lista de acesso.
Remark (Comentário):
Definição: Texto explicativo ou comentário associado a uma regra de firewall para descrever sua função.
Relacionamento: Adicionado antes ou dentro de uma regra para documentação e clareza.
Grupo (Group):
Definição: Termo geral que pode se referir a qualquer agrupamento de elementos como IPs, portas, ou regras.
Relacionamento: Usado para organizar elementos relacionados em uma configuração de firewall para facilitar o gerenciamento.
Nome (Name):
Definição: Identificador dado a um objeto ou grupo de objetos dentro da configuração do firewall.
Relacionamento: Usado para referenciar grupos de IPs, serviços, protocolos, ou outras entidades nas regras de firewall.
