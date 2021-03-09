import express from 'express';
import helmet from 'helmet';

import pcdigaRoute from './routes/pcdiga/pcdiga.js';
import globaldataRoute from './routes/globaldata/globaldata.js';
import chip7Route from './routes/chip7/chip7.js';
import mhrRoute from './routes/mhr/mhr.js';
import pccomponentesRoute from './routes/pccomponentes/pccomponentes.js';
import allRoute from './routes/all.js';

const port = process.env.PORT || 8080;
const app = express();
app.listen(port, () => console.log(`Server running on ${port}`));

app.use('/', (req, _res, next) => {
  console.log(new Date(), req.method, req.url);
  next();
});
app.use(helmet());

app.get('/', (_req, res) => {
  res.send('Welcome :D');
});

app.use('/pcdiga', pcdigaRoute);
app.use('/globaldata', globaldataRoute);
app.use('/chip7', chip7Route);
app.use('/mhr', mhrRoute);
app.use('/pccomponentes', pccomponentesRoute);
app.use('/all', allRoute);
