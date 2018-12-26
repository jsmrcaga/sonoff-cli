# Unofficial ITEAD SOnOff CLI

This is a _very_ simple CLI utility to configure a SOnOff device (Basic / RF, maybe others).

The idea is to be able to configure the device to connect to a custom server, instead of ITEAD Cloud.

How? The device is able to connect to a websocket server (ITEAD Cloud) over SSL, but before it has to be "paired". The usual pairing flow involves your cellphone + eLink app, which performs some actions replicated here, in order:

- Connect to ITEAD-10000xxxxxx Wifi access point (created by SOnOff device)
- Query device information (http://10.10.7.1/device)
- Set AP information (http://10.10.7.1/ap) (your wifi)

Feel free to checkout the code (actions.js) to understand how these steps are made. 

#### Note: this utility does not connect to SOnOff ap, nor checks for pairing mode, you should do it by hand as explained before.

## Usage

### Preparation to pairing

- Set pairing mode
	- Before we start, you should set your device to pairing mode (usually involves holding the button long enough to see the led blink). Depending on your device and version, led might mean something different, please refer to [this](https://l.messenger.com/l.php?u=https%3A%2F%2Fwww.itead.cc%2Fblog%2Fuser-guide-for-sonoff-slampher&h=AT3IEwJTjYPF_lLM1Fu4ugTa_wuMQ1y8J1khnHISfaUzZKCZ_H1RN3uTTC6CRdlywkkSXL3qdsYhptmHqFgp0CEBx61lBFuDoLcg-ggJIHo3CLuIR46MT971SQa8anDbDlL4pkb08xI) page for more info.

- Connect to AP
	- Once in pairing mode, your device will emit a wifi access point, to which you must connect. To prevent errors, you should perform this action one device at a time. The SSID should look something like ITEAD-10000xxxxxx.

### Pair

Once connected to AP, you can use this utility to execute the "pairing" part of the process :

`sonoff auto -w "your WIFI SSID:password" -s webserverIP:PORT -o outputServer/path`

This is the usual (and only) option this utility exposes right now. Let's break it down:

- `sonoff auto` Means that this utility will get the device information, and set the AP info in one go.

- `-w ssid:password` Gives the utility your wifi information to send to the device. This utility will `wifi.split(':')` to get ssid and password, so keep that in mind. _Note: options can also take a = (-w=plep:plop)_.

- `-s ip:port` Gives the utility information about the server that will be managing the device. I personnaly use the IP address (internal network), but I've seen tutorials using a common name (`example.com`). As the device needs SSL to fuction, port should usually be set to `443`, unless you configured otherwise on your server.

- OPTIONAL `-o http...` Output. This will take the device info and send a POST request to the url given to `-o`. As:
```
{
	"deviceid": id,
	"apikey": plep
}
```
