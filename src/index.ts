import "./lib/db";
import express from "express";
import countryRoutes from "./routes/country";
import morgan = require('morgan');
import dashboardRoutes from './routes/dashboard';
import apiRoutes from './routes/api';
const { auth } = require('express-oauth2-jwt-bearer');

const checkJwt = auth({
  audience: 'https://expressjs-mongoose-production-3422.up.railway.app/',
  issuerBaseURL: `https://dev-favico.eu.auth0.com/`,
});

var cors = require('cors')

const corsOptions = {
  exposedHeaders: ['X-Total-Count'],
};

const app = express();
const port = process.env.PORT || 3333;

app.use(cors(corsOptions))
app.use(express.json());
app.use(morgan('dev'));

app.use(express.raw({ type: "application/vnd.custom-type" }));
app.use(express.text({ type: "application/json" }));

app.get("/", checkJwt, async (req, res) => {
  res.json({ message: "Please visit /countries to view all the countries" });
});

app.get("/guest/", async (req, res) => {
  res.json({ message: "Please visit /countries to view all the countries" });
});

app.use('/dashboard', checkJwt, dashboardRoutes);
app.use('/api', apiRoutes);

app.use("/countries", countryRoutes);

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
