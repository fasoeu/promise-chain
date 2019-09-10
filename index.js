class PromiseChain {
    constructor(){
        let promises = [];
        let args = Array.from(arguments);
        while (args.length) {
            let arg = args.shift();
            promises = promises.concat(Array.isArray(arg) ? arg : [ arg ]);
        }

        this.promise_generators = promises.map(el=>typeof el==='function'? el : ()=>Promise.resolve(el));
        
        return this.run();
    }
    run(){
        try {
            let args = arguments.length ? Array.from(arguments) : void(0);
            if (!this.promise_generators.length) {
                return Promise.resolve.apply(Promise, args);
            }

            let promise_generator_function = this.promise_generators.shift();            
            let couldBeAPromise = promise_generator_function.apply(null, args);
            if (!(couldBeAPromise instanceof Promise)) {
                couldBeAPromise = Promise.resolve(couldBeAPromise);
            }
            return couldBeAPromise.then(res=>{
                return this.run(res);
            });
        } catch (err) {
            return Promise.reject(err);
        }
    }
}

try {
    global.Promise.prototype.chain = typeof global.Promise.prototype.chain!=='undefined' ? global.Promise.prototype.chain : function(){return new PromiseChain(...Array.from(arguments));};
    global.Promise.chain = typeof global.Promise.chain!=='undefined' ? global.Promise.chain : global.Promise.prototype.chain;
} catch(err){}

module.exports = PromiseChain;
