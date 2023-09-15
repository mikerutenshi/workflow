import express from 'express';
import bodyParser from 'body-parser';
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

const port = process.env.PORT || 8000;

app.use('/api/v1/products', productRoutes);
app.use('/api/v1/workers', workerRoutes);
app.use('/api/v1/works', workRoutes);
app.use('/api/v1-1/works', workRoutesV1);
app.use('/api/v1/workerworks', workerWorkRoutes);
app.use('/api/v1/workerreport', workerReportRoutes);
app.use('/api/v1/users', userRoutes);
app.use('/api/v1/assigned-works', assignedWorkRoutesV1);
app.use('/api/v1/done-works', doneWorkRoutesV1);
app.use('/api/v1/salary-report', salaryReportRoutes);

app.use('/api/v2/product-categories', productCategoryRoutes);
app.use('/api/v2/colors', colorRoutes);
app.use('/api/v2/color-products', colorProductRoutes);
app.use('/api/v2/product-colors', productColorRoutes);
app.use('/api/v2/labour-costs', labourCostRoutes);
app.use('/api/v2/customers', customerRoutes);
app.use('/api/v2/sizes', sizeRoutes);
app.use('/api/v2/purchase-orders', purchaseOrderRoutes);
app.use('/api/v2/purchase-order-products', purchaseOrderProductRoutes);
app.use('/api/v2/works', workRoutesV2);
app.use('/api/v2/assigned-works', assignedWorkRoutes);
app.use('/api/v2/worker-works', workerWorkRoutesV2);

app.use(ErrorHandler);

app.get('*', (req, res) =>
  res.status(200).send({
    message: 'Welcome to this API.',
  }),
);

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