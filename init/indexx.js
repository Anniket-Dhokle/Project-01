const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listing.js");
const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";

main()
.then(() =>{
    console.log("connected to db");
})
.catch((err) =>{
    console.log(err);
});

async function main(params) {
    await mongoose.connect(MONGO_URL);
};

const intDB = async () =>{
    await Listing.deleteMany({});
    const dataWithOwner = initData.data.map((obj) =>({...obj, owner : '68e6555607051434e4e2f3c9'}));
    await Listing.insertMany(dataWithOwner);
    console.log("Inserted");

}

intDB();