$(function () {

	
});

//DATA CLASS:

	class Data {

		constructor (dataFrame) {

			this.$frame = dataFrame;
		}

		setData (value) {

			this.$frame.css({

				marginTop: 200 - value,

				height: value
			});
		}
	}

//CHART CLASS:

	$('#chart').css({

		paddingRight: 0,

		paddingLeft: 0
	});

	class Chart {

		constructor (len) {

			this.$chart = $('#chart');

			this.array = [];

			this.len = len;

			this.dataWidth = (480 / (len * 2));

			while (len > 0) {

				this.$chart.append('<div class="chartData"></div>');

				this.array.push(new Data(this.$chart.find('.chartData').last()));

				len--;
			}

			this.$chart.find('.chartData').css({

				width: this.dataWidth,
				
				marginLeft: this.dataWidth / 2,

				marginRight: this.dataWidth / 2
			});
		}

		setData (index, value) {

			if (index >= this.len || index < 0 || value < 0 || value > 200) return false;

			this.array[index].setData(value);

			return true;
		}

		delete () {

			while (this.len > 0) {

				this.array[(this.len - 1)].$frame.remove();

				this.len--;
			}
		}
	}

	
//END OF FILE;