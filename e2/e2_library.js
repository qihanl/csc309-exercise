/* 
 * This code is provided solely for the personal and private use of students 
 * taking the CSC309H course at the University of Toronto. Copying for purposes 
 * other than this use is expressly prohibited. All forms of distribution of 
 * this code, including but not limited to public repositories on GitHub, 
 * GitLab, Bitbucket, or any other online platform, whether as given or with 
 * any changes, are expressly prohibited. 
*/ 

/* E2 Library - JS */

/*-----------------------------------------------------------*/
/* Starter code - DO NOT edit the code below. */
/*-----------------------------------------------------------*/

// global counts
let numberOfBooks = 0; // total number of books
let numberOfPatrons = 0; // total number of patrons

// global arrays
const libraryBooks = [] // Array of books owned by the library (whether they are loaned or not)
const patrons = [] // Array of library patrons.

// Book 'class'
class Book {
	constructor(title, author, genre) {
		this.title = title;
		this.author = author;
		this.genre = genre;
		this.patron = null; // will be the patron objet

		// set book ID
		this.bookId = numberOfBooks;
		numberOfBooks++;
	}

	setLoanTime() {
		// Create a setTimeout that waits 3 seconds before indicating a book is overdue

		const self = this; // keep book in scope of anon function (why? the call-site for 'this' in the anon function is the DOM window)
		setTimeout(function() {
			
			console.log('overdue book!', self.title)
			changeToOverdue(self);

		}, 3000)

	}
}

// Patron constructor
const Patron = function(name) {
	this.name = name;
	this.cardNumber = numberOfPatrons;

	numberOfPatrons++;
}


// Adding these books does not change the DOM - we are simply setting up the 
// book and patron arrays as they appear initially in the DOM.
libraryBooks.push(new Book('Harry Potter', 'J.K. Rowling', 'Fantasy'));
libraryBooks.push(new Book('1984', 'G. Orwell', 'Dystopian Fiction'));
libraryBooks.push(new Book('A Brief History of Time', 'S. Hawking', 'Cosmology'));

patrons.push(new Patron('Jim John'))
patrons.push(new Patron('Kelly Jones'))

// Patron 0 loans book 0
libraryBooks[0].patron = patrons[0]
// Set the overdue timeout
libraryBooks[0].setLoanTime()  // check console to see a log after 3 seconds


/* Select all DOM form elements you'll need. */ 
const bookAddForm = document.querySelector('#bookAddForm');
const bookInfoForm = document.querySelector('#bookInfoForm');
const bookLoanForm = document.querySelector('#bookLoanForm');
const patronAddForm = document.querySelector('#patronAddForm');

/* bookTable element */
const bookTable = document.querySelector('#bookTable')
/* bookInfo element */
const bookInfo = document.querySelector('#bookInfo')
/* Full patrons entries element */
const patronEntries = document.querySelector('#patrons')

/* Event listeners for button submit and button click */

bookAddForm.addEventListener('submit', addNewBookToBookList);
bookLoanForm.addEventListener('submit', loanBookToPatron);
patronAddForm.addEventListener('submit', addNewPatron)
bookInfoForm.addEventListener('submit', getBookInfo);

/* Listen for click patron entries - will have to check if it is a return button in returnBookToLibrary */
patronEntries.addEventListener('click', returnBookToLibrary)

/*-----------------------------------------------------------*/
/* End of starter code - do *not* edit the code above. */
/*-----------------------------------------------------------*/


/** ADD your code to the functions below. DO NOT change the function signatures. **/


/*** Functions that don't edit DOM themselves, but can call DOM functions 
     Use the book and patron arrays appropriately in these functions.
 ***/

// Adds a new book to the global book list and calls addBookToLibraryTable()
function addNewBookToBookList(e) {
	e.preventDefault();

	// Add book book to global array
	const bookName = document.querySelector('#newBookName').value;
	const author = document.querySelector('#newBookAuthor').value;
	const genre = document.querySelector('#newBookGenre').value;
	const newBook = new Book(bookName, author, genre);

	libraryBooks.push(newBook);

	// Call addBookToLibraryTable properly to add book to the DOM
	addBookToLibraryTable(newBook);
}

