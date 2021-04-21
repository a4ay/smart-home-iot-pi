const io = require("socket.io-client")
const Gpio = require("onoff").Gpio
const fetch = require("node-fetch")

const header = {
	  "userid" : "azay"
	}
const switchPins = [17,22,23,27]
const switches = {}

async function init(){
	await fetch("https://smarthomebackend.ajaypradhan.repl.co/get-user-data",{
		method : 'GET',
		headers : {
			'Content-Type':'application/json',
			'userid' : header.userid
		}

	}).then( response => response.json())
	.then(data => {
		
		switchPins.forEach( (pin,i) => {
			switches[pin] = new Gpio(pin, 'out')
			changeSwitchState(pin,data.switch[i].state)
		})	
	})
	
	
}

function changeSwitchState(pin,state){
	if(state){
		return switches[pin].writeSync(0)
	}
	switches[pin].writeSync(1)
}

const socket = io.connect("https://smarthomebackend.ajaypradhan.repl.co",{
	extraHeaders : header
})

socket.on("connect",()=>{
	console.log('connected')

	socket.on('switch',(args)=>{
		
		changeSwitchState(args["pin"],args["state"])
	})

})

init()