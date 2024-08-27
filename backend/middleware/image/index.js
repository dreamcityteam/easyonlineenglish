module.exports = (req, res, next) => {
  res.setHeader('Content-Security-Policy', "img-src 'self' data: *");
  next();
}