// Changes book patron information, and calls 
function loanBookToPatron(e) {
	e.preventDefault();

	// Get correct book and patron
	const loanBookId = parseInt(document.querySelector('#loanBookId').value);
	const loanCardNum = parseInt(document.querySelector('#loanCardNum').value);

	// Add patron to the book's patron property
	const loanBook = libraryBooks[loanBookId];
	loanBook.patron = patrons[loanCardNum];

	// Add book to the patron's book table in the DOM by calling addBookToPatronLoans()
	addBookToPatronLoans(loanBook);
	

	// Start the book loan timer.
	loanBook.setLoanTime()

}

// Changes book patron information and calls returnBookToLibraryTable()
function returnBookToLibrary(e){
	e.preventDefault();

	// check if return button was clicked, otherwise do nothing.
	if (e.target.classList.contains('return')) {
		// Find the book to return by getting its ID
		const bookToReturnID = parseInt(e.target.parentElement.parentElement.firstElementChild.innerText);
		const bookToReturn = libraryBooks[bookToReturnID];

		// Call removeBookFromPatronTable()
		removeBookFromPatronTable(bookToReturn);

		// Change the book object to have a patron of 'null'
		bookToReturn.patron = null;

	}

}

// Creates and adds a new patron
function addNewPatron(e) {
	e.preventDefault();

	// Add a new patron to global array
	const patronName = document.querySelector('#newPatronName').value;
	const newPatron = new Patron(patronName);
	patrons.push(newPatron);


	// Call addNewPatronEntry() to add patron to the DOM
	addNewPatronEntry(newPatron)

}

// Gets book info and then displays
function getBookInfo(e) {
	e.preventDefault();

	// Get correct book
	const infoBookID = parseInt(document.querySelector('#bookInfoId').value);
	const infoBook = libraryBooks[infoBookID];

	// Call displayBookInfo()
	displayBookInfo(infoBook);

}


/*-----------------------------------------------------------*/
/*** DOM functions below - use these to create and edit DOM objects ***/

// Adds a book to the library table.
function addBookToLibraryTable(book) {
	// Add code here

	// Add BookID
	const bookIDTd = document.createElement('td');
	bookIDTd.appendChild(document.createTextNode(book.bookId));

	// Add Title
	const bookTitleTd = document.createElement('td');
	const strong = document.createElement('strong');
	strong.appendChild(document.createTextNode(book.title));
	bookTitleTd.appendChild(strong);

	// Create Patron card number
	const bookPatron = document.createElement('td');

	// Check if the book is loaned out ()
	if (book.patron != null) {
		bookPatron.appendChild(document.createTextNode(book.patron));
	}
	
	// Create new row
	const bookRow = document.createElement('tr');
	bookRow.appendChild(bookIDTd);
	bookRow.appendChild(bookTitleTd);
	bookRow.appendChild(bookPatron);

	// Append the new row to the book table
	bookTable.firstElementChild.appendChild(bookRow);

}


// Displays deatiled info on the book in the Book Info Section
function displayBookInfo(book) {
	// Add code here

	// Update book id
	bookInfo.children[0].children[0].innerText = book.bookId;

	// Update title
	bookInfo.children[1].children[0].innerText = book.title;

	// Update author
	bookInfo.children[2].children[0].innerText = book.author;

	// Update Genre
	bookInfo.children[3].children[0].innerText = book.genre;

	// Update patron
	if (book.patron == null) {
		bookInfo.children[4].children[0].innerText = 'N/A';
	} else {
		bookInfo.children[4].children[0].innerText = book.patron.name;
	}
	

}

// Adds a book to a patron's book list with a status of 'Within due date'. 
// (don't forget to add a 'return' button).
function addBookToPatronLoans(book) {
	// Add code here

	// Update book table to have the card number of patron displayed
	bookTable.children[0].children[book.bookId+1].children[2].innerText = book.patron.cardNumber;

	// Find the Patron to add row into table
	let loanPatron = patronEntries.firstElementChild;

	for (let i = 0; i < book.patron.cardNumber; i++) {
		loanPatron = loanPatron.nextElementSibling;
	}

	// Add BookID
	const loanBookId = document.createElement('td');
	loanBookId.appendChild(document.createTextNode(book.bookId));

	// Add Title
	const bookTitle = document.createElement('td');
	const strong = document.createElement('strong');
	strong.appendChild(document.createTextNode(book.title));
	bookTitle.appendChild(strong);

	// Add Status
	const status = document.createElement('td');
	const span = document.createElement('span');
	span.className = 'green';
	span.appendChild(document.createTextNode('Within due date'));
	status.appendChild(span);

	// Add return button
	const returnButTd = document.createElement('td')
	const returnBut = document.createElement('button');
	returnBut.className = 'return';
	returnBut.appendChild(document.createTextNode('return'));
	returnButTd.appendChild(returnBut);


	// Create new row
	const loanRow = document.createElement('tr');
	loanRow.appendChild(loanBookId);
	loanRow.appendChild(bookTitle);
	loanRow.appendChild(status);
	loanRow.appendChild(returnButTd);

	// Append the new row into the Patron book table
	loanPatron.lastElementChild.firstElementChild.appendChild(loanRow);

}

