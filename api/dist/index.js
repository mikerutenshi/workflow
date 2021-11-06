"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _express = _interopRequireDefault(require("express"));

var _bodyParser = _interopRequireDefault(require("body-parser"));

var _ProductRoutes = _interopRequireDefault(require("./routes/ProductRoutes"));

var _WorkerRoutes = _interopRequireDefault(require("./routes/WorkerRoutes"));

var _WorkRoutes = _interopRequireDefault(require("./routes/WorkRoutes"));

var _WorkRoutesV = _interopRequireDefault(require("./routes/WorkRoutesV1"));

var _WorkerWorkRoutes = _interopRequireDefault(require("./routes/WorkerWorkRoutes"));

var _WorkerReportRoutes = _interopRequireDefault(require("./routes/WorkerReportRoutes"));

var _UserRoutes = _interopRequireDefault(require("./routes/UserRoutes"));

var _ProductCategoryRoutes = _interopRequireDefault(require("./routes/ProductCategoryRoutes"));

var _ColorRoutes = _interopRequireDefault(require("./routes/ColorRoutes"));

var _ColorProductRoutes = _interopRequireDefault(require("./routes/ColorProductRoutes"));

var _ProductColorRoutes = _interopRequireDefault(require("./routes/ProductColorRoutes"));

var _LabourCostRoutes = _interopRequireDefault(require("./routes/LabourCostRoutes"));

var _CustomerRoutes = _interopRequireDefault(require("./routes/CustomerRoutes"));

var _SizeRoutes = _interopRequireDefault(require("./routes/SizeRoutes"));

var _PurchaseOrderRoutes = _interopRequireDefault(require("./routes/PurchaseOrderRoutes"));

var _PurchaseOrderProductRoutes = _interopRequireDefault(require("./routes/PurchaseOrderProductRoutes"));

var _WorkRoutesV2 = _interopRequireDefault(require("./routes/WorkRoutesV2"));

var _AssignedWorkRoutes = _interopRequireDefault(require("./routes/AssignedWorkRoutes"));

var _WorkerWorkRoutesV = _interopRequireDefault(require("./routes/WorkerWorkRoutesV2"));

var _AssignedWorkRoutesV = _interopRequireDefault(require("./routes/AssignedWorkRoutesV1"));

var _DoneWorkRoutesV = _interopRequireDefault(require("./routes/DoneWorkRoutesV1"));

var _SalaryReportRoutes = _interopRequireDefault(require("./routes/SalaryReportRoutes"));

var _ErrorHandler = _interopRequireDefault(require("./middleware/ErrorHandler"));

// import https from 'https';
// import fs from 'fs';
// import path from 'path';
// import expressJwt from 'express-jwt';
// import multer from 'multer';
// import config from 'config';
var app = (0, _express["default"])();
app.use(_bodyParser["default"].json());
app.use(_bodyParser["default"].urlencoded({
  extended: false
})); // app.use(multer({
//   dest: '../temp'
// }));
// app.use(expressJwt({ secret: config.get('secret') }).unless({
//   path: [
//     { url: '/api/v1/users', methods: ['POST'] },
//     '/api/v1/users/authenticate'
//   ]
// }));

var port = process.env.PORT || 8000;
app.use('/v1/products', _ProductRoutes["default"]);
app.use('/v1/workers', _WorkerRoutes["default"]);
app.use('/v1/works', _WorkRoutes["default"]);
app.use('/v1-1/works', _WorkRoutesV["default"]);
app.use('/v1/workerworks', _WorkerWorkRoutes["default"]);
app.use('/v1/workerreport', _WorkerReportRoutes["default"]);
app.use('/v1/users', _UserRoutes["default"]);
app.use('/v1/assigned-works', _AssignedWorkRoutesV["default"]);
app.use('/v1/done-works', _DoneWorkRoutesV["default"]);
app.use('/v1/salary-report', _SalaryReportRoutes["default"]);
app.use('/v2/product-categories', _ProductCategoryRoutes["default"]);
app.use('/v2/colors', _ColorRoutes["default"]);
app.use('/v2/color-products', _ColorProductRoutes["default"]);
app.use('/v2/product-colors', _ProductColorRoutes["default"]);
app.use('/v2/labour-costs', _LabourCostRoutes["default"]);
app.use('/v2/customers', _CustomerRoutes["default"]);
app.use('/v2/sizes', _SizeRoutes["default"]);
app.use('/v2/purchase-orders', _PurchaseOrderRoutes["default"]);
app.use('/v2/purchase-order-products', _PurchaseOrderProductRoutes["default"]);
app.use('/v2/works', _WorkRoutesV2["default"]);
app.use('/v2/assigned-works', _AssignedWorkRoutes["default"]);
app.use('/v2/worker-works', _WorkerWorkRoutesV["default"]);
app.use(_ErrorHandler["default"]);
app.get('/authenticate', function (req, res) {
  var cert = req.connection.getPeerCertificate();

  if (req.client.authorized) {
    res.send("Hello ".concat(cert.subject.CN, ", your certificate was issued by ").concat(cert.issuer.CN, "!"));
  } else if (cert.subject) {
    res.status(403).send("Sorry ".concat(cert.subject.CN, ", certificates from ").concat(cert.issuer.CN, " are not welcome here."));
  } else {
    res.status(401).send('Sorry, but you need to provide a client certificate to continue.');
  }
});
app.get('*', function (req, res) {
  return res.status(200).send({
    message: 'Welcome to this API.'
  });
}); // const opts = {
//   key: fs.readFileSync(path.resolve(__dirname, './ssl/server_key.pem')),
//   cert: fs.readFileSync(path.resolve(__dirname, './ssl/server_cert.pem')),
//   request_cert: true,
//   rejectUnauthorized: false,
//   ca: [fs.readFileSync(path.resolve(__dirname, './ssl/server_cert.pem'))]
// };
// const server = https.createServer(opts, app).listen(port, () => {
//   console.log(`Server is running on PORT ${port}`);
// });

var workflow = app.listen(port, function () {
  console.log("Server is running on PORT ".concat(port));
});

var closeGracefully = /*#__PURE__*/function () {
  var _ref = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee() {
    return _regenerator["default"].wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.next = 2;
            return workflow.close();

          case 2:
            process.exit();

          case 3:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }));

  return function closeGracefully() {
    return _ref.apply(this, arguments);
  };
}();

process.on('SIGINT', closeGracefully);
process.on('SIGTERM', closeGracefully);
process.on('SIGUSR2', closeGracefully);
var _default = app;
exports["default"] = _default;