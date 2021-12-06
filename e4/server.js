/* 
 * This code is provided solely for the personal and private use of students 
 * taking the CSC309H course at the University of Toronto. Copying for purposes 
 * other than this use is expressly prohibited. All forms of distribution of 
 * this code, including but not limited to public repositories on GitHub, 
 * GitLab, Bitbucket, or any other online platform, whether as given or with 
 * any changes, are expressly prohibited. 
*/  

/* E4 server.js */
'use strict';
const log = console.log;

// Express
const express = require('express')
const app = express();
const bodyParser = require('body-parser')
app.use(bodyParser.json());

// Mongo and Mongoose
const { ObjectID } = require('mongodb')
const { mongoose } = require('./db/mongoose');
const { Restaurant } = require('./models/restaurant')

/* 
   Restaurant API routes below. 
   Note: You may use async-await if you wish, but you will have to modify the functions as needed.
*/

/// Route for adding restaurant, with *no* reservations (an empty array).
/* 
Request body expects:
{
	"name": <restaurant name>
	"description": <restaurant description>
}
Returned JSON should be the database document added.
*/
// POST /restaurants
app.post('/restaurants', (req, res) => {
	// Add code here

	// check mongoose connection established.
	if (mongoose.connection.readyState != 1) {
		log('Issue with mongoose connection');
		res.status(500).send('Internal server error');
		return;
	}  

	// create a new restaurant
	const newRest = new Restaurant( {
		name: req.body.name,
		description: req.body.description,
		reservations: []
	})

	// save the new restaurant
	newRest.save().then((result) => {
		res.send(result);
	}).catch((error) => {
		res.status(400).send(error); // 400 for bad request gets sent to client.
	})
})


/// Route for getting all restaurant information.
// GET /restaurants
app.get('/restaurants', (req, res) => {
	// Add code here

	// check mongoose connection established.
	if (mongoose.connection.readyState != 1) {
		log('Issue with mongoose connection');
		res.status(500).send('Internal server error');
		return;
	}  

	// find all restaurants and return
	Restaurant.find().then((restaurants) => {
		res.send({restaurants});
	}), (error) => {
		res.status(400).send(error);
	}

})


/// Route for getting information for one restaurant.
// GET /restaurants/id
app.get('/restaurants/:id', (req, res) => {
	// Add code here

	// get the restaurant id
	const id = req.params.id;

	// Validate id immediately.
	if (!ObjectID.isValid(id)) {
		res.status(404).send()  // if invalid id, definitely can't find resource, 404.
		return;  // so that we don't run the rest of the handler.
	}

	// check mongoose connection established.
	if (mongoose.connection.readyState != 1) {
		log('Issue with mongoose connection');
		res.status(500).send('Internal server error');
		return;
	}

	// If id valid, findById and return
	Restaurant.findById(req.params.id).then((restaurant) => {
		if (!restaurant) {
			res.status(404).send();
		} else {
			res.send(restaurant);
		}
	}).catch((error) => {
		res.status(400).send(error);
	})

})


/// Route for adding reservation to a particular restaurant.
/* 
Request body expects:
{
	"time": <time>
	"people": <number of people>
}
*/
// Returned JSON should have the updated restaurant database 
//   document that the reservation was added to, AND the reservation subdocument:
//   { "reservation": <reservation subdocument>, "restaurant": <entire restaurant document>}
// POST /restaurants/id
app.post('/restaurants/:id', (req, res) => {
	// Add code here

	// get the restaurant id
	const id = req.params.id;

	// Validate id immediately.
	if (!ObjectID.isValid(id)) {
		res.status(404).send();  // if invalid id, definitely can't find resource, 404.
		return;  // so that we don't run the rest of the handler.
	}

	// check mongoose connection established.
	if (mongoose.connection.readyState != 1) {
		log('Issue with mongoose connection');
		res.status(500).send('Internal server error');
		return;
	}

	// get the time and people from the request
	const time = req.body.time;
	const people = req.body.people;

	// make a reservation entry
	let reservation = {
		_id: mongoose.Types.ObjectId(),
		"time": time,
		"people": people
	}
	
	// find the restaurant by id, then push the reservation into it. Update the restaurant database
	Restaurant.findById(id).then((result) => {
		result.reservations.push(reservation);

		result.save().then((restaurant) => {
			res.send({"reservation": reservation, "restaurant": restaurant});
		}).catch((error) => {
			res.status(404).send(error);
		})
	}).catch((error) => {
		res.status(404).send(error);
	})


})


