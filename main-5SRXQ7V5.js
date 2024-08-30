{
  "response": {
    "status": "success",
    "result": {
      "devicegroups": {
        "entry": [
          {
            "@name": "Branch-Offices",
            "devices": {
              "entry": [
                {
                  "@name": "FW-Branch-01",
                  "serial": "0123456789AB",
                  "connected": "yes",
                  "connection-status": "up",
                  "ip-address": "192.168.10.1",
                  "family": "vm-series",
                  "model": "PA-VM",
                  "sw-version": "10.1.0"
                },
                {
                  "@name": "FW-Branch-02",
                  "serial": "9876543210CD",
                  "connected": "yes",
                  "connection-status": "up",
                  "ip-address": "192.168.20.1",
                  "family": "vm-series",
                  "model": "PA-VM",
                  "sw-version": "10.1.0"
                }
              ]
            }
          },
          {
            "@name": "HQ-Firewalls",
            "devices": {
              "entry": [
                {
                  "@name": "FW-HQ-01",
                  "serial": "1122334455AA",
                  "connected": "yes",
                  "connection-status": "up",
                  "ip-address": "172.16.0.1",
                  "family": "pa-series",
                  "model": "PA-5250",
                  "sw-version": "10.1.3"
                },
                {
                  "@name": "FW-HQ-02",
                  "serial": "5566778899BB",
                  "connected": "yes",
                  "connection-status": "up",
                  "ip-address": "172.16.0.2",
                  "family": "pa-series",
                  "model": "PA-5250",
                  "sw-version": "10.1.3"
                }
              ]
            }
          }
        ]
      }
    }
  }
}
