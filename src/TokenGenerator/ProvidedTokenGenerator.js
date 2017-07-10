// @flow
/* global fetch */
import AbstractTokenGenerator from './AbstractTokenGenerator';

type Callback = () => Promise<any>;

class ProvidedTokenGenerator extends AbstractTokenGenerator {
  _token: string;
  _refreshTokenFunc: ?Callback;

  constructor(token: string, refreshTokenFunc: ?Callback) {
    super({});
    this._token = token;
    this.canAutogenerateToken = true;
    this._refreshTokenFunc = refreshTokenFunc;
  }

  generateToken() {
    return Promise.resolve({
      access_token: this._token,
    });
  }

  refreshToken() {
    if (typeof this._refreshTokenFunc === 'function') {
      return this._refreshTokenFunc();
    }

    return this.generateToken();
  }
}

export default ProvidedTokenGenerator;
