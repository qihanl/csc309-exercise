/*
 * This code is provided solely for the personal and private use of students
 * taking the CSC309H course at the University of Toronto. Copying for purposes
 * other than this use is expressly prohibited. All forms of distribution of
 * this code, including but not limited to public repositories on GitHub,
 * GitLab, Bitbucket, or any other online platform, whether as given or with
 * any changes, are expressly prohibited.
*/

/* Reservations.js */ 
'use strict';

const fs = require('fs');
const datetime = require('date-and-time');

const startSystem = () => {

	let status = {};

	try {
		status = getSystemStatus();
	} catch(e) {
		status = {
			numRestaurants: 0,
			totalReservations: 0,
			currentBusiestRestaurantName: null,
			systemStartTime: new Date(),
		}

		fs.writeFileSync('status.json', JSON.stringify(status))
	}

	return status;
}

/*********/


// You may edit getSystemStatus below.  You will need to call updateSystemStatus() here, which will write to the json file
const getSystemStatus = () => {
	updateSystemStatus();
	const status = fs.readFileSync('status.json')

	return JSON.parse(status)
}

/* Helper functions to save JSON */
// You can add arguments to updateSystemStatus if you want.
const updateSystemStatus = () => {

	const status = JSON.parse(fs.readFileSync('status.json'));
	
	/* Add your code below */
	const restaurants = getAllRestaurants();
    const reservations = getAllReservations();

	// find the busiest restaruant by comparing the number of reservations for all restaurants
    let busiestRestaurant = "";
    let currentMax = 0;
	for (let i = 0; i < restaurants.length; i++) {
		if (restaurants[i].numReservations > currentMax) {
			currentMax = restaurants[i].numReservations;
			busiestRestaurant = restaurants[i].name;
		}
	}

	// update status and the corresponding json file
    status.numRestaurants = restaurants.length;
    status.totalReservations = reservations.length;
    status.currentBusiestRestaurantName = busiestRestaurant;

	fs.writeFileSync('status.json', JSON.stringify(status))
}

const saveRestaurantsToJSONFile = (restaurants) => {

	/* Add your code below */
	fs.writeFileSync('restaurants.json', JSON.stringify(restaurants));

};

const saveReservationsToJSONFile = (reservations) => {

	/* Add your code below */
	fs.writeFileSync('reservations.json', JSON.stringify(reservations));

};

/*********/

// Should return an array of length 0 or 1.
const addRestaurant = (name, description) => {

	// Check for duplicate names
	const restaurants = getAllRestaurants();

	for (let i = 0; i < restaurants.length; i++) {
		if (restaurants[i].name == name) {
			return [];
		}
	}

	// if no duplicate names:
	const newRestaurant = {
		name: name,
		description: description,
		numReservations: 0
	}; 

	// push the new restaurant to json file
	restaurants.push(newRestaurant);
	saveRestaurantsToJSONFile(restaurants);

	return [newRestaurant];
}

// should return the added reservation object
const addReservation = (restaurant, time, people) => {
	
	/* Add your code below */
	const reservations = getAllReservations();

	const newReservation = {
		restaurant: restaurant,
		time: new Date(time),
		people: people
	}

	// push the new reservation to json file
	reservations.push(newReservation);
	// sort the reservations by time
	reservations.sort((a, b) => (new Date(a.time)) - (new Date(b.time)));

	// update the number of reservations for the restaruant
	const restaurants = getAllRestaurants();

	for (let i = 0; i < restaurants.length; i++){
		if (restaurants[i].name == restaurant) {
			restaurants[i].numReservations ++;
		}
	}

	saveRestaurantsToJSONFile(restaurants);
	saveReservationsToJSONFile(reservations);

	return newReservation;

}


/// Getters - use functional array methods when possible! ///

