module.exports = function(app) {

app.get('/', function(req, res) {
	var categories = ["c1", "c2", "c3", "c4", "c5", "c6"]
	var categories_obj = categories.map(function(name) {
		return {'category' : name};
	});
	var rows = [
		["1", "1", "", "1", "1", "1"],
		["2", "2", "2", "", "2", ""],
		["3", "", "3", "", "3", ""],
		["4", "", "", "", "4", "4"],
		["5", "", "5", "", "5", ""],
		["6", "", "", "6", "", ""]
	]
	var rows_obj = rows.map(function(row) {
		return {'questions' : row.map(function(value) {
			return {'value' : value}
		})};
	});
	var viewObj = {
		"categories" : categories_obj,
		"rows" : rows_obj
	};
	res.render('index', viewObj);
})

}