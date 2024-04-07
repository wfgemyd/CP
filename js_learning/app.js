
/* 
//demi username valid input

const submitButton = document.getElementById('submit');
submitButton.addEventListener('click', function () {

//gets input from user
const input = String(document.getElementById('gettingUsername').value);

input = input.toLowerCase();
getUserName(input);

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

