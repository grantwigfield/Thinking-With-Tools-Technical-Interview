//General submit button for all countries
const getButton = document.getElementById('get');
//Data table for all sales
const collected_data = document.getElementById('collected_data');
//Data table for makes
const collected_makes = document.getElementById('collected_makes');
//Data table for models
const collected_models = document.getElementById('collected_models');
//Data table for sellers
const collected_sellers = document.getElementById('collected_sellers');
//Data table for countries
const collected_countries = document.getElementById('collected_countries');
//Text box for country selection
const countries_box = document.getElementById('countries_box');
//Submit button for country selection
const search_button = document.getElementById('search_button');
//A text box at the top of the page that is blank by default.  If no countries can be found, an error message is displayed.
const error = document.getElementById('error');
//Array storing all models
var models = [];
//Array storing all makes
var makes = [];
//Array storing all sellers
var sellers = [];
//Array storing all countries
var countries = [];
//Array storing how many cars of each model were sold
var models_sold = [];
//Array storing how  many cars of each make were sold
var makes_sold = [];
//Array storing how many cars each seller sold
var sellers_sold = [];
//Array storing how many cars were sold in each country
var countries_sold = [];
//Array storing the total revenue made from each model
var models_prices = [];
//Array storing the total revenue made from each make
var makes_prices = [];
//Array storing the total revenue made by each seller
var sellers_prices = [];
//Array storing the total revenue made from each country
var countries_prices = [];
//Total number of sales made
var total_sales = 0;
//Total revenue made
var total_prices = 0;

