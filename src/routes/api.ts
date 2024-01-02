import { Router } from 'express';
import raExpressMongoose from 'express-mongoose-ra-json-server';

import { CountryModel, ICountry } from "../models/country";
import { VoucherModel, IVoucher } from "../models/voucher";


const router = Router();
router.use(
  '/country',
  raExpressMongoose(CountryModel, {
    q: ['name', "iso2code"],
    allowedRegexFields: ['name'],
    useLean: false,
  })
);
// router.use(
//   '/voucher',
//   raExpressMongoose(VoucherModel, {
//     q: ['id', "merchant_eq=AA", "amount", "state", "date"],
//     allowedRegexFields: ['merchant'],
//     useLean: false,
//   })
// );

router.get("/voucher", async (req, res) => {
  try {

    const auth = (req as any).auth;
    console.debug(`SUB: ${auth.payload.sub.replace("auth0|", "")}`);
    const sub = auth.payload.sub.replace("auth0|", "");

    const vouchers: IVoucher[] = await VoucherModel.find({merchant: sub}).exec();
    console.debug('vouchers: ', vouchers);
    
    res.set('X-Total-Count', `${vouchers.length}`);

    return res.json(vouchers);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Sorry, something went wrong :/" });
  }
});

export default router;