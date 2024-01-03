const fs = require("fs");
const { parse } = require("csv-parse");

import mongoose from "mongoose";

if (!process.env.MONGO_URL) {
  throw new Error("Please add the MONGO_URL environment variable");
}

mongoose.connect(process.env.MONGO_URL);

const database = mongoose.connection;

database.on(
  "error",
  console.error.bind(console, "❌ mongodb connection error")
);
database.once("open", () => console.log("✅ mongodb connected successfully"));

mongoose.Promise = Promise;

import { model, Schema, Document } from "mongoose";

interface IVoucher extends Document {
  id: string;
  merchant: string;
  amount: number;
  state: string;
  date: string;
  transaction: string;
  cardnumber: string;
  updatedate: string;
}

const VoucherSchema = new Schema({
  id: {
    type: String,
    unique: true,
  },
  merchant: {
    type: String,
  },
  amount: {
    type: Number,
  },
  state: {
    type: String,
  },
  date: {
    type: String,
  },
  transaction: {
    type: String,
  },
  cardnumber: {
    type: String,
  },
  updatedate: {
    type: String
  }
});

const VoucherModel = model<IVoucher>("Voucher", VoucherSchema);
const merchant = "65953f0ca6b540200b33440d";

let count = 0;
(async () =>
  fs.createReadStream("./TransactionsList_CIDRUS_ALL.csv")
    .pipe(parse({ delimiter: ",", from_line: 2, relax_quotes: true }))
    .on("data", async (row: any) => {

      if (count == 0) {
        console.log(row);

        const voucher: IVoucher = await VoucherModel.create({ merchant: merchant, id: crypto.randomUUID().substring(0, 8), date: new Date(row[1]).toISOString(), amount: parseFloat(row[6]), state: row[8], transaction: row[0], cardnumber: row[3] });

        count++;
      }
      console.log('done ' + count);
    })
)()
console.log('import script');