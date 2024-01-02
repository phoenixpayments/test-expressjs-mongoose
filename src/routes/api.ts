import { Router } from 'express';
import raExpressMongoose from 'express-mongoose-ra-json-server';

import { CountryModel, ICountry } from "../models/country";

const router = Router();
router.use(
  '/country',
  raExpressMongoose(CountryModel, {
    q: ['name', "iso2code"],
    allowedRegexFields: ['name'],
    useLean: false,
  })
);
router.use('/post', raExpressMongoose(CountryModel, { q: ['name'] }));

export default router;