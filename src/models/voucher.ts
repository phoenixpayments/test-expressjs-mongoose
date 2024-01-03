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

export { VoucherModel, IVoucher };
