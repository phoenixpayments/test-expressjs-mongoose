import { Router } from 'express';
import raExpressMongoose from 'express-mongoose-ra-json-server';

import { CountryModel, ICountry } from "../models/country";
import { VoucherModel, IVoucher } from "../models/voucher";


const router = Router();

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

    const params = req.query
    console.log('with params: ', params);

    const auth = (req as any).auth;
    console.debug(`SUB: ${auth.payload.sub.replace("auth0|", "")}`);
    const sub = auth.payload.sub.replace("auth0|", "");

    const sort: string  = req.query._sort as string;
    const order: string  = req.query._order as string;
    const start: number = parseInt(req.query._start as string);
    const end: number = parseInt(req.query._end as string);

    let sortObj: any = {};
    sortObj[sort] = order;
    console.log('with sort and order: ', sort, order);
    const vouchers: IVoucher[] = await VoucherModel.find({merchant: sub}, {}).sort(sortObj).skip(start).limit(end - start).exec();
    // console.debug('vouchers: ', vouchers);
    
    const totalDocuments = await VoucherModel.countDocuments({merchant: sub});
    console.log('total documents: ', totalDocuments);
    res.set('X-Total-Count', `${totalDocuments}`);

    return res.json(vouchers);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Sorry, something went wrong :/" });
  }
});

export default router;