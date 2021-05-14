
const express = require('express');
const fs = require('fs');
const path = require('path');
const _ = require('lodash');
const unirest = require("unirest");

//"https://data.ny.gov/api/views/5xaw-6ayf/rows.csv?accessType=DOWNLOAD&sorting=true";
const DATA_URL = process.env.DATA_URL.replace(/"/g, '');
console.log(process.env.DATA_URL);

let data = {};   // key - winning number, value - aray of winning dates
let dates = [];  // list of all draw dates
let drawings = {};  // date : list of winners
var req = unirest.get(DATA_URL).then( (res) => {    // get data from data.ny.gov

	if (res.error) throw new Error(res.error);

	fs.writeFileSync("data.csv",res.body);

	for( var line of _.each(res.body.split(/\r*\n/))) {   // preload data and restrucrue it to { vinnumber : [dates it came up]}
		let chunks = line.split(',');
		console.log(chunks);
		let dt = new Date(chunks[0]).getTime();   // using epoc as it takes less space than other representations
		if (_.isNaN(dt)) continue;   // skip header and empty lines
		dates.push(dt);
		if (chunks[1]) {	
			let winners = chunks[1].split(/ +/);
			drawings[dt] = winners;
			_.each(winners, c => {   // column 2 (chunks[1]) is a list of space separated wining numbers
				data[c] = data[c] || [];   // initialize year array
				data[c].push(dt);
			})
		}
	}
	console.log(JSON.stringify(data,null,4));
	dates.sort();  // unlike lodash, Array.sort(), sorts aray in place


	app.listen(serverPort, function () {  // once data is ready, start listening
		console.log(`COMPASSTEST Service is listening on port ${serverPort}`);
		console.log(`__dirname is ${__dirname}`);
	})
});

const app = express();

app.use('/compasstest', express.static(path.join(__dirname, '')));  

const serverPort = 4000;

app.get('/compasstest/getdata', async function (req, res) {  

	let history = {};
	_.each( data, (v,k) => {
		history[k] = _.sortBy(v);   // sort each numbers history by date
	})

	res.send({drawings : drawings, dates:dates, history:history}); 
})


