const add = require('./add');
const divide = require('./divide');
const substract = require('./substract');
const multiply = require('./multiply');

function calcIt() {
    const firstNum = parseInt(process.argv[2], 10);

    if (Number.isNaN(firstNum) || isNaN(firstNum)) {
        console.error("Invalid first argument");
        return null;
    }

    const secondNum = parseInt(process.argv[3], 10);

    if (Number.isNaN(secondNum) || isNaN(secondNum)) {
        console.error("Invalid second argument");
        return null;
    }

    const operation = process.argv[4];

    switch (operation) {
        case 'subtract':
            console.log(substract(firstNum, secondNum));
            break;
        case 'divide':
            console.log(divide(firstNum, secondNum));
            break;
        case 'multiply':
            console.log(multiply(firstNum, secondNum));
            break;
        case 'add':
            console.log(add(firstNum, secondNum));
            break;
        default:
            console.error("Invalid operation");
    }
}

calcIt();
