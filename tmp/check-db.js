const mongoose = require("mongoose");

const MONGODB_URI = "mongodb+srv://Nitish:FOYLpnWb1PAJoXiW@cluster0.1wjfqo1.mongodb.net/resume_builder";

async function check() {
    try {
        console.log("Connecting...");
        await mongoose.connect(MONGODB_URI);
        console.log("Connected.");
        const collections = await mongoose.connection.db.listCollections().toArray();
        console.log("Collections Found:", collections.map(c => c.name));

        for (const col of collections) {
            const docs = await mongoose.connection.db.collection(col.name).find().toArray();
            console.log(`- ${col.name}: ${docs.length} documents`);
            docs.forEach(d => console.log(JSON.stringify(d, null, 2)));
        }

        await mongoose.disconnect();
        console.log("Disconnected.");
    } catch (e) {
        console.error("Error:", e);
    }
}

check();