// Should return an array - check to make sure restaurants.json exists
const getAllRestaurants = () => {
	/* Add your code below */
	let restaurants = [];

    try {
		// get all the restaurants from restaurants.json
        restaurants = fs.readFileSync('restaurants.json');
        return JSON.parse(restaurants);

    } catch (e) {
		// if file does not exits -> create one and return an empty array
        fs.writeFileSync('restaurants.json', JSON.stringify(restaurants));
        return restaurants;
    }
};

// Should return the restaurant object if found, or an empty object if the restaurant is not found.
const getRestaurantByName = (name) => {
	/* Add your code below */
	const restaruants= getAllRestaurants();

	for (let i = 0; i < restaruants.length; i++) {
		if (restaruants[i].name == name) {
			return restaruants[i];
		}
	}
	return null;

};

// Should return an array - check to make sure reservations.json exists
const getAllReservations = () => {
  /* Add your code below */
  let reservations = [];

  try {
    // get all the reservations from reservations.json
	reservations = fs.readFileSync('reservations.json');
	return JSON.parse(reservations);

  } catch (e) {
	// if file does not exits -> create one and return an empty array
	fs.writeFileSync('reservations.json', JSON.stringify(reservations));
	return reservations;
}

};

// Should return an array
const getAllReservationsForRestaurant = (name) => {
	/* Add your code below */
	const targetedReservations = [];
	const reservations = getAllReservations();

	for (let i = 0; i < reservations.length; i++) {
		if (reservations[i].restaurant == name) {
			targetedReservations.push(reservations[i]);
		}
	}

	return targetedReservations;

};


// Should return an array
const getReservationsForHour = (time) => {
	/* Add your code below */
	const targetedTime = new Date(time);

    const reservations = getAllReservations();

	const targetedReservations = [];

	for (let i = 0; i < reservations.length; i++) {
		const timeRange = new Date(reservations[i].time);
		if ( timeRange < datetime.addHours(targetedTime,1) && timeRange >= targetedTime) {
			targetedReservations.push(reservations[i]);
		}
	}

    targetedReservations.sort((a, b) => (new Date(a.time)) - (new Date(b.time)));
    return targetedReservations;

}

// should return a reservation object
const checkOffEarliestReservation = (restaurantName) => {

	const reservations = getAllReservations();

	// find the reservation for checked off
    let checkedOffReservation;
	let i;
    for(i = 0 ; i < reservations.length; i++) {
        if(reservations[i].restaurant == restaurantName){
            checkedOffReservation = reservations[i];
            break;
        }
    }

	// splice the reservation from all reservations and update the json file
	reservations.splice(i, 1);
    saveReservationsToJSONFile(reservations);

	// update the restaurant info and the json file
    const restaurants = getAllRestaurants();
    for(let i = 0 ; i < restaurants.length; i++) {
        if (restaurants[i].name == restaurantName) {
			restaurants[i].numReservations -= 1;
		}
    }
    saveRestaurantsToJSONFile(restaurants);

 	return checkedOffReservation;
}


const addDelayToReservations = (restaurant, minutes) => {
	// Hint: try to use a functional array method

	// find the reservation and added the delay time
	const reservations = getAllReservations();
	const delayedReservations = [];

	for(let i = 0 ; i < reservations.length; i++) {
		if (reservations[i].restaurant == restaurant) {
			reservations[i].time = datetime.addMinutes(new Date(reservations[i].time), minutes);
			delayedReservations.push(reservations[i]);
		}
	}

	// sort the reservations by time and update the json file
    reservations.sort((a, b) => (new Date(a.time)) - (new Date(b.time)));
    saveReservationsToJSONFile(reservations);

    return delayedReservations;
	
}

startSystem(); // start the system to create status.json (should not be called in app.js)


// DO NOT modify the contents of module.exports.  You may not need all of these in app.js..but they're here.
module.exports = {
	addRestaurant,
	getSystemStatus,
	getRestaurantByName,
	getAllRestaurants,
	getAllReservations,
	getAllReservationsForRestaurant,
	addReservation,
	checkOffEarliestReservation,
	getReservationsForHour,
	addDelayToReservations
}

