import URI from 'urijs';
import AbstractTokenGenerator from './AbstractTokenGenerator';

const ERROR_CONFIG_EMPTY = 'TokenGenerator config must be set';
const ERROR_CONFIG_PATH_SCHEME = 'TokenGenerator config is not valid, it should contain a "path", a "scheme" parameter';
const ERROR_CONFIG_CLIENT_INFORMATIONS = 'TokenGenerator config is not valid, it should contain a "clientId", a "clientSecret" parameter';

class ClientCredentialsGenerator extends AbstractTokenGenerator {
  generateToken(baseParameters = {}) {
    const parameters = baseParameters;
    parameters.grant_type = 'client_credentials';
    parameters.client_id = this.tokenGeneratorConfig.clientId;
    parameters.client_secret = this.tokenGeneratorConfig.clientSecret;

    const uri = (new URI(this.tokenGeneratorConfig.path))
      .scheme(this.tokenGeneratorConfig.scheme)
    ;

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

  refreshToken(accessToken, parameters) {
    return this.generateToken(parameters);
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
}

export default ClientCredentialsGenerator;
