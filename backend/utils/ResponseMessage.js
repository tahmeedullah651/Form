function SuccessMessage(res, data = null, status = 201) {
  return res.status(status).json({
    success: true,
    data,
  });
}

function ErrorMessage(res, status = 500, error = null) {
  return res.status(status).json({
    success: false,
    message: error ? error.message : "Internal server error",
  });
}

export { SuccessMessage, ErrorMessage };
