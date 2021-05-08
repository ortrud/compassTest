window.apiBase="/compasstest/";

$(document).ready(async function () {
	//get data from server
	let dataRow = await $.ajax({
		url:`${apiBase}getdata`,
		//headers: {  },
	}).catch(error => {
		console.error("getdata error", error);
	});
	console.log (dataRow);

	let dataCooked = [];   // [ [num, popularity ]]   - to allow sorting by either number or by popularity
	 _.each(dataRow, (list,num) =>{
		dataCooked.push({num : num, popularity : list.length});
	})

	let byDescendingPopularity = _.orderBy(dataCooked,['num'], ['desc']);
	let values = _.map(byDescendingPopularity, item => item.popularity);
	let labels = _.map(byDescendingPopularity, item => item.num);

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
				text : `winning numbers by popularity`,
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
						labelString : 'Popularity (number of times hit)'
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
})