/// Route for getting information for one reservation of a restaurant (subdocument)
// GET /restaurants/id
app.get('/restaurants/:id/:resv_id', (req, res) => {
	// Add code here

	// get the restaurant and reservation id
	const restID = req.params.id;
	const resvID = req.params.resv_id;

	// Validate id immediately.
	if (!ObjectID.isValid(restID) || !ObjectID.isValid(resvID)) {
		res.status(404).send();
		return; 
	}

	// check mongoose connection established.
	if (mongoose.connection.readyState != 1) {
		log('Issue with mongoose connection');
		res.status(500).send('Internal server error');
		return;
	}

	// find restaurant by id
	Restaurant.findById(restID).then((result) => {
		if (!result) { //if restaurant is not found, return 404
			res.status(404).send();
		} else { //restaurant found
			const reservation = result.reservations.id(resvID);  //get the reservation

			if (!reservation) { //if the reservation is not found, return 404
				res.status(404).send();
			} else { //reservation found, return
				res.send(reservation);
			}
		}
	}).catch((error) => {
		res.status(400).send(error);
	})

})


/// Route for deleting reservation
// Returned JSON should have the updated restaurant database
//   document from which the reservation was deleted, AND the reservation subdocument deleted:
//   { "reservation": <reservation subdocument>, "restaurant": <entire restaurant document>}
// DELETE restaurant/<restaurant_id>/<reservation_id>
app.delete('/restaurants/:id/:resv_id', (req, res) => {
	// Add code here

	// get the restaurant and reservation id
	const restID = req.params.id;
	const resvID = req.params.resv_id;

	// Validate id immediately.
	if (!ObjectID.isValid(restID) || !ObjectID.isValid(resvID)) {
		res.status(404).send();
		return; 
	}

	// check mongoose connection established.
	if (mongoose.connection.readyState != 1) {
		log('Issue with mongoose connection');
		res.status(500).send('Internal server error');
		return;
	}

	// find restaurant by id
	Restaurant.findById(restID).then((result) => {
		if (!result) { //if restaurant is not found, return 404
			res.status(404).send();
		} else { //restaurant found
			const reservation = result.reservations.id(resvID); //get the reservation

			if (!reservation) { //if the reservation is not found, return 404
				res.status(404).send();
			} else { //reservation found
				result.reservations.id(resvID).remove(); //remove the reservation

				result.save().then((restaurant) => { //update restaurant database
					res.send({"reservation": reservation, "restaurant": restaurant});
				})
			}
		}
	}).catch((error) => {
		res.status(400).send(error);
	})

})


/// Route for changing reservation information
/* 
Request body expects:
{
	"time": <time>
	"people": <number of people>
}
*/
// Returned JSON should have the updated restaurant database
//   document in which the reservation was changed, AND the reservation subdocument changed:
//   { "reservation": <reservation subdocument>, "restaurant": <entire restaurant document>}
// PATCH restaurant/<restaurant_id>/<reservation_id>
app.patch('/restaurants/:id/:resv_id', (req, res) => {
	// Add code here

	// get the restaurant and reservation id
	const restID = req.params.id;
	const resvID = req.params.resv_id;

	// Validate id immediately.
	if (!ObjectID.isValid(restID) || !ObjectID.isValid(resvID)) {
		res.status(404).send();
		return; 
	}
	
	// check mongoose connection established.
	if (mongoose.connection.readyState != 1) {
		log('Issue with mongoose connection');
		res.status(500).send('Internal server error');
		return;
	}
	
	// get the new time and people from the request
	const newTime = req.body.time;
	const newPeople = req.body.people;

	// make a new reservation entry
	let newReservation = {
		_id: resvID,
		"time": newTime,
		"people": newPeople
	}


	// find restaurant by id
	Restaurant.findById(restID).then((result) => {
		if (!result) { //if restaurant is not found, return 404
			res.status(404).send();
		} else { //restaurant found
			const reservation = result.reservations.id(resvID); //get the reservation

			if (!reservation) { //if the reservation is not found, return 404
				res.status(404).send();
			} else { //reservation found
				// update reservation information
				reservation.time = newTime;
				reservation.people = newPeople;

				result.save().then((restaurant) => { //update restaurant database
					res.send({"reservation": newReservation, "restaurant": restaurant});
				})
			}
		}
	}).catch((error) => {
		res.status(400).send(error);
	})


})


////////// DO NOT CHANGE THE CODE OR PORT NUMBER BELOW
const port = process.env.PORT || 5000
app.listen(port, () => {
	log(`Listening on port ${port}...`)
});
