import bcrypt from 'bcrypt';


const hashed = await bcrypt.hash('adminadmin', 10);
console.log('hashed pw:', hashed);
