import { AES, MD5, enc, format } from 'crypto-js';

export const md5 = (data: string) => MD5(data).toString(enc.Hex);

export const encrypt = (data: string, key: string) =>
  AES.encrypt(data, key).toString(format.OpenSSL);

export const decrypt = (data: string, key: string) =>
  AES.decrypt(data, key).toString(enc.Utf8);
