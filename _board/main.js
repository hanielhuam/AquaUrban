var nodes = {
	
	action: require('./_main-tree/action.js'),

	query: require('./_main-tree/query.js')
};

function react (data) {

	return nodes[data.path].react(data.data);
}

module.exports = {

	react: react
};
//END OF FILE;