//Collects data from the API endpoint for the specified countries, stores it in arrays, and displays it in the appropriate HTML tables
const getCountryData = () => {
	//Make a new request
	const request = new XMLHttpRequest();
	request.responseType = 'json';
	request.onreadystatechange = () => {
		//When a request is fulfilled
    	if (request.readyState === XMLHttpRequest.DONE) {
    		//If one or more of the countries given were recognized
    		if (request.response[0].hasOwnProperty('import_country')) {
    			//Empty all arrays and set the number of sales and total revenue to 0
	    		models.length = 0;
	    		makes.length = 0;
	    		sellers.length = 0;
	    		countries.length = 0;
	    		models_sold.length = 0;
	    		makes_sold.length = 0;
	    		sellers_sold.length = 0;
	    		countries_sold.length = 0;
	    		models_prices.length = 0;
	    		makes_prices.length = 0;
	    		sellers_prices.length = 0;
	    		countries_prices.length = 0;
	    		total_sales = 0;
	    		total_prices = 0;

	    		//Make a new HTML table for All Sales
	    		var new_table =`<table id="data_table" style="width:100%">
	    			<tr>
	    				<th>ID</th>
						<th>Import Country</th>
						<th>Model</th>
						<th>Make</th>
						<th>Sold By</th>
						<th>Sale Price</th>
	    			</tr>`;
	    		//For each record received, add its data to the All Sales table
	    		for (x = 0; x < request.response.length; x++) {
		    		new_table += `<tr>
		    						<td>${request.response[x].id}</td>
		    						<td>${request.response[x].import_country}</td>
		    						<td>${request.response[x].model}</td>
		    						<td>${request.response[x].make}</td>
		    						<td>${request.response[x].sold_by}</td>
		    						<td>${request.response[x].sale_price}</td></tr>`;

		    		/*Also add the appropriate data to the appropriate arrays.  It works the same way for models, makes, sellers,
		    		and countries, so instead of detailing it four times, I'll just describe how it works for models.*/
		    		//Get the index in the models array of the current model
		    		var current_models_index = models.indexOf(request.response[x].model);
		    		//If that model is not yet stored in the array
		    		if (current_models_index == -1){
		    			//Add it to the array
		    			models.push(request.response[x].model);
		    			//Store the number of cars of this model sold in models_sold (in this case, it's just 1)
		    			models_sold.push(1);
		    			/*Store the total revenue generated by this model of car in models_prices 
		    			(in this case, it's just the revenue from this one sale)*/
		    			models_prices.push(request.response[x].sale_price);
		    		}
		    		//If that model has already been stored
		    		else {
		    			//Update the number of cars of this model sold
		    			models_sold[current_models_index] += 1;
		    			//Update the total revenue generated by this model of car
		    			models_prices[current_models_index] += request.response[x].sale_price; 
		    		}

		    		//The process works the exact same way for makes
		    		var current_makes_index = makes.indexOf(request.response[x].make);
		    		if (current_makes_index == -1) {
		    			makes.push(request.response[x].make);
		    			makes_sold.push(1);
		    			makes_prices.push(request.response[x].sale_price);
		    		}
		    		else {
		    			makes_sold[current_makes_index] += 1;
		    			makes_prices[current_makes_index] += request.response[x].sale_price;
		    		}

		    		//The process works the exact same way for sellers
		    		var current_sellers_index = sellers.indexOf(request.response[x].sold_by);
		    		if (current_sellers_index == -1) {
		    			sellers.push(request.response[x].sold_by);
		    			sellers_sold.push(1);
		    			sellers_prices.push(request.response[x].sale_price);
		    		}
		    		else {
		    			sellers_sold[current_sellers_index] += 1;
		    			sellers_prices[current_sellers_index] += request.response[x].sale_price;
		    		}

		    		//The process works the exact same way for countries
		    		var current_countries_index = countries.indexOf(request.response[x].import_country);
		    		if (current_countries_index == -1) {
		    			countries.push(request.response[x].import_country);
		    			countries_sold.push(1);
		    			countries_prices.push(request.response[x].sale_price);
		    		}
		    		else {
		    			countries_sold[current_countries_index] += 1;
		    			countries_prices[current_countries_index] += request.response[x].sale_price;
		    		}

		    		//Update the values for the total number of sales and the total revenue generated
		    		total_sales += 1;
	    			total_prices += request.response[x].sale_price;
		    	}
		    	//End the new All Sales table generated
		    	new_table += `</table>`;

		    	//Generate a new makes table
		    	var new_makes_table = `<table id="makes_table" style="width:100%">
										<tr>
											<th>Make</th>
											<th>Total Number of Sales</th>
											<th>Percentage of All Sales</th>
											<th>Total Make Revenue</th>
											<th>Percentage of All Revenue</th>
										</tr>`;
		    	/*For every make stored in the makes array, add the appropriate data to the table, 
		    	calculating percentages where necessary*/
		    	for (y = 0; y < makes.length; y++) {
		    		new_makes_table += `<tr>
		    								<td>${makes[y]}</td>
		    								<td>${makes_sold[y]}</td>
		    								<td>${Math.round(10000 * (makes_sold[y]/total_sales)) / 100}%</td>
		    								<td>${makes_prices[y]}</td>
		    								<td>${Math.round(10000 * (makes_prices[y]/total_prices)) / 100}%</td></tr>`;
		    	}
		    	//End the table
		    	new_makes_table += `</table>`;

		    	//The new models table is made in the same way
		    	var new_models_table = `<table id="model_table" style="width:100%">
										<tr>
											<th>Model</th>
											<th>Total Number of Sales</th>
											<th>Percentage of All Sales</th>
											<th>Total Model Revenue</th>
											<th>Percentage of All Revenue</th>
										</tr>`;
		    	for (z = 0; z < models.length; z++) {
		    		new_models_table += `<tr>
		    								<td>${models[z]}</td>
		    								<td>${models_sold[z]}</td>
		    								<td>${Math.round(10000 * (models_sold[z]/total_sales)) / 100}%</td>
		    								<td>${models_prices[z]}</td>
		    								<td>${Math.round(10000 * (models_prices[z]/total_prices)) / 100}%</td></tr>`;
		    	}
		    	new_models_table += `</table>`;

		    	//The new sellers table is made in the same way
		    	var new_sellers_table = `<table id="sellers_table" style="width:100%">
											<tr>
												<th>Seller</th>
												<th>Total Number of Sales</th>
												<th>Percentage of All Sales</th>
												<th>Total Seller Revenue</th>
												<th>Percentage of All Revenue</th>
											</tr>`
				for (a = 0; a < sellers.length; a++) {
		    		new_sellers_table += `<tr>
		    								<td>${sellers[a]}</td>
		    								<td>${sellers_sold[a]}</td>
		    								<td>${Math.round(10000 * (sellers_sold[a]/total_sales)) / 100}%</td>
		    								<td>${sellers_prices[a]}</td>
		    								<td>${Math.round(10000 * (sellers_prices[a]/total_prices)) / 100}%</td></tr>`;
		    	}
		    	new_sellers_table += `</table>`;

		    	//The new countries table is made in the same way
		    	var new_countries_table = `<table id="countries_table" style="width:100%">
												<tr>
													<th>Country</th>
													<th>Total Number of Sales</th>
													<th>Percentage of All Sales</th>
													<th>Total Country Revenue</th>
													<th>Percentage of All Revenue</th>
												</tr>`;
				for (b = 0; b < countries.length; b++) {
					new_countries_table += `<tr>
			    								<td>${countries[b]}</td>
			    								<td>${countries_sold[b]}</td>
			    								<td>${Math.round(10000 * (countries_sold[b]/total_sales)) / 100}%</td>
			    								<td>${countries_prices[b]}</td>
			    								<td>${Math.round(10000 * (countries_prices[b]/total_prices)) / 100}%</td></tr>`;
				}
				new_countries_table += `</table>`;

		    	//Post the new tables onto the page and remove the error message if it exists
		    	collected_data.innerHTML = new_table;
		    	collected_makes.innerHTML = new_makes_table;
		    	collected_models.innerHTML = new_models_table;
		    	collected_sellers.innerHTML = new_sellers_table;
		    	collected_countries.innerHTML = new_countries_table;
		    	error.innerHTML = '<p></p>';
		    }
		    //If none of the given countries were recognized, post the given error message
		    else {
		    	error.innerHTML = '<p>None of the countries given were recognized.  Please try again, and be sure to spell correctly!</p>';
		    }
    	}
    };

    //Split the countries listed in the text box into different values, ignoring commas and spaces
    var country_list = countries_box.value.split(/,| /);
    //Start the url where we will get our data from
    var url = 'https://my.api.mockaroo.com/wigfield.json?key=e6ac1da0&countries='
    //Add every country parsed to the url
    for (x = 0; x < country_list.length; x++) {
    	if (x != 0) {
    		url += ',';
    	}
    	url += country_list[x].charAt(0).toUpperCase() + country_list[x].slice(1);
    }
    //Request data from the url
    request.open('GET', url);
    request.send();
}

