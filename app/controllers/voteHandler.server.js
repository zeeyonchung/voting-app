'use strict';

var Votes = require('../models/votes.js');

function VoteHandler () {

	this.getVotes = function (req, res) {
		Votes
		.find()
		.exec(function (err, result) {
			if (err) { throw err; }

			//res.json(result);
			//console.log(result);
			res.render(process.cwd() + '/public/vote/index', { data : result, user : req.user });
		});
	};


	this.addVote = function (req, res) {
		//console.log(req.query);

		var options = [];
		req.query.options.split(",")
			.map(function(item) {
				return item.trim();
			}).forEach(function(name) {
				options.push({name: name, count: 0});
			});

		//console.log(options);

		Votes
		.create({vote: { title : req.query.title,
					  options : options,
					  author : req.query.author
		}}, function (err, result) {
			if (err) { res.json(err); }

			res.redirect('/');
		});
	};


	this.getVote = function (req, res) {

		Votes
		.findOne({ _id : req.params.id })
		.exec(function (err, result) {
			if (err) { throw err; }

			res.render(process.cwd() + '/public/vote/show', { data : result, user : req.user });
		});
	};


	this.pickOneOption = function (req, res) {

		Votes
		.findOneAndUpdate(
			{_id : req.body.id, 'vote.options._id' : req.body.option},
			{$inc : {'vote.options.$.count' : 1}},
			{new: true})
		.exec(function (err, result) {
			if (err) {throw err;}
			res.json(result);
		});

	};


	this.deleteVote = function (req, res) {
		Votes
		.remove({ _id : req.body.id, 'vote.author' : req.body.author })
		.exec(function (err, result) {
			if (err) { throw err; }

			res.redirect('/');
		});
	};


	this.getMyVotes = function (req, res) {
		Votes
		.find({ 'vote.author' : req.user._id })
		.exec(function (err, result) {
			if (err) { throw err; }

			res.render(process.cwd() + '/public/vote/my', { data : result, user : req.user });
		});
	};

}

module.exports = VoteHandler;


// https://docs.mongodb.com/manual/reference/method/db.collection.insert/