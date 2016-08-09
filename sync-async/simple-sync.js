function foo() {
    var returnValue = bar();
    console.log(returnValue);
}

function bar() {
    return "bar";
}

console.log('start sync.js');
foo();
console.log('end of sync.js');
