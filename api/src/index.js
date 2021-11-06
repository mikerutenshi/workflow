import express from 'express';
import bodyParser from 'body-parser';
// import https from 'https';
// import fs from 'fs';
// import path from 'path';
// import expressJwt from 'express-jwt';
// import multer from 'multer';
// import config from 'config';
import productRoutes from './routes/ProductRoutes';
import workerRoutes from './routes/WorkerRoutes';
import workRoutes from './routes/WorkRoutes';
import workRoutesV1 from './routes/WorkRoutesV1';
import workerWorkRoutes from './routes/WorkerWorkRoutes';
import workerReportRoutes from './routes/WorkerReportRoutes';
import userRoutes from './routes/UserRoutes';

import productCategoryRoutes from './routes/ProductCategoryRoutes';
import colorRoutes from './routes/ColorRoutes';
import colorProductRoutes from './routes/ColorProductRoutes';
import productColorRoutes from './routes/ProductColorRoutes';
import labourCostRoutes from './routes/LabourCostRoutes';
import customerRoutes from './routes/CustomerRoutes';
import sizeRoutes from './routes/SizeRoutes';
import purchaseOrderRoutes from './routes/PurchaseOrderRoutes';
import purchaseOrderProductRoutes from './routes/PurchaseOrderProductRoutes';
import workRoutesV2 from './routes/WorkRoutesV2';
import assignedWorkRoutes from './routes/AssignedWorkRoutes';
import workerWorkRoutesV2 from './routes/WorkerWorkRoutesV2';
import assignedWorkRoutesV1 from './routes/AssignedWorkRoutesV1';
import doneWorkRoutesV1 from './routes/DoneWorkRoutesV1';
import salaryReportRoutes from './routes/SalaryReportRoutes';

import ErrorHandler from './middleware/ErrorHandler';

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
// app.use(multer({
//   dest: '../temp'
// }));
// app.use(expressJwt({ secret: config.get('secret') }).unless({
//   path: [
//     { url: '/api/v1/users', methods: ['POST'] },
//     '/api/v1/users/authenticate'
//   ]
// }));

const port = process.env.PORT || 8000;

app.use('/v1/products', productRoutes);
app.use('/v1/workers', workerRoutes);
app.use('/v1/works', workRoutes);
app.use('/v1-1/works', workRoutesV1);
app.use('/v1/workerworks', workerWorkRoutes);
app.use('/v1/workerreport', workerReportRoutes);
app.use('/v1/users', userRoutes);
app.use('/v1/assigned-works', assignedWorkRoutesV1);
app.use('/v1/done-works', doneWorkRoutesV1);
app.use('/v1/salary-report', salaryReportRoutes);

app.use('/v2/product-categories', productCategoryRoutes);
app.use('/v2/colors', colorRoutes);
app.use('/v2/color-products', colorProductRoutes);
app.use('/v2/product-colors', productColorRoutes);
app.use('/v2/labour-costs', labourCostRoutes);
app.use('/v2/customers', customerRoutes);
app.use('/v2/sizes', sizeRoutes);
app.use('/v2/purchase-orders', purchaseOrderRoutes);
app.use('/v2/purchase-order-products', purchaseOrderProductRoutes);
app.use('/v2/works', workRoutesV2);
app.use('/v2/assigned-works', assignedWorkRoutes);
app.use('/v2/worker-works', workerWorkRoutesV2);

app.use(ErrorHandler);

app.get('/authenticate', (req, res) => {
  const cert = req.connection.getPeerCertificate();
  if (req.client.authorized) {
    res.send(
      `Hello ${cert.subject.CN}, your certificate was issued by ${cert.issuer.CN}!`,
    );
  } else if (cert.subject) {
    res
      .status(403)
      .send(
        `Sorry ${cert.subject.CN}, certificates from ${cert.issuer.CN} are not welcome here.`,
      );
  } else {
    res
      .status(401)
      .send('Sorry, but you need to provide a client certificate to continue.');
  }
});

app.get('*', (req, res) =>
  res.status(200).send({
    message: 'Welcome to this API.',
  }),
);

// const opts = {
//   key: fs.readFileSync(path.resolve(__dirname, './ssl/server_key.pem')),
//   cert: fs.readFileSync(path.resolve(__dirname, './ssl/server_cert.pem')),
//   request_cert: true,
//   rejectUnauthorized: false,
//   ca: [fs.readFileSync(path.resolve(__dirname, './ssl/server_cert.pem'))]
// };
// const server = https.createServer(opts, app).listen(port, () => {
//   console.log(`Server is running on PORT ${port}`);
// });
const workflow = app.listen(port, () => {
  console.log(`Server is running on PORT ${port}`);
});

const closeGracefully = async () => {
  await workflow.close();
  process.exit();
};
process.on('SIGINT', closeGracefully);
process.on('SIGTERM', closeGracefully);
process.on('SIGUSR2', closeGracefully);

export default app;
