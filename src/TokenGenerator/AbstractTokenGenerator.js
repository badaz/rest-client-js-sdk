// @flow
/* eslint no-unused-vars: 0 */

type TokenPromise = Promise<any>;

class AbstractTokenGenerator {
  tokenGeneratorConfig: {};
  canAutogenerateToken: boolean;

  constructor(tokenGeneratorConfig: {}) {
    this.tokenGeneratorConfig = tokenGeneratorConfig;
    this.canAutogenerateToken = false;
    this.checkTokenGeneratorConfig(this.tokenGeneratorConfig);
  }

  generateToken(parameters: ?{}): TokenPromise {
    throw new Error(`AbstractTokenGenerator::generateToken can not be called directly.
                    You must implement "generateToken" method.`);
  }

  refreshToken(accessToken: {}, parameters: ?{}): TokenPromise {
    throw new Error(`AbstractTokenGenerator::refreshToken can not be called directly.
                    You must implement "refreshToken" method.`);
  }

  checkTokenGeneratorConfig(config: {}): boolean {
    return true;
  }

  convertMapToFormData(parameters: {}): FormData {
    const keys = Object.keys(parameters);

    const formData = new FormData();

    keys.forEach((key) => {
      formData.append(key, parameters[key]);
    });

    return formData;
  }
}

export default AbstractTokenGenerator;
