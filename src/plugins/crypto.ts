import { AES, MD5 } from 'crypto-js';
import { base64ToBlob, blobToBase64 } from './file';

export const md5 = (data: string) => MD5(data).toString();

export async function encryptBlob(data: Blob, secret: string): Promise<Blob> {
  const base64 = await blobToBase64(data);
  const [type, input] = base64.split(';base64,');
  const encoded = AES.encrypt(input, secret).toString();
  return await base64ToBlob(`${type};base64,${encoded}`);
}
