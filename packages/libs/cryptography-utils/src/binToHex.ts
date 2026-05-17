import { Buffer } from 'node:buffer';

/**
 * Takes in Uint8Array binary object and outputs hex string.
 */
export function binToHex(array: Uint8Array): string {
  return Buffer.from(array).toString('hex');
}
