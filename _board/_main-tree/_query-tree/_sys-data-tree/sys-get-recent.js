function react (data) {

	return {data: dataIndex(data.index), index: data.index, date: stdDateString(new Date())};
}

function dataIndex (index) {

	switch (index) {

		case temperatureIndex:

			return temperatureValue;
		case phIndex:

			return phValue;
		case '2':

			return 5;
	}
}

module.exports = {

	react: react
};