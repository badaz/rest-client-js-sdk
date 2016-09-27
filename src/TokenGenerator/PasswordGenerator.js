import URI from 'urijs';
import AbstractTokenGenerator from './AbstractTokenGenerator';

const ERROR_CONFIG_EMPTY = 'TokenGenerator config must be set';
const ERROR_CONFIG_PATH_SCHEME = 'TokenGenerator config is not valid, it should contain a "path", a "scheme" parameter';
const ERROR_CONFIG_CLIENT_INFORMATIONS = 'TokenGenerator config is not valid, it should contain a "clientId", a "clientSecret" parameter';

const ERROR_TOKEN_EMPTY = 'parameters must be set';
const ERROR_TOKEN_USERNAME_PASSWORD = 'username and password must be passed as parameters';
const ERROR_TOKEN_ACCESS_TOKEN_REFRESH_TOKEN = 'access_token and refresh_token be passed as parameters';

class PasswordGenerator extends AbstractTokenGenerator {
  generateToken(baseParameters) {
    const parameters = baseParameters;
    this._checkGenerateParameters(parameters);

    parameters.grant_type = 'password';
    parameters.client_id = this.tokenGeneratorConfig.clientId;
    parameters.client_secret = this.tokenGeneratorConfig.clientSecret;

    return this._doFetch(parameters);
  }

  refreshToken(accessToken, baseParameters = {}) {
    if (!(accessToken && accessToken.refresh_token)) {
      throw new Error('refresh_token is not set. Did you called `generateToken` before ?');
    }

    const parameters = baseParameters;

    parameters.grant_type = 'refresh_token';
    parameters.client_id = this.tokenGeneratorConfig.clientId;
    parameters.client_secret = this.tokenGeneratorConfig.clientSecret;

    parameters.refresh_token = accessToken.refresh_token;

    return this._doFetch(parameters);
  }

  checkTokenGeneratorConfig(config) {
    if (!config || Object.keys(config).length === 0) {
      throw new RangeError(ERROR_CONFIG_EMPTY);
    }

    if (!(config.path && config.scheme)) {
      throw new RangeError(ERROR_CONFIG_PATH_SCHEME);
    }

    if (!(config.clientId && config.clientSecret)) {
      throw new RangeError(ERROR_CONFIG_CLIENT_INFORMATIONS);
    }
  }

  _doFetch(parameters) {
    const uri = new URI(this.tokenGeneratorConfig.path);
    uri.scheme(this.tokenGeneratorConfig.scheme);

    if (this.tokenGeneratorConfig.port) {
      uri.port(this.tokenGeneratorConfig.port);
    }

    const url = uri.toString();

    return fetch(url, {
      method: 'POST',
      body: this.convertMapToFormData(parameters),
    })
    .then(response => {
      if (response.status !== 200) {
        return response.json()
        .then(responseData => Promise.reject(responseData));
      }

      return response.json();
    });
  }

  _checkGenerateParameters(parameters) {
    if (!(parameters && Object.keys(parameters).length > 0)) {
      throw new RangeError(ERROR_TOKEN_EMPTY);
    }

    if (!(parameters.username && parameters.password)) {
      throw new RangeError(ERROR_TOKEN_USERNAME_PASSWORD);
    }
  }
}

export default PasswordGenerator;
