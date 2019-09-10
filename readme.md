# Promise Waterfall Chain

This module extends Promise object adding `chain` method to `Promise.prototype` (use it carefully).\
`Promise.chain` method accepts a list of arguments and/or mixed array(s).\
For a better flow control, every item should be a function which returns a Promise.\
The resolved value of these generated promises will be passed as argument to the next functions.

If other input items types are provided:
* `Primitive values` will be converted into functions returning promises resolved with the value itself.
* Functions returned results (Ex.: `res`) that are not promises will be converted into resolved values of a Promise: Ex.: `res=>Promise.resolve(res)`
* `Promise` arguments will generate unpredictable behavior.

## Example
```js
require('promise-waterfall-chain');

let pc = Promise.chain(
    'Hello World!',
    (str)=>{
        console.log(str);
        return Promise.resolve(7);
    },
    (prev_result)=>Promise.resolve(++prev_result)
)
.then(console.log)
.catch(console.log);

pc.then(()=>{
    console.log('All done!');
});
/* Output:
Hello World!
8
All done!
*/
```

## Install
`npm install promise-waterfall-chain`

## How to use (see `examples`)
```js
require('promise-waterfall-chain');

// Example 1: mixed array (functions, promises and other values)
let promises = [];
promises.push(()=>new Promise((resolve, reject)=>{
    console.log('First promise starts');
    setTimeout(()=>{
        console.log('First promise ended');
        resolve(['First result', 'this is an array']);
    }, 1000);
}));
promises.push(null);
promises.push(2);
promises.push(Promise.resolve(3));
promises.push(res=>new Promise((resolve, reject)=>{
    console.log('This promise receives the previous promise result and will then throw an error', res);
    reject(res);
}));
promises.push((prev_res)=>new Promise((resolve, reject)=>{
    console.log('Another promise starts', prev_res);
    setTimeout(()=>{
        console.log('This promise is going to be rejected');
        reject('Random error');
    }, 1000);
}));
promises.push(()=>3);
promises.push((prev_res)=>new Promise((resolve, reject)=>{
    console.log('A new promise starts', prev_res);
    setTimeout(()=>{
        console.log('The new promise ended');
        resolve('The new result');
    }, 1000);
}));
promises.push(()=>{throw 'Suddenly an error';});

Promise.chain(promises)
.then(()=>{
    return console.log('This message will be shown if/when all the promises will be fulfilled!');
})
.catch(err=>{
    console.log('This message will be shown in case of errors', err);
})
.catch(err=>{
    console.log('This message will never be shown', err);
})
.then(()=>{
    return console.log('This message will be shown in any case!');
});

// Example 2: use results of previous promise
Promise.chain([
    ()=>Promise.resolve(7),
    (prev_result)=>Promise.resolve(++prev_result)
])
.then(console.log) // Output: 8
.catch(console.log)

// Example 3: list of items
Promise.chain(1,()=>Promise.resolve(2),3)
.then(res=>{
    console.log('Here we go with the final result: ', res); // Output: 3
})

// Example 4: throw a catchable error
let pc = Promise.chain(
    [1,2],
    (s)=>Promise.reject(s),
    (r)=>Promise.resolve(r+1)
);
pc.then(console.log) // Output: 3 but it would never fire
.catch(console.log) // Output: 2
.then(()=>{
    console.log('This like a "finally" of a try/catch/finally construct');
});
```