function Table(num_entries, num_cols, col_names, data) {
    this.num_entries = num_entries;
    this.num_cols = num_cols;
    this.col_names = col_names;
    this.data = data;
    this.addEntry = addEntryTable;
    this.toJSON = tableToJSON;
}

function addEntryTable(newData) {
    this.num_entries++;
    this.data.push(newData);
}

function tableToJSON() {
	var jsonObj = {
		"num_entries": this.num_entries,
		"num_cols:": this.num_cols,
		"col_names": this.col_names,
		"data": this.data,
	}
	return jsonObj;
}

// var table = new Table(
//     num_entries= 5,
//     num_cols = 3,
//     col_names = ['trial', 'color', 'feeling'],
//     data = [[1,'brown','refreshing'],[2,'purple','gnarly'], [3, 'pink', 'explosive'], [4, 'white', 'exquisite'], [5, 'blue', 'sad']]
// );
// table.addEntry([6,'orange','happy'])