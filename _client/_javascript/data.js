$(function () {

	//DATA FRAME INSTRUCTIONS:

		$.template('data', $('#data').html());

		window.dataSet = new DataSet('#data-form');

		dataSet.addData({id: 'temperature', measure: 'Cº'});

		dataSet.addData({id: 'acidness', measure: 'PH'});

		dataSet.addData({id: 'water-level', measure: 'cm'});
	//CHART INSTRUCTIONS:

		//CHART VIEWER:

			window.$chart = $('#chart');

			$chart.parent().css({

				backgroundColor: "rgb(255, 255, 255)"
			});

			var line1Color = "rgba(0, 0, 0, 0.9)";

			window.chart = new DataChart({
				
				data: {
				    
				    datasets: [
				        
				        {
				            label: 'temperature',
				            
				            data: [0, 0, 0, 0, 0],

				            tension: 0,

				            fill: false
				        },

				        {
				            label: 'ph',
				            
				            data: [0, 0, 0, 0, 0],

				            tension: 0,

				            fill: false
				        },

				        {
				            label: 'water-level',
				            
				            data: [0, 0, 0, 0, 0],

				            tension: 0,

				            fill: false
				        }
				    ]
				}
			});

			chart.isUpdating = true;

			requestAllRecent();

			 for (var index in chart.chart.data.datasets) {

				requestRecent(index);
			}

			setInterval(

				function () {

					for (var index in chart.chart.data.datasets) {

						requestRecent(index);
					}
				},

				timeConvert()
			);

		//CHART SETTINGS:

			window.$searcher = $('#search');

			window.$updater = $('#update');

			window.$settings = $('#settings');

			window.$dataDownloader = $('#download');

			$.template('date', $('#date-form').html());

			window.chartSettings = new ChartSetting('#settings');

			chartSettings.addField({id : 'start'});

			chartSettings.addField({id : 'end'});

			$searcher.on('click', function () {

				$settings.submit();
			});

			$updater.on('click', function () {

				$('#start-error').html('');

				$('#end-error').html('');

				requestAllRecent();

				chart.isUpdating = true;
			});

			$settings.on('submit', function (e) {

				e.preventDefault();

				var searchedData = settingsCheck(chartSettings.getData());

				chart.isUpdating = !searchedData.success;
			});

			$dataDownloader.on('click', function () {

				var blob = new Blob(getDataString(chart), {type: "text/plain;charset=utf-8"});

				saveAs(blob, 'chart-data.txt');
			});
});

//TIME FUNCTIONS AND VARIABLES:

	function timeConvert (qnt, inMeasureType, outMeasureType) {

		qnt = def(qnt, 60);

		inMeasureType = def(inMeasureType, 'seconds');

		outMeasureType = def(outMeasureType, 'milliseconds');

		this.millis = function (measureType) {

			switch (measureType) {

				case 'milliseconds':

					return 1;
				case 'seconds':

					return 1000;
				case 'minutes':

					return 60000;
				case 'hours':

					return 3600000;
				case 'days':

					return 86400000;
				case 'weeks':

					return 604800000;
			}
		}

		return (qnt * this.millis(inMeasureType) / this.millis(outMeasureType));
	};

//DATA FUNCTIONS AND CLASSES:

	var DataSet = function (id) {

		this.data = {};

		this.body = $(id);

		this.addData = function (data) {

			this.data[data.id] = new Data(data, this.body);
		};

		this.pushData = function (data, n) {

			var index;

			for (var catcher in this.data) {

				n--;

				if (n <= 0) {

					index = catcher;

					break;
				}
			}


			this.data[index].input.val(data);
		};
	}

	var Data = function (data, frame) {

		$.tmpl('data', data).appendTo(frame);

		this.input = $('#' + data.id);

		this.id = data.id;
	}

//CHART FUNCTIONS AND CLASSES:

	//CHART VIEWER:

		var DataChart = function (param, canvasFrame) {

			this.chart = new Chart(
				
				def(canvasFrame, $chart),

				sonSet(param, defSet)
			);

			this.pushLabelCycle = 3;

			this.pushLabelStage = -3;

			this.pushRecent = function (newData, index, date) {

				index = def(index, 0);

				newData = def(newData, this.chart.data.datasets[index].data[this.chart.data.datasets[index].data.length - 1]);

				if (this.pushLabelStage == 0) {

					this.chart.data.labels.shift();

					this.chart.data.labels.push(stdDateString(new Date()));
				}

				this.pushLabelStage = (this.pushLabelStage + 1) % this.pushLabelCycle;

				this.chart.data.datasets[index].data.shift();

				this.chart.data.datasets[index].data.push(newData);

				this.chart.update();
			};

			this.isUpdating = true;

			this.setAll = function (newData, newLabel) {

				this.pushLabelStage = -3;
				
				var newDataSet = [];

				for (var index in newData) {

					newDataSet.push(sonSet(newData[index], this.chart.data.datasets[index]));
				}

				this.chart.data.datasets = newDataSet;

				this.chart.data.labels = newLabel;

				this.chart.update();
			}
		};

		var defSet = {

			type: 'line',

			options: {

				scales: {

					yAxes: [{

						ticks: {

							beginAtZero: true
						}
					}]
				}
			},

			data: {

				labels: updatedTime.array()
			}
		};
	//CHART SETTINGS:

		var ChartSetting = function (id) {

			this.body = $(id);

			this.fields = {};

			this.addField = function (data) {

				this.fields[data.id] = new FormData(data, this.body);
			}

			this.getData = function () {

				var data = {};

				for (var index0 in this.fields) {

					for (var index1 in this.fields[index0].data) {

						data[index0 + index1] = this.fields[index0].data[index1].val();
					}
				}

				return data;
			}
		}

		var FormData = function (data, frame) {

			$.tmpl('date', data).appendTo(frame);

			this.data = {

				Year: $('[name = "' + data.id + 'Year"]'),

				Month: $('[name = "' + data.id + 'Month"]'),

				Day: $('[name = "' + data.id + 'Day"]'),

				Hour: $('[name = "' + data.id + 'Hour"]'),

				Minute: $('[name = "' + data.id + 'Minute"]')
			};
		}

		function getDataString (currentChart) {

			var file = [];

			var line;

			for (var index in currentChart.chart.data.labels) {

				line = String(currentChart.chart.data.labels[index]);

				line = line.concat(' { ');

				for (var datasets in currentChart.chart.data.datasets) {

					line = line.concat(currentChart.chart.data.datasets[datasets].label + ': ' + currentChart.chart.data.datasets[datasets].data[index] + ', ');
				}

				line = line.concat('};\n');

				file.push(line);
			}

			return file;
		}
//COMMUNICATION FUNCTIONS:

	function update (data, index, date) {

		if (chart.isUpdating) chart.pushRecent(data, parseInt(index), date);

		dataSet.pushData(data, parseInt(index) + 1);
	}

	function updateAll (data) {

		chart.setAll(data.datasets, data.labels);
	}
//END OF FILE;