class SendResult {
  static make(res) {
    this.res = res;
    return this;
  }

  static send(data = undefined, statusCode, message) {
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

  static sendClientError(statusCode, message) {
    return this.res.status(400).json({
      message: message,
      statusCode: statusCode,
      status: false,
    });
  }
}

module.exports = SendResult;

