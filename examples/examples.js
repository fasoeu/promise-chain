require(__dirname+'/../../promise-chain');
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

Promise.chain([
    ()=>Promise.resolve(7),
    (prev_result)=>Promise.resolve(++prev_result)
])
.then(console.log)
.catch(console.log)  // Output: 8