// Adds a new patron with no books in their table to the DOM, including name, card number,
// and blank book list (with only the <th> headers: BookID, Title, Status, and Return).
function addNewPatronEntry(patron) {
	// Add code here

	// Create the patron div
	const patronDiv = document.createElement('div');
	patronDiv.className = 'patron';

	// Create the name p
	const patronName = document.createElement('p');
	patronName.appendChild(document.createTextNode("Name: "));
	const nameSpan = document.createElement('span');
	nameSpan.className = 'bold';
	nameSpan.appendChild(document.createTextNode(patron.name));
	patronName.appendChild(nameSpan);

	// Create the card number p
	const cardNumber = document.createElement('p');
	cardNumber.appendChild(document.createTextNode("Card Number: "));
	const numberSpan = document.createElement('span');
	numberSpan.className = 'bold';
	numberSpan.appendChild(document.createTextNode(patron.cardNumber));
	cardNumber.appendChild(numberSpan);

	// Create the title for the book table
	const tableTitle = document.createElement('h4');
	tableTitle.appendChild(document.createTextNode("Books on loan:"));

	// Create the table
	const table = document.createElement('table');
	table.className = 'patronLoansTable';
	const tableTbody = document.createElement('tbody');
	const tableRowTitle = document.createElement('tr');
	const bookIDTh = document.createElement('th');
	const titleTh = document.createElement('th');
	const statusTh = document.createElement('th');
	const ReturnTh = document.createElement('th');
	bookIDTh.appendChild(document.createTextNode(' BookID '));
	titleTh.appendChild(document.createTextNode(' Title '));
	statusTh.appendChild(document.createTextNode(' Status '));
	ReturnTh.appendChild(document.createTextNode(' Return '));
	tableRowTitle.appendChild(bookIDTh);
	tableRowTitle.appendChild(titleTh);
	tableRowTitle.appendChild(statusTh);
	tableRowTitle.appendChild(ReturnTh);
	tableTbody.appendChild(tableRowTitle);
	table.appendChild(tableTbody);

	// Combine all elements together
	patronDiv.appendChild(patronName);
	patronDiv.appendChild(cardNumber);
	patronDiv.appendChild(tableTitle);
	patronDiv.appendChild(table);

	patronEntries.appendChild(patronDiv);

}


// Removes book from patron's book table and remove patron card number from library book table
function removeBookFromPatronTable(book) {
	// Add code here

	// Update the book table to remove the patron's card number
	bookTable.children[0].children[book.bookId+1].children[2].innerText = '';

	// Find the Patron to delete row
	let loanPatron = patronEntries.firstElementChild;

	for (let i = 0; i < book.patron.cardNumber; i++) {
		loanPatron = loanPatron.nextElementSibling;
	}
	const patronBookTable = loanPatron.lastElementChild.firstElementChild;

	// Find the row to delete
	let currentRow = patronBookTable.firstElementChild;

	while(parseInt(currentRow.firstElementChild.innerText) != book.bookId) {
		currentRow = currentRow.nextElementSibling;
	}

	// Delete the row
	patronBookTable.removeChild(currentRow);

}

// Set status to red 'Overdue' in the book's patron's book table.
function changeToOverdue(book) {
	// Add code here

	if (book.patron != null) {
		// Find the patron
		let loanPatron = patronEntries.firstElementChild;

		for (let i = 0; i < book.patron.cardNumber; i++) {
			loanPatron = loanPatron.nextElementSibling;
		}
		const patronBookTable = loanPatron.lastElementChild.firstElementChild;

		// Find the row
		let currentRow = patronBookTable.firstElementChild;

		while(parseInt(currentRow.firstElementChild.innerText) != book.bookId) {
			currentRow = currentRow.nextElementSibling;
		}

		// Status to Change
		const statusToChange = currentRow.children[2].children[0];
		statusToChange.className = 'red';
		statusToChange.innerText = 'Overdue';
	}
}

