
/* 
//Code example of an verefication of an username or email address login data that was entered by the user


//put it in a while loop to keep asking for input until it is valid
const submitButton = document.getElementById('submit'); //creating a variable for the submit button
submitButton.addEventListener('click', function () { //adding an event listener to the submit button and when clicked, it will run the function

//gets input from user
const input = String(document.getElementById('gettingUsername').value); //creating a variable for the input and getting the value from the input field

input = input.toLowerCase(); //converts the input to lowercase
getUserName(input); //is it a valid input?

});


function getUserName(input) {
    if (input == null|| input.includes(' ') || input.length < 2) { //checks if input is empty or contains spaces

        console.log('Invalid input');
        return false;

    };
    if(input.includes("@") && input.slice(input.indexOf('@')+1) == "nxp.de"){ //checks if input contains @ and ends with nxp.de

        let username = input.slice(0, input.indexOf('@'));

        console.log('Valid input');
        return username;

    }else{
        console.log('Valid input');
        return input;
    }
};
*/

/*
const submitButton = document.getElementById('submit'); //creating a variable for the submit button
submitButton.addEventListener('click', function () { //adding an event listener to the submit button and when clicked, it will run the function

//gets input from user
let input = String(document.getElementById('gettingUsername').value); //creating a variable for the input and getting the value from the input field

input = input.toLowerCase(); //converts the input to lowercase
if ( getUserName(input)[1]) {
    console.log('Valid input');
    //popup message
    alert('Valid input');
    console.log(getUserName(input)[0]);

}else{
    console.log('Invalid input try again');
    //popup message

    console.log( getUserName(input)[0]);
    alert('Invalid input try again ' +  getUserName(input)[0] + ' is bad input');
    //clear input field
    document.getElementById('gettingUsername').value = '';
}; //is it a valid input?

});


function getUserName(input) {
    if (input == null|| input.includes(' ') || input.length < 2) { //checks if input is empty or contains spaces
        return [input, false];

    };
    if(input.includes("@") && input.slice(input.indexOf('@')+1) == "nxp.de"){ //checks if input contains @ and ends with nxp.de
        let username = input.slice(0, input.indexOf('@'));
        return [username, true];

    }else{
        return [input, true];
    }
};*/


//spread operator
let a = [a, b, c, d, e, f, g, h, i, j, k, l, m, n, o, p, q, r, s, t, u, v, w, x, y, z];
let b = [a, b, c, d, e, f, g, h, i, j, k, l, m, n, o, p, q, r, s, t, u, v, w, x, y, z];

let c = [...a, ...b]; //merges the two arrays into one array 

console.log(c); //prints the merged array

//rest parameter
function sum(...args) { //rest parameter
    let sum = 0;
    for (let arg of args) sum += arg; //adds the numbers together in a short way
    return sum;
}

console.log(sum(1, 2, 3, 4, 5)); //prints the sum of the numbers