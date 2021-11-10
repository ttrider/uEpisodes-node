import * as fs from "fs";
import * as util from "util";
const readFile = util.promisify(fs.readFile);




function readonly(target: any, name: any, descriptor: any) {
    console.info(target);
    console.info(name);
    console.info(descriptor);


    return descriptor.value;
}

class Example {
    a() {
        console.info("a");
    };
    @readonly
    b() {
        console.info("b");
    }
}


const e = new Example();

e.a();
e.b();

console.info(process.argv);

readFile("./somefile.txt").then((buffer) => console.info(buffer.toString()));

