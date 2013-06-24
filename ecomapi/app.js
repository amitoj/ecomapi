var application_root = __dirname,
    express = require("express"),
    path = require("path"),
    mongoose = require('mongoose');

var app = express();

// Database
mongoose.connect('mongodb://localhost/ecomm_database');

// Config
app.configure(function () {
	app.use(express.bodyParser());
	app.use(express.methodOverride());
	app.use(app.router);
	app.use(express.static(path.join(application_root, "public")));
	app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});


// Schema
var Schema = mongoose.Schema;  

var Product = new Schema({  
    title: { type: String, required: true },  
    description: { type: String, required: true },  
    style: { type: String, unique: true },  
    modified: { type: Date, 'default': Date.now }
});

var ProductModel = mongoose.model('Product', Product);

app.get('/api', function (req, res) {
	res.send('Ecomm API is running');
});

//READ a List of Products
app.get('/api/products', function (req, res) {
	return ProductModel.find(function (err, products) {
		if (!err) {
			return res.send(products);
		} else {
			return console.log(err);
		}
	});
});

//CREATE a Single Product
app.post('/api/products', function (req, res) {
	var product;
	console.log("POST: ");
	console.log(req.body);
	product = new ProductModel({
		title: req.body.title,
		description: req.body.description,
		style: req.body.style
	});
	product.save(function (err) {
		if (!err) {
			return console.log("created");
		} else {
			return console.log(err);
		}
	});
	return res.send(product);
});

//READ a Single Product by ID
app.get('/api/products/:id', function (req, res) {
	return ProductModel.findById(req.params.id, function (err, product) {
		if (!err) {
			return res.send(product);
		} else {
			return console.log(err);
		}
	});
});

//UPDATE a Single Product by ID
app.put('/api/products/:id', function (req, res) {
	return ProductModel.findById(req.params.id, function (err, product) {
		product.title = req.body.title;
		product.description = req.body.description;
		product.style = req.body.style;
		return product.save(function (err) {
			if (!err) {
				console.log("updated");
			} else {
				console.log(err);
			}
			return res.send(product);
		});
	});
});

//DELETE a Single Product by ID
app.delete('/api/products/:id', function (req, res) {
	return ProductModel.findById(req.params.id, function (err, product) {
		return product.remove(function (err) {
			if (!err) {
				console.log("removed");
				return res.send('');
			} else {
				console.log(err);
			}
		});
	});
});





// Launch server
app.listen(4242);
console.log('Ecom API Server is listening on 4242');