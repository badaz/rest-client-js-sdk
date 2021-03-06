/**
 * It's a bit tricky to extends native errors
 * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error
 */

function HttpError(message, baseResponse) {
  this.name = 'BadRequestError';
  this.message = message || 'Bad request';
  this.baseResponse = baseResponse;
  this.stack = new Error().stack;
}
HttpError.prototype = Object.create(Error.prototype);
HttpError.prototype.constructor = HttpError;

// 400
function BadRequestError(message, baseResponse) {
  this.name = 'BadRequestError';
  this.message = message || 'Bad request';
  this.baseResponse = baseResponse;
  this.stack = new Error().stack;
}
BadRequestError.prototype = Object.create(HttpError.prototype);
BadRequestError.prototype.constructor = BadRequestError;

// 401
function AccessDeniedError(message, baseResponse) {
  this.name = 'AccessDeniedError';
  this.message = message || 'Access denied';
  this.baseResponse = baseResponse;
  this.stack = new Error().stack;
}
AccessDeniedError.prototype = Object.create(BadRequestError.prototype);
AccessDeniedError.prototype.constructor = AccessDeniedError;

// 403
function ForbiddenError(message, baseResponse) {
  this.name = 'ForbiddenError';
  this.message = message || 'Forbidden';
  this.baseResponse = baseResponse;
  this.stack = new Error().stack;
}
ForbiddenError.prototype = Object.create(BadRequestError.prototype);
ForbiddenError.prototype.constructor = ForbiddenError;

// 404
function ResourceNotFoundError(message, baseResponse) {
  this.name = 'ResourceNotFoundError';
  this.message = message || 'Resource is not found';
  this.baseResponse = baseResponse;
  this.stack = new Error().stack;
}
ResourceNotFoundError.prototype = Object.create(BadRequestError.prototype);
ResourceNotFoundError.prototype.constructor = ResourceNotFoundError;

// 500
function InternalServerError(message, baseResponse) {
  this.name = 'InternalServerError';
  this.message = message || 'Internal server error';
  this.baseResponse = baseResponse;
  this.stack = new Error().stack;
}
InternalServerError.prototype = Object.create(HttpError.prototype);
InternalServerError.prototype.constructor = InternalServerError;

function handleBadResponse(response) {
  switch (true) {
    case response.status === 403:
      throw new ForbiddenError(null, response);

    case response.status === 404:
      throw new ResourceNotFoundError(null, response);

    case response.status >= 400 && response.status < 500:
      throw new BadRequestError(null, response);

    case response.status >= 500 && response.status < 600:
      throw new InternalServerError(null, response);

    default:
      return new Error(`Unexpected error, status code is ${response.status}`);
  }
}

export {
  AccessDeniedError,
  BadRequestError,
  ForbiddenError,
  HttpError,
  InternalServerError,
  ResourceNotFoundError,
  handleBadResponse,
};
