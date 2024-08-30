Quando você faz uma solicitação ao endpoint /?type=op&cmd=<show><devices><all></all></devices></show>&output=json em um dispositivo Palo Alto, o retorno geralmente inclui informações sobre todos os dispositivos gerenciados ou conectados, como firewalls individuais ou dispositivos Panorama que estão sob a administração central.

Exemplo de Resposta
Aqui está um exemplo de como uma resposta JSON para esse endpoint pode ser estruturada:

json
Copiar código
{
  "response": {
    "status": "success",
    "result": {
      "devices": {
        "entry": [
          {
            "serial": "001122334455",
            "connected": "yes",
            "uptime": "200 days, 5:12:32",
            "family": "PA-3200",
            "model": "PA-3220",
            "sw-version": "10.1.0",
            "app-version": "850-5172",
            "av-version": "3344-6456",
            "threat-version": "850-5172",
            "wf-private": "n/a",
            "url-filtering-version": "2024.08.30.110",
            "logdb-version": "10.1.0",
            "multi-vsys": "off",
            "state": "active",
            "management-ip": "192.168.1.1",
            "hostname": "firewall-1"
          },
          {
            "serial": "667788990011",
            "connected": "yes",
            "uptime": "150 days, 3:45:12",
            "family": "PA-850",
            "model": "PA-852",
            "sw-version": "10.0.5",
            "app-version": "845-5001",
            "av-version": "3301-6124",
            "threat-version": "845-5001",
            "wf-private": "n/a",
            "url-filtering-version": "2024.08.30.110",
            "logdb-version": "10.0.5",
            "multi-vsys": "on",
            "state": "passive",
            "management-ip": "192.168.2.1",
            "hostname": "firewall-2"
          }
        ]
      }
    }
  }
}
Explicação dos Campos
serial: O número de série do dispositivo. Este é um identificador único para cada dispositivo Palo Alto.

connected: Indica se o dispositivo está atualmente conectado ao sistema de gerenciamento (yes ou no).

uptime: O tempo de atividade do dispositivo desde a última reinicialização.

family: A família do dispositivo, como PA-3200 ou PA-850, que indica a série ou modelo a que o dispositivo pertence.

model: O modelo específico do dispositivo, como PA-3220 ou PA-852.

sw-version: A versão do software PAN-OS que está rodando no dispositivo.

app-version: A versão da base de dados de aplicações instalada no dispositivo.

av-version: A versão da base de dados de antivírus instalada.

threat-version: A versão da base de dados de ameaças instalada.

wf-private: Normalmente relacionado à versão do filtro de conteúdo, mas pode ser n/a (não aplicável) se não estiver em uso.

url-filtering-version: A versão da base de dados de filtragem de URLs.

logdb-version: A versão do banco de dados de logs do dispositivo.

multi-vsys: Indica se o dispositivo está configurado para usar múltiplos sistemas virtuais (on ou off).

state: O estado atual do dispositivo, como active (ativo) ou passive (passivo).

management-ip: O endereço IP de gerenciamento do dispositivo.

hostname: O nome do host do dispositivo, que é o identificador atribuído ao dispositivo dentro da rede.
