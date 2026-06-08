// import mongoose from "mongoose";
// import dotenv from "dotenv";
// dotenv.config();

// const MONGODB_URI = "mongodb+srv://Nitish:FOYLpnWb1PAJoXiW@cluster0.1wjfqo1.mongodb.net/resume_builder";

// async function check() {
//     try {
//         await mongoose.connect(MONGODB_URI);
//         const collections = await mongoose.connection.db.listCollections().toArray();
//         console.log("Collections:", collections.map(c => c.name));

//         for (const col of collections) {
//             const count = await mongoose.connection.db.collection(col.name).countDocuments();
//             console.log(`Collection ${col.name} has ${count} documents`);
//         }

//         process.exit(0);
//     } catch (e) {
//         console.error(e);
//         process.exit(1);
//     }
// }

// check();
