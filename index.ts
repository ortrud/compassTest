let apiBase="/compasstest/";

var mainChart: Chart

declare function load_chart_catalog(array, object) : any;
var n: number;

let chartCatalog = [
	{key : 0, text : "Occurence totals", action : function (n,d) { occurenceTotals(n, d) }  },
]
for (n=1; n <=75; n++) {
	chartCatalog.push( {key : n, text : `History of number ${n}`, action : function(n,d) { numberHistory(n,d)} });
}

$(document).ready(async function () {
	//get data from server
	let data = await $.ajax({
		url:`${apiBase}getdata`,
		//headers: {  },
	}).catch(error => {
		console.error("getdata error", error);
	});
	console.log (data);


	load_chart_catalog(chartCatalog, data);

	//occurenceTotals(data);
});

function numberHistory (number,history) {

	let labels = history[number];
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
						display : true,
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
	_.each(data, (list,num) =>{
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

