var nodes = {
	
	one: require('./_sys-data-tree/sys-get-recent.js'),

	all: require('./_sys-data-tree/sys-search.js')
};

function react (data) {

	return nodes[data.path].react(data.data);
}

module.exports = {

	react: react
};