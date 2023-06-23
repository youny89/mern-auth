import crypto from "crypto"

const random = crypto.randomBytes(40).toString('hex')
const random1 = crypto.randomBytes(40).toString('hex')
const random2 = crypto.randomBytes(40).toString('hex')

console.log(random);
console.log(random1);
console.log(random2);