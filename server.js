
const express = require('express');
const fs = require('fs');
const path = require('path');
const _ = require('lodash');
const unirest = require("unirest");

//"https://data.ny.gov/api/views/5xaw-6ayf/rows.csv?accessType=DOWNLOAD&sorting=true";
const DATA_URL = process.env.DATA_URL.replace(/"/g, '');
console.log(process.env.DATA_URL);

let data = {};
var req = unirest.get(DATA_URL).then( (res) => {    // get data from data.ny.gov

	if (res.error) throw new Error(res.error);

	for( line of _.each(res.body.split(/\r*\n/))) {   // preload data and restrucrue it to { vinnumber : [dates it came up]}
		let chunks = line.split(',');
		console.log(chunks);
		let dt = new Date(chunks[0]).getTime();   // using epoc as it takes less space than other representations
		if (_.isNaN(dt)) continue;   // skip header and empty lines
		if (chunks[1]) {	
			_.each(chunks[1].split(/ +/), c => {   // column 2 (chunks[1]) is a list of space separated wining numbers
				data[c] = data[c] || [];   // initialize year array
				data[c].push(dt);
			})
		}
	}
	console.log(JSON.stringify(data,0,4));
});

const app = express();

app.use('/compasstest', express.static(path.join(__dirname, '')));  // handle static files (no needed ? since we load it directly from jtml)

const serverPort = 4000;

app.get('/compasstest/getdata', async function (req, res) {  // return data for one number

	let byDate = {};
	_.each( data, (v,k) => {
		byDate[k] = _.sortBy(v);   // sort each numbers history by date
	})

	res.send(byDate); 
})


app.listen(serverPort, function () {
	console.log(`COMPASSTEST Service is listening on port ${serverPort}`);
	console.log(`__dirname is ${__dirname}`);
})
