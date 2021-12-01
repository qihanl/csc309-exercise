/*
 * This code is provided solely for the personal and private use of students
 * taking the CSC309H course at the University of Toronto. Copying for purposes
 * other than this use is expressly prohibited. All forms of distribution of
 * this code, including but not limited to public repositories on GitHub,
 * GitLab, Bitbucket, or any other online platform, whether as given or with
 * any changes, are expressly prohibited.
*/

/* E3 app.js */

'use strict';

const log = console.log
const yargs = require('yargs').option('addRest', {
    type: 'array' // Allows you to have an array of arguments for particular command
  }).option('addResv', {
    type: 'array' 
  }).option('addDelay', {
    type: 'array' 
  })

const reservations = require('./reservations');

// datetime available if needed
const datetime = require('date-and-time') 

const yargs_argv = yargs.argv
//log(yargs_argv) // uncomment to see what is in the argument array

if ('addRest' in yargs_argv) {
	const args = yargs_argv['addRest']
	const rest = reservations.addRestaurant(args[0], args[1]);	
	if (rest.length > 0) {
		/* complete */ 
		console.log("Added restaurant " + rest[0].name + ".") ;
	} else {
		/* complete */ 
		console.log("Duplicate restaurant not added.")
	}
}

if ('addResv' in yargs_argv) {
	const args = yargs_argv['addResv']
	const resv = reservations.addReservation(args[0], args[1], args[2]);

	// Produce output below
	const timeTemp = datetime.format(resv.time, "h:mm");
	// Parse am and pm
	const hour = args[1].split(" ")[3].split(":")[0];
	// convert time to the required format
	const timeConvert = datetime.format(resv.time, 'MMM DD YYYY') + " at " + timeTemp + (hour > 12 ? " p.m." : " a.m.");

    console.log("Added reservation at " + resv.restaurant + " on " + timeConvert + " for " + resv.people + " people.");
	
}

if ('allRest' in yargs_argv) {
	const restaurants = reservations.getAllRestaurants(); // get the array
	
	// Produce output below
	for (let i = 0; i < restaurants.length; i++) {
		console.log( restaurants[i].name + ": " + restaurants[i].description + " - " + restaurants[i].numReservations + " active reservations");
	}
}

if ('restInfo' in yargs_argv) {
	const restaurants = reservations.getRestaurantByName(yargs_argv['restInfo']);

	// Produce output below
	console.log(restaurants.name + ": " + restaurants.description + " - " + restaurants.numReservations + " active reservations")

}

if ('allResv' in yargs_argv) {
	const restaurantName = yargs_argv['allResv']
	const reservationsForRestaurant = reservations.getAllReservationsForRestaurant(restaurantName); // get the arary
	
	// Produce output below
	console.log("Reservations for " + restaurantName + ":");

	for (let i = 0; i < reservationsForRestaurant.length; i++) {
		const timeTemp = new Date(reservationsForRestaurant[i].time);
		const hour = timeTemp.getHours();
		console.log( "- " + datetime.format(timeTemp, "MMM DD YYYY, h:mm") + (hour > 12 ? " p.m." : " a.m.") + ", table for " + reservationsForRestaurant[i].people);
	}
}

if ('hourResv' in yargs_argv) {
	const time = yargs_argv['hourResv']
	const reservationsForRestaurant = reservations.getReservationsForHour(time); // get the arary
	
	// Produce output below
	console.log("Reservations in the next hour:");
	for (let i = 0; i < reservationsForRestaurant.length; i++) {
		const timeTemp = new Date(reservationsForRestaurant[i].time);
		const hour = timeTemp.getHours();
		console.log( "- " + reservationsForRestaurant[i].restaurant + ": " + datetime.format(timeTemp, 
					'MMM DD YYYY, h:mm') + (hour > 12 ? " p.m." : " a.m.") + ", table for " + reservationsForRestaurant[i].people);
	}
}

if ('checkOff' in yargs_argv) {
	const restaurantName = yargs_argv['checkOff']
	const earliestReservation = reservations.checkOffEarliestReservation(restaurantName); 
	
	// Produce output below
	const timeTemp = new Date(earliestReservation.time);
	const hour = timeTemp.getHours();
    console.log("Checked off reservation on " + datetime.format(timeTemp, 'MMM DD YYYY, h:mm') + 
					(hour > 12 ? " p.m." : " a.m.") + ", table for " + earliestReservation.people);
}

if ('addDelay' in yargs_argv) {
	const args = yargs_argv['addDelay']
	const resv = reservations.addDelayToReservations(args[0], args[1]);	

	// Produce output below
	console.log("Reservations for " + args[0] + ":");

	for (let i = 0; i < resv.length; i++) {
		const timeTemp = new Date(resv[i].time);
		const hour = timeTemp.getHours();

		console.log("- " + datetime.format(timeTemp, 'MMM DD YYYY, h:mm') + (hour > 12 ? " p.m." : " a.m.") + ", table for " + resv[i].people);

	}
}

if ('status' in yargs_argv) {
	const status = reservations.getSystemStatus()

	// Produce output below
	console.log("Number of restaurants: " + status.numRestaurants);
    console.log("Number of total reservations: " + status.totalReservations);
    console.log("Busiest restaurant: " + status.currentBusiestRestaurantName);
	
    const timeTemp = new Date(status.systemStartTime);
	const hour = timeTemp.getHours();
    console.log("System started at: " + datetime.format(timeTemp, 'MMM DD YYYY, h:mm') + (hour > 12 ? " p.m." : " a.m."));
}

