const ErrorHandler = (err, req, res, next) => {
  if (typeof err === 'string') {
    return res.status(400).json({ message: err });
  }

  if (err.name === 'UnauthorizedError') {
    return res.status(401).json({ message: err.message });
  }

  if (err.code === '23505') {
    return res.status(409).json({
      status: 'Conflict',
      message: 'Tidak dapat menyimpan duplikat artikel',
    });
  }

  if (err.code == 409) {
    return res.status(409).json({
      status: 'Conflict',
      message: err.message,
    });
  }

  return res.status(500).json({ message: err.message });
};

export default ErrorHandler;
