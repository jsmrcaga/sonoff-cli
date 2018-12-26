const message = `
Sonoff nodejs utility

  Instructions:
    Before using this utility, set your sonoff device
    to wlan pairing mode (blinking light) and connect
    to its AP (ITEAD-1000xxxx).

  Usage:
    - sonoff <action> [options]

  Actions:
    - auto 
      -w=<SSID:password> 
      -s=<wsServerIp:port> 
      -o=http://localhost:1234/configure
    
      Options:
        -w : WLAN info to send to device (SSID:password)
        -s : WebSocket server info to send to device (serverIP:port)
          (must be IP, not name)
        -o : Output. For now only http. This utility will send a POST
          request to given address containing the information from the device
`;

module.exports = function() {
	console.log(message);
	return process.exit(0);
};
