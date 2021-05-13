let apiBase="/compasstest/";

var mainChart: Chart

declare function load_chart_catalog(array, object) : any;
declare function sprintf(string, any) : string;
var n: number;

// catalog of charts
let chartCatalog = [
	{key : 0, text : "Occurence totals", action : function (n,d) { occurenceTotals(n, d) }  },  // x-wunning number, y-occurences
	{key : 1, text : "Occurence details", action : function (n,d) { occurenceDetails(n, d) }  },  // x-date, y-winning number
	{key : 2, text : "Time lapse", action : function (n,d) { timeLapse(n, d) }  },  // x-date, y-winning numbers
	//{key : 2, text : `History of all numbers`, action : function(n,d) { numberHistory(n,d)} });
]
// for (n=1; n <=75; n++) {
// 	chartCatalog.push( {key : n, text : `History of number ${n}`, action : function(n,d) { numberHistory(n,d)} });
// }

$(document).ready(async function () {
	//get data from server
	let data = await $.ajax({
		url:`${apiBase}getdata`,
		//headers: {  },
	}).catch(error => {
		console.error("getdata error", error);
	});
	console.log (data);

	load_chart_catalog(chartCatalog, data);   // data containes lotto dates (ordered and winning numbers history)

});

function numberHistory (number,history) {

	let labels = history[sprintf("%02d", number)];   // prepend 0 to single digit numbers
	//let labels = history[number];
	let data = _.map(labels , d => 1);   // set it 1 for any date it occured

	var ctx = document.getElementById('mainChartCanvas') as HTMLCanvasElement;
	if (mainChart) mainChart.destroy();
	console.log("labels", labels)
	mainChart = new Chart(ctx, {
		type: 'line',
		  
		data: {
			labels:labels,
			datasets: [
				{
					label: 'occurs',
					yAxisID: 'occurs',
					data: data,
					fill : false,
					borderWidth: 1
				},
			]
		},
		options: {
			responsive : true,
			//onClick : ycChartClickFunction,
			title : {
				display : true,
				text : `History of occurences of number ${number}`,
			},
			legend: {
				position : 'bottom'
			},
			tooltips : {
				// callbacks : {
				// 	label : function(tooltipItem, data) { 
				// 		let i = tooltipItem.index;
				// 		return data.labels[i] + ': $' + data.datasets[0].data[i].toLocaleString('en')
				// 	},
				// }
			},
			scales: {
				xAxes: [{
					type: 'time',
					time: {
						displayFormats: {
							//quarter: 'MMM YYYY'
						}
					}
				}],

				yAxes: [{
					id: 'occurs',
					type: 'linear',
					position: 'left',
					ticks: setTicks(data),
					scaleLabel : {
						display : false,
						labelString : 'Occurs'
					}
				}]
			},

			plugins: {
				colorschemes: {
					scheme: 'brewer.Paired12'
				}
			}
			}
		
	});
}

function setTicks(list) {   // min and max of the list
	return {
		max: _.max(list),
		min: _.min(list)
	}
}

function occurenceTotals (chartId, data) {
	
	let dataCooked = [];   // [ [num, occurence ]]   - to allow sorting by either number or by occurence
	_.each(data.history, (list,num) =>{
		dataCooked.push({num : num, occurence : list.length});
	})
	
	let sorted = _.orderBy(dataCooked,['num'], ['desc']);   // sort numbers in descending order

	let values = _.map(sorted, item => item.occurence);
	let labels = _.map(sorted, item => item.num);

	console.log("labels", labels);
	console.log("values", values);

	var ctx = document.getElementById('mainChartCanvas') as HTMLCanvasElement;
	if (mainChart) mainChart.destroy();
	mainChart = new Chart(ctx, {
		type: 'line',
		  
		data: {
			labels:labels,
			datasets: [
				{
					label: 'Winning Numbers',
					data: values,
					borderWidth: 1
				},
			]
		},
		options: {
			responsive : true,
			title : {
				display : true,
				text : `Winning numbers occurence in descending number order`,
			},
			legend: {
				position : 'bottom'
			},

			scales: {

				yAxes: [{
					type: 'linear',
					position: 'left',
					scaleLabel : {
						display : true,
						labelString : 'Number of occurences'
					}
				}]
			},
			plugins: {
				colorschemes: {
					scheme: 'brewer.Paired12'
				}
			}
		}
	});
}

