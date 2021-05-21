
const express = require('express');
const fs = require('fs');
const path = require('path');
const _ = require('lodash');
const unirest = require("unirest");

//"https://data.ny.gov/api/views/5xaw-6ayf/rows.csv?accessType=DOWNLOAD&sorting=true";
const DATA_URL = process.env.DATA_URL.replace(/"/g, '');
console.log(process.env.DATA_URL);

let drawings = [];  // [ epoc, [winnersdate : list of winners
var req = unirest.get(DATA_URL).then( (res) => {    // get data from data.ny.gov

	if (res.error) throw new Error(res.error);

	fs.writeFileSync("data.csv",res.body);

	let lines = res.body.split(/\r*\n/);

	for( var line of _.each(lines)) {   // preload data and load drawings
		let chunks = line.split(',');
		console.log(chunks);
		let dt = new Date(chunks[0]).getTime();   // using epoc as date is easier to order and takes less space than other representations
		if (_.isNaN(dt)) continue;   // skip header and empty lines

		if (chunks[1]) {	// chunks[1] is space seprateed list of winners
			let winners = chunks[1].split(/ +/);
			drawings.push([dt,  winners  ]);
		}
	}

	drawings.sort( ( a, b ) => a[0] - b[0]);   // sort by drawing date (latest -first)
	console.log(drawings);

	app.listen(serverPort, function () {  // once data is ready, start listening
		console.log(`COMPASSTEST Service is listening on port ${serverPort}`);
		console.log(`__dirname is ${__dirname}`);
	})
});

const app = express();

app.use('/compasstest', express.static(path.join(__dirname, '')));  

const serverPort = 4000;

app.get('/compasstest/getdata', async function (req, res) {  
	res.send(drawings); 
})


