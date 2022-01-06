/**
 * Based on tracker1/node-uuid4
 *
 * @see https://github.com/tracker1/node-uuid4
 */

// @ts-ignore
import crypto from 'node:crypto';

const uuidPattern = /^[\da-f]{8}-[\da-f]{4}-4[\da-f]{3}-[89ab][\da-f]{3}-[\da-f]{12}$/i;

function isValid(uuid) {
  return uuidPattern.test(uuid);
}

function uuid4() {
  let rnd = crypto.randomBytes(16);
  rnd[6] = (rnd[6] & 0x0f) | 0x40;
  rnd[8] = (rnd[8] & 0x3f) | 0x80;
  rnd = rnd.toString('hex').match(/(.{8})(.{4})(.{4})(.{4})(.{12})/);
  rnd.shift();
  return rnd.join('-');
}

uuid4.isValid = isValid;

export { uuid4, isValid };