//Get sales data from the API endpoint for all countries
const getData = () => {
	//Make a data request
	const request = new XMLHttpRequest();
	request.responseType = 'json';
	request.onreadystatechange = () => {
		//If the data is successfully acquired
    	if (request.readyState === XMLHttpRequest.DONE) {
    		//Clear all arrays and reset the values for number of sales and total revenue
    		models.length = 0;
    		makes.length = 0;
    		sellers.length = 0;
    		countries.length = 0;
    		models_sold.length = 0;
    		makes_sold.length = 0;
    		sellers_sold.length = 0;
    		countries_sold.length = 0;
    		models_prices.length = 0;
    		makes_prices.length = 0;
    		sellers_prices.length = 0;
    		countries_prices.length = 0;
    		total_sales = 0;
    		total_prices = 0;

    		//Create a new All Sales table just like we did in GetCountryData()
    		var new_table =`<table id="data_table" style="width:100%">
    			<tr>
    				<th>ID</th>
					<th>Import Country</th>
					<th>Model</th>
					<th>Make</th>
					<th>Sold By</th>
					<th>Sale Price</th>
    			</tr>`;
    		//For every element given to us, store it in the All Sales table and in the appropriate arrays like in GetCountryData()
    		for (x = 0; x < request.response.length; x++) {
	    		new_table += `<tr>
	    						<td>${request.response[x].id}</td>
	    						<td>${request.response[x].import_country}</td>
	    						<td>${request.response[x].model}</td>
	    						<td>${request.response[x].make}</td>
	    						<td>${request.response[x].sold_by}</td>
	    						<td>${request.response[x].sale_price}</td></tr>`;

	    		var current_models_index = models.indexOf(request.response[x].model);
	    		if (current_models_index == -1){
	    			models.push(request.response[x].model);
	    			models_sold.push(1);
	    			models_prices.push(request.response[x].sale_price);
	    		}
	    		else {
	    			models_sold[current_models_index] += 1;
	    			models_prices[current_models_index] += request.response[x].sale_price; 
	    		}

	    		var current_makes_index = makes.indexOf(request.response[x].make);
	    		if (current_makes_index == -1) {
	    			makes.push(request.response[x].make);
	    			makes_sold.push(1);
	    			makes_prices.push(request.response[x].sale_price);
	    		}
	    		else {
	    			makes_sold[current_makes_index] += 1;
	    			makes_prices[current_makes_index] += request.response[x].sale_price;
	    		}

	    		var current_sellers_index = sellers.indexOf(request.response[x].sold_by);
	    		if (current_sellers_index == -1) {
	    			sellers.push(request.response[x].sold_by);
	    			sellers_sold.push(1);
	    			sellers_prices.push(request.response[x].sale_price);
	    		}
	    		else {
	    			sellers_sold[current_sellers_index] += 1;
	    			sellers_prices[current_sellers_index] += request.response[x].sale_price;
	    		}

	    		var current_countries_index = countries.indexOf(request.response[x].import_country);
	    		if (current_countries_index == -1) {
	    			countries.push(request.response[x].import_country);
	    			countries_sold.push(1);
	    			countries_prices.push(request.response[x].sale_price);
	    		}
	    		else {
	    			countries_sold[current_countries_index] += 1;
	    			countries_prices[current_countries_index] += request.response[x].sale_price;
	    		}

	    		total_sales += 1;
	    		total_prices += request.response[x].sale_price;
	    	}
	    	new_table += `</table>`;
	    	//Store the appropriate values in a new makes table, like in GetCountryData()
	    	var new_makes_table = `<table id="makes_table" style="width:100%">
									<tr>
										<th>Make</th>
										<th>Total Number of Sales</th>
										<th>Percentage of All Sales</th>
										<th>Total Make Revenue</th>
										<th>Percentage of All Revenue</th>
									</tr>`;
	    	for (y = 0; y < makes.length; y++) {
	    		new_makes_table += `<tr>
	    								<td>${makes[y]}</td>
	    								<td>${makes_sold[y]}</td>
	    								<td>${Math.round (10000 *(makes_sold[y]/total_sales)) / 100}%</td>
	    								<td>${makes_prices[y]}</td>
	    								<td>${Math.round(10000 * (makes_prices[y]/total_prices)) / 100}%</td></tr>`;
	    	}
	    	new_makes_table += `</table>`;

	    	//Store the appropriate values in a new models table, like in GetCountryData()
	    	var new_models_table = `<table id="model_table" style="width:100%">
									<tr>
										<th>Model</th>
										<th>Total Number of Sales</th>
										<th>Percentage of All Sales</th>
										<th>Total Model Revenue</th>
										<th>Percentage of All Revenue</th>
									</tr>`;
	    	for (z = 0; z < models.length; z++) {
	    		new_models_table += `<tr>
	    								<td>${models[z]}</td>
	    								<td>${models_sold[z]}</td>
	    								<td>${Math.round(10000 * (models_sold[z]/total_sales)) / 100}%</td>
	    								<td>${models_prices[z]}</td>
	    								<td>${Math.round(10000 * (models_prices[z]/total_prices)) / 100}%</td></tr>`;
	    	}
	    	new_models_table += `</table>`;

	    	//Store the appropriate values in a new sellers table, like in GetCountryData()
	    	var new_sellers_table = `<table id="sellers_table" style="width:100%">
										<tr>
											<th>Seller</th>
											<th>Total Number of Sales</th>
											<th>Percentage of All Sales</th>
											<th>Total Seller Revenue</th>
											<th>Percentage of All Revenue</th>
										</tr>`
			for (a = 0; a < sellers.length; a++) {
	    		new_sellers_table += `<tr>
	    								<td>${sellers[a]}</td>
	    								<td>${sellers_sold[a]}</td>
	    								<td>${Math.round(10000 * (sellers_sold[a]/total_sales)) / 100}%</td>
	    								<td>${sellers_prices[a]}</td>
	    								<td>${Math.round(10000 * (sellers_prices[a]/total_prices)) / 100}%</td></tr>`;
	    	}
	    	new_sellers_table += `</table>`;

	    	//Store the appropriate values in a new countries table, like in GetCountryData()
	    	var new_countries_table = `<table id="countries_table" style="width:100%">
											<tr>
												<th>Country</th>
												<th>Total Number of Sales</th>
												<th>Percentage of All Sales</th>
												<th>Total Country Revenue</th>
												<th>Percentage of All Revenue</th>
											</tr>`;
			for (b = 0; b < countries.length; b++) {
				new_countries_table += `<tr>
		    								<td>${countries[b]}</td>
		    								<td>${countries_sold[b]}</td>
		    								<td>${Math.round(10000 * (countries_sold[b]/total_sales)) / 100}%</td>
		    								<td>${countries_prices[b]}</td>
		    								<td>${Math.round(10000 * (countries_prices[b]/total_prices)) / 100}%</td></tr>`;
			}
			new_countries_table += `</table>`;

			//Display the new tables on the page and remove the error message if applicable
	    	collected_data.innerHTML = new_table;
	    	collected_makes.innerHTML = new_makes_table;
	    	collected_models.innerHTML = new_models_table;
	    	collected_sellers.innerHTML = new_sellers_table;
	    	collected_countries.innerHTML = new_countries_table;
	    	error.innerHTML = '<p></p>';
    	}
    };
    //Create and send out our new request
    request.open('GET','https://my.api.mockaroo.com/wigfield.json?key=e6ac1da0');
    request.send();
}

//Set our All Countries button to execute getData() when clicked
getButton.addEventListener('click', getData);
//Set our Countries button to execute getCountryData() when clicked
search_button.addEventListener('click', getCountryData);