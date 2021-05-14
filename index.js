var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var apiBase = "/compasstest/";
var mainChart;
var n;
// catalog of charts
var chartCatalog = [
    { key: 0, text: "Win totals", action: function (n, d) { occurenceTotals(n, d); } },
    { key: 1, text: "Occurence details", action: function (n, d) { occurenceDetails(n, d); } },
    { key: 2, text: "Time lapse", action: function (n, d) { timeLapse(n, d); } },
    { key: 3, text: "Number Aging", action: function (n, d) { numberAgingDays(n, d); } },
    { key: 4, text: "Number Aging (1-70)", action: function (n, d) { numberAgingDraws(n, d); } }, // x-winner, y-age in draws
];
//{key : 3, text : "History of all numbers", action : function(n,d) { numberHistory(n,d)} },
// for (n=1; n <=75; n++) {
// 	chartCatalog.push( {key : n, text : `History of number ${n}`, action : function(n,d) { numberHistory(n,d)} });
// }
$(document).ready(function () {
    return __awaiter(this, void 0, void 0, function () {
        var data;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, $.ajax({
                        url: apiBase + "getdata"
                    })["catch"](function (error) {
                        console.error("getdata error", error);
                    })];
                case 1:
                    data = _a.sent();
                    console.log(data);
                    load_chart_catalog(chartCatalog, data); // data containes lotto dates (ordered and winning numbers history)
                    return [2 /*return*/];
            }
        });
    });
});
function getdata() {
    return __awaiter(this, void 0, void 0, function () {
        var data;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, $.ajax({
                        url: apiBase + "getdata"
                    })["catch"](function (error) {
                        console.error("getdata error", error);
                    })];
                case 1:
                    data = _a.sent();
                    console.log(data);
                    return [2 /*return*/, data];
            }
        });
    });
}
function setTicks(list) {
    return {
        max: _.max(list),
        min: _.min(list)
    };
}
function numberHistory(number, history) {
    var labels = history[sprintf("%02d", number)]; // prepend 0 to single digit numbers
    //let labels = history[number];
    var data = _.map(labels, function (d) { return 1; }); // set it 1 for any date it occured
    var ctx = document.getElementById('mainChartCanvas');
    if (mainChart)
        mainChart.destroy();
    console.log("labels", labels);
    mainChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [
                {
                    label: 'occurs',
                    yAxisID: 'occurs',
                    data: data,
                    fill: false,
                    borderWidth: 1
                },
            ]
        },
        options: {
            responsive: true,
            //onClick : ycChartClickFunction,
            title: {
                display: true,
                text: "History of occurences of number " + number
            },
            legend: {
                position: 'bottom'
            },
            tooltips: {
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
                        scaleLabel: {
                            display: false,
                            labelString: 'Occurs'
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
function occurenceTotals(chartId, data) {
    return __awaiter(this, void 0, void 0, function () {
        var dataCooked, sorted, values, labels, ctx;
        return __generator(this, function (_a) {
            dataCooked = [];
            _.each(data.history, function (list, num) {
                dataCooked.push({ num: num, occurence: list.length });
            });
            sorted = _.orderBy(dataCooked, ['num'], ['desc']);
            values = _.map(sorted, function (item) { return item.occurence; });
            labels = _.map(sorted, function (item) { return item.num; });
            console.log("labels", labels);
            console.log("values", values);
            ctx = document.getElementById('mainChartCanvas');
            if (mainChart)
                mainChart.destroy();
            mainChart = new Chart(ctx, {
                type: 'line',
                data: {
                    labels: labels,
                    datasets: [
                        {
                            label: 'Winning Numbers',
                            data: values,
                            borderWidth: 1
                        },
                    ]
                },
                options: {
                    responsive: true,
                    title: {
                        display: true,
                        text: "Winning numbers occurence in descending number order"
                    },
                    legend: {
                        position: 'bottom'
                    },
                    scales: {
                        yAxes: [{
                                type: 'linear',
                                position: 'left',
                                scaleLabel: {
                                    display: true,
                                    labelString: 'Number of occurences'
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
            return [2 /*return*/];
        });
    });
}
function occurenceDetails(chartId, data) {
    return __awaiter(this, void 0, void 0, function () {
        var labels, datasets, yAxes, ctx;
        return __generator(this, function (_a) {
            labels = data.dates;
            datasets = [];
            yAxes = [];
            _.each(data.history, function (dates, winner) {
                datasets.push({
                    label: winner,
                    // if number was a winner, set datapoint to it, ortherwise null
                    data: _.map(labels, function (l) { return _.find(dates, function (d) { return d == l; }) ? winner : null; }),
                    borderWidth: 1,
                    showLine: false
                });
            });
            ctx = document.getElementById('mainChartCanvas');
            if (mainChart)
                mainChart.destroy();
            mainChart = new Chart(ctx, {
                type: 'line',
                data: {
                    labels: labels,
                    datasets: datasets
                },
                options: {
                    responsive: true,
                    animation: false,
                    //onClick : ycChartClickFunction,
                    title: {
                        display: true,
                        text: "Winning numbers details in descending number order"
                    },
                    legend: {
                        position: 'bottom'
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
                                scaleLabel: {
                                    display: true,
                                    labelString: 'Winning numbers'
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
            return [2 /*return*/];
        });
    });
}
function timeLapse(chartId, data) {
    return __awaiter(this, void 0, void 0, function () {
        var labels, ctx, dayIndex;
        return __generator(this, function (_a) {
            labels = data.dates;
            ctx = document.getElementById('mainChartCanvas');
            if (mainChart)
                mainChart.destroy();
            mainChart = new Chart(ctx, {
                type: 'scatter',
                data: {
                    labels: labels,
                    datasets: [{
                            label: "Timelapse",
                            data: []
                        }]
                },
                options: {
                    responsive: true,
                    animation: false,
                    //onClick : ycChartClickFunction,
                    title: {
                        display: true,
                        text: "Winning numbers time progression"
                    },
                    legend: {
                        position: 'bottom'
                    },
                    tooltips: {
                        callbacks: {
                            label: function (tooltipItem, data) {
                                var i = tooltipItem.index;
                                return JSON.stringify(data.datasets[0].data[i]);
                            }
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
                            }]
                    },
                    plugins: {
                        colorschemes: {
                            scheme: 'brewer.Paired12'
                        }
                    }
                }
            });
            dayIndex = 0;
            window.animationTimer = setInterval(function () {
                var daywinners = data.drawings[data.dates[dayIndex]]; // first day of lotto drawing
                var dayDataPoints = _.map(daywinners, function (winner) { return { x: data.dates[dayIndex], y: parseInt(winner) }; });
                mainChart.data.datasets[0].data = dayDataPoints;
                mainChart.update();
                dayIndex++;
                if (dayIndex == data.dates.length)
                    clearTimeout(window.animationTimer);
            }, 10);
            return [2 /*return*/];
        });
    });
}
function numberAgingDays(chartId, data) {
    return __awaiter(this, void 0, void 0, function () {
        var dataCooked, ms2days, sorted, values, labels, ctx;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, getdata()];
                case 1:
                    data = _a.sent();
                    dataCooked = [];
                    ms2days = 1000 * 3600 * 24;
                    _.each(data.history, function (list, num) {
                        dataCooked.push({ num: num, age: Math.floor((new Date().getTime() - new Date(list.pop()).getTime()) / ms2days) }); // age is in days
                    });
                    sorted = _.orderBy(dataCooked, ['age'], ['desc']);
                    values = _.map(sorted, function (item) { return item.age; });
                    labels = _.map(sorted, function (item) { return item.num; });
                    console.log("labels", labels);
                    console.log("values", values);
                    ctx = document.getElementById('mainChartCanvas');
                    if (mainChart)
                        mainChart.destroy();
                    mainChart = new Chart(ctx, {
                        type: 'bar',
                        data: {
                            labels: labels,
                            datasets: [
                                {
                                    label: 'Winning Number Age (in days)',
                                    data: values,
                                    borderWidth: 1
                                },
                            ]
                        },
                        options: {
                            responsive: true,
                            title: {
                                display: true,
                                text: "Winning numbers age in descending number order"
                            },
                            legend: {
                                position: 'bottom'
                            },
                            scales: {
                                yAxes: [{
                                        type: 'linear',
                                        position: 'left',
                                        scaleLabel: {
                                            display: true,
                                            labelString: 'Age in days'
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
                    return [2 /*return*/];
            }
        });
    });
}
function numberAgingDraws(chartId, data) {
    return __awaiter(this, void 0, void 0, function () {
        var datesLatestFirst, dataCooked, sorted, values, labels, ctx;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, getdata()];
                case 1:
                    data = _a.sent();
                    datesLatestFirst = _.reverse(data.dates);
                    dataCooked = [];
                    _.each(data.history, function (list, num) {
                        if (num < "70")
                            dataCooked.push({ num: num, age: ageInDraws(datesLatestFirst, list.pop()) }); // list.pop() is the last time the numebr won
                    });
                    sorted = _.orderBy(dataCooked, ['age'], ['desc']);
                    values = _.map(sorted, function (item) { return item.age; });
                    labels = _.map(sorted, function (item) { return item.num; });
                    console.log("labels", labels);
                    console.log("values", values);
                    ctx = document.getElementById('mainChartCanvas');
                    if (mainChart)
                        mainChart.destroy();
                    mainChart = new Chart(ctx, {
                        type: 'bar',
                        data: {
                            labels: labels,
                            datasets: [
                                {
                                    label: 'Winning Number Age (in draws)',
                                    data: values,
                                    borderWidth: 1
                                },
                            ]
                        },
                        options: {
                            responsive: true,
                            title: {
                                display: true,
                                text: "Winning numbers age in descending number order"
                            },
                            legend: {
                                position: 'bottom'
                            },
                            scales: {
                                yAxes: [{
                                        type: 'linear',
                                        position: 'left',
                                        scaleLabel: {
                                            display: true,
                                            labelString: 'Age in draws'
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
                    return [2 /*return*/];
            }
        });
    });
}
function ageInDraws(list, dt) {
    for (var i = 0; i < list.length; i++) {
        if (list[i] == dt)
            return i; // number of draws ago
    }
    return undefined; // can't happen
}
