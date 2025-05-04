import bcrypt from 'bcrypt';


const hashed = await bcrypt.hash('admin', 10);
console.log('hashed pw:', hashed);
