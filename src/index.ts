import "./lib/db";
import express from "express";
import countryRoutes from "./routes/country";
import morgan = require('morgan');
import apiRoutes from './routes/api';

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
app.use(express.text({ type: "text/html" }));

app.get("/", async (req, res) => {
  res.json({ message: "Please visit /countries to view all the countries" });
});

app.use('/api', apiRoutes);

app.use("/countries", countryRoutes);

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
