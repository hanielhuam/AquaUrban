var nodes = {
	
	data: require('./_query-tree/sys-data.js'),

	alert: require('./_query-tree/sys-alert.js')
};

global.temperatureIndex = '0';

global.phIndex = '1';

function react (data) {

	return nodes[data.path].react(data.data);
}

module.exports = {

	react: react
};
//END OF FILE;