import { connect, ConnectOptions } from 'mongoose';

let conn = null;

async function init(){
  try{
    if(!conn && process.env.MongoDbConnectionString){
      await connect(process.env.MongoDbConnectionString)
      console.log(`DB connection started`)
    } else if(!process.env.MongoDbConnectionString){
      console.log(`Connection string is`)
    } else {
      console.log(`DB connection reused`)
    }
  } catch(err){
    console.log(`DB error: ${err.message}`)
  }

}
  export default init;