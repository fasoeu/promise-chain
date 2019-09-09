# Promise Chain

This module extends Promise object adding `chain` method.
Chain method accepts an array of objects. Optimally, every item should be a function which returns a Promise.
It you provide items as Promise objects instead, they will be immediatly executed with unpredictable results.
Every function can use the results of the promise returned by the previous function.

```js
require('promise-waterfall-chain');

Promise.chain([
    ()=>Promise.resolve(7),
    (prev_result)=>Promise.resolve(++prev_result)
])
.then(console.log)
.catch(console.log)  // Output: 8
```

## Install
`npm install promise-waterfall-chain`

## How to use (see `examples`)
```js
require('promise-waterfall-chain');

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
promises.push(Promise.resolve(3)); // this is immediately executed, but the results will be used sequentially
promises.push(res=>new Promise((resolve, reject)=>{
    console.log('This promise receives the previous promise result and will then throw an error', res);
    reject(res);
}));
promises.push((prev_res)=>new Promise((resolve, reject)=>{
    console.log('Another promise starts', prev_res);
    setTimeout(()=>{
        console.log('Another promise rejected');
        reject('Random error');
    }, 1000);
}));
promises.push(()=>3);
promises.push((prev_res)=>new Promise((resolve, reject)=>{
    console.log('A new promise starts', prev_res);
    setTimeout(()=>{
        console.log('A new promise ended');
        resolve('A new result');
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
```