window.apiBase="/compasstest/";

$(document).ready(async function () {
	//get data from server
	let data = await $.ajax({
		url:`${apiBase}getdata`,
		//headers: {  },
	}).catch(error => {
		console.error("getdata error", error);
	});
	console.log (data);
	reorder(data);
});

function reorder(data) {

	let dataCooked = [];   // [ [num, occurence ]]   - to allow sorting by either number or by occurence
	_.each(data, (list,num) =>{
		dataCooked.push({num : num, occurence : list.length});
	})
	
	let sorted = _.orderBy(dataCooked,['num'], ['desc']);   // sort numbers in descending order
	display(sorted);
}

function display(sorted) {
	let values = _.map(sorted, item => item.occurence);
	let labels = _.map(sorted, item => item.num);

	console.log("labels", labels);
	console.log("values", values);

	var ctx = document.getElementById('mainChartCanvas');
	if (window.mainChart) window.mainChart.destroy();
	window.mainChart = new Chart(ctx, {
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
				}],
				plugins: {
					colorschemes: {
						scheme: 'brewer.Paired12'
					}
				}
			}
		}
	});
}

