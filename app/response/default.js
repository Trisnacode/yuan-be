class SendResult {
  static make(res) {
    this.res = res;
    return this;
  }

  static send(statusCode, message, data = undefined) {
    if (data) {
      return this.res.status(200).json(
          {
            data: data,
            message: message,
            statusCode: statusCode,
            status: true,
          },
      );
    }

    return this.res.status(200).json(
        {
          message: message,
          statusCode: statusCode,
          status: true,
        },
    );
  }

  static sendInvalidData(message = '') {
    return this.res.status(422).json({
      message: message,
      statusCode: 'ERROR_VALIDATION',
      status: false,
    });
  }

  static sendClientError(statusCode, message = '') {
    return this.res.status(400).json({
      message: message,
      statusCode: statusCode,
      status: false,
    });
  }

  static sendServerError(statusCode, message = '') {
    return this.res.status(500).json({
      message: message,
      statusCode: statusCode,
      status: false,
    });
  }

  static sendCustomError(httpCode, statusCode, message) {
    return this.res.status(httpCode).json({
      message: message,
      statusCode: statusCode,
      status: false,
    });
  }

  static sendUnauthorized(message) {
    return this.res.status(401).json({
      message: message,
      statusCode: 'UNAUTHORIZED',
      status: false,
    });
  }
}

module.exports = SendResult;