async function occurenceDetails(chartId,data) {	//all winning numbers by date

	let labels = data.dates;   //chartjs x - all lotto dates
	let datasets = [];   //chartjs datasets
	let yAxes = [];   

	_.each(data.history, (dates,winner) =>{

			datasets.push(
				{
					label: winner,
					// if number was a winner, set datapoint to it, ortherwise null
					data: _.map(labels, l => { return _.find(dates, d=> d == l) ? winner : null } ),
					borderWidth: 1,
					showLine : false
				}
			);
	})
	
	var ctx = document.getElementById('mainChartCanvas') as HTMLCanvasElement;
	if (mainChart) mainChart.destroy();
	mainChart = new Chart(ctx, {
		type: 'line',
		  
		data: {
			labels:labels,
			datasets: datasets
		},
		options: {
			responsive : true,
			animation : false,
			//onClick : ycChartClickFunction,
			title : {
				display : true,
				text : `Winning numbers details in descending number order`,
			},
			legend: {
				position : 'bottom'
			},
			// tooltips : {
			// 	callbacks : {
			// 		label : function(tooltipItem, data) { 
			// 			let i = tooltipItem.index;
			// 			return data.labels[i] + ': $' + data.datasets[0].data[i].toLocaleString('en')
			// 		},
			// 	}
			// },
			scales: {
				xAxes: [{
					type: 'time',
					ticks: setTicks(labels),
					time: {
						displayFormats: {
							//quarter: 'MMM YYYY'
						}
					}
				}],

				yAxes: [{
					type: 'linear',
					position: 'left',
					scaleLabel : {
						display : true,
						labelString : 'Winning numbers'
					}
				}],

			},
			plugins: {
				colorschemes: {
					scheme: 'brewer.Paired12'
				}
			}
		}
	});
}

async function timeLapse(chartId,data) {	//all winning numbers by date

	let labels = data.dates;   //chartjs x - all lotto dates
	//let labels = _.sort(_.keys(data.drawings));   //chartjs x - all lotto dates
	
	var ctx = document.getElementById('mainChartCanvas') as HTMLCanvasElement;
	if (mainChart) mainChart.destroy();
	mainChart = new Chart(ctx, {
		type: 'scatter',
		
		data: {
			labels:labels,
			datasets: [{
				label : "Timelapse",
				data : []
			}]
		},
		options: {
			responsive : true,

			animation:false,
			//onClick : ycChartClickFunction,
			title : {
				display : true,
				text : `Winning numbers time progression`,
			},
			legend: {
				position : 'bottom'
			},
			tooltips: {
				callbacks: {
					label: function (tooltipItem, data) {
						let i = tooltipItem.index;
						return JSON.stringify(data.datasets[0].data[i])
					},
				}
			},
			scales: {
				xAxes: [{
					type: 'time',
					ticks: setTicks(labels),
					time: {
						displayFormats: {
							//quarter: 'MMM YYYY'
						}
					}
				}],

				yAxes: [{
					type: 'linear',
					position: 'left',
					ticks: setTicks([0, 75]),
					scaleLabel: {
						display: true,
						labelString: 'Winning numbers'
					}
				}],

			},
			plugins: {
				colorschemes: {
					scheme: 'brewer.Paired12'
				}
			}
		}
	});
	
	// update datasets and refresh chart
	let dayIndex =0;
	let timer = setInterval( function() {
		let daywinners = data.drawings[data.dates[dayIndex]];   // first day of lotto drawing

		let dayDataPoints = _.map(daywinners, winner => { return {x : data.dates[dayIndex], y : parseInt(winner)}})
		mainChart.data.datasets[0].data = dayDataPoints;
		
		mainChart.update();
		dayIndex++;
		if (dayIndex == data.dates.length) clearTimeout(timer);
	}, 10);
}