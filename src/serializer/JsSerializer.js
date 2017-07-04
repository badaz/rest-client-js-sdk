// @flow
/* eslint no-unused-vars: 0 */
import Serializer from './Serializer';

class JsSerializer extends Serializer {
  serializeItem(entity: any, type: string) {
    return JSON.stringify(entity);
  }

  deserializeItem(rawData: string, type: string) {
    return JSON.parse(rawData);
  }

  deserializeList(rawListData: string, type: string) {
    return JSON.parse(rawListData);
  }
}

export default JsSerializer;
