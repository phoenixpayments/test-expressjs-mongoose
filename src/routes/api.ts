import { Router } from 'express';
import { VoucherModel, IVoucher } from "../models/voucher";
import { v4 as uuidv4 } from 'uuid';

const router = Router();


router.post("/create", async (req, res) => {
  try {

    const merchant = req.headers["x-api-key"]

    if (merchant == undefined || merchant == "") {
      return res.status(500).json({ error: "Missing authorization" });
    }

    console.log(`with merchant: ${merchant}`);
    console.log(`with data:`, req.body);

    if (req.body.amount == undefined || req.body.amount == 0) {
      return res.status(500).json({ error: "Invalid amount" });

    }

    const voucher: IVoucher = await VoucherModel.create({ merchant: merchant, id: uuidv4().substring(0, 8), date: new Date().toISOString(), amount: req.body.amount, state: "Created" });

    console.log(`with voucher: ${voucher}`);

    return res.json({ state: voucher.state, id: voucher.id, date: voucher.date, amount: voucher.amount });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Sorry, something went wrong :/" });
  }
});

router.post("/update", async (req, res) => {
  try {

    const merchant = req.headers["x-api-key"]

    if (merchant == undefined || merchant == "") {
      return res.status(500).json({ error: "Missing authorization" });
    }

    console.log(`with merchant: ${merchant}`);
    console.log(`with data:`, req.body);

    if (req.body.id == undefined || req.body.id == "") {
      return res.status(500).json({ error: "Missing voucher ID" });

    }

    const voucher: IVoucher | null = await VoucherModel.findOne({ id: req.body.id })

    if (voucher) {

      if (req.body.state == undefined || req.body.state == "") {
        return res.status(500).json({ error: "Missing new state" });
      }

      if (req.body.transaction == undefined || req.body.transaction == "") {
        return res.status(500).json({ error: "Missing transaction ID" });
      }

      if (req.body.cardnumber == undefined || req.body.cardnumber == "") {
        return res.status(500).json({ error: "Missing card number" });
      }

      const status: IVoucher = await voucher.updateOne({ state: req.body.state, transaction: req.body.transaction, cardnumber: req.body.cardnumber, updateDate: new Date().toISOString() })

      const updateVoucher: IVoucher | null = await VoucherModel.findOne({ id: req.body.id })

      return res.json(updateVoucher);


    } else {
      return res.status(500).json({ error: "Invalid voucher ID" });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Sorry, something went wrong :/" });
  }
});

router.get("/check", async (req, res) => {
  try {

    const voucherId: string = req.query.voucherId as string;
    const transactionId: string = req.query.transactionId as string;

    console.log('with voucher: ', voucherId, " and transaction: ", transactionId);

    const voucher: IVoucher | null = await VoucherModel.findOne({ id: voucherId, transaction: transactionId })

    console.log('with voucher: ', voucher);
    return res.json(voucher);


  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Sorry, something went wrong :/" });
  }
});

export default router;