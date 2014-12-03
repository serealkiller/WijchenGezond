var hoofdCategorie = require('../models/hoofdCategorie.js');
var subCategorie = require('../models/subCategorie.js');

var exports = module.exports = {};

exports.getHoofdCategorie = function (req, res) {
	hoofdCategorie.getHoofdCategorie(req.params.id, function(data) {
		res.send(data);
	});
};

exports.getHoofdCategorieen = function (req, res) {
	hoofdCategorie.getHoofdCategorieen(function(data) {
		res.send(data);
	});
};

exports.postHoofdCategorie = function (req, res) {
	if (req.body.id) {
		hoofdCategorie.putHoofdCategorie(req.body, function(data) {
			res.send(data);
		});
	} else {
		hoofdCategorie.postHoofdCategorie(req.body, function(data) {
			res.send(data);
		});
	}
};

exports.deleteHoofdCategorie = function (req, res) {
	hoofdCategorie.deleteHoofdCategorie(req.params.id, function(data) {
		subCategorie.deleteSubCategorieen(req.params.id, function(data) {
			res.send(data);
		});
	});
};

exports.getSubCategorie = function (req, res) {
	subCategorie.getSubCategorie(req.params.id, function(data) {
		res.send(data);
	});
};

exports.getSubCategorieen = function (req, res) {
	subCategorie.getSubCategorieen(req.params.id, function(data) {
		res.send(data);
	});
};

exports.postSubCategorie = function (req, res) {
	if (req.body.id) {
		subCategorie.putSubCategorie(req.body, function(data) {
			res.send(data);
		});
	} else {
		subCategorie.postSubCategorie(req.body, function(data) {
			res.send(data);
		});
	}
};

exports.deleteSubCategorie = function (req, res) {
	subCategorie.deleteSubCategorieen(req.params.id, function(data) {
		res.send(data);
	});
};