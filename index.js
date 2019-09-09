class PromiseChain {
    constructor(promise_generators){
        this.promise_generators = (typeof promise_generators!=='undefined' && typeof promise_generators==='function' ? [promise_generators] : Array.isArray(promise_generators) ? promise_generators : [])
        .map(el=>typeof el==='function'? el : ()=>Promise.resolve(el));
    }
    run(){
        try {
            let args = Array.from(arguments);
            this.promise_generator_function = Array.isArray(this.promise_generators) && this.promise_generators.length ? this.promise_generators.shift() : ()=>Promise.resolve(args);
            let couldBeAPromise = this.promise_generator_function.apply(null, args);
            if (!(couldBeAPromise instanceof Promise)) {
                couldBeAPromise = Promise.resolve(couldBeAPromise);
            }
            return couldBeAPromise.then(res=>{
                return this.promise_generators.length ? this.run(res) : res;
            })
        } catch (err) {
            return Promise.reject(err);
        }
    }
}
function chain(promises){
    return new PromiseChain(promises).run();
}

try {
    global.Promise.prototype.chain = typeof global.Promise.prototype.chain!=='undefined' ? global.Promise.prototype.chain : chain;
    global.Promise.chain = typeof global.Promise.chain!=='undefined' ? global.Promise.chain : chain;
} catch(err){}

module.exports = {
    chain
}
