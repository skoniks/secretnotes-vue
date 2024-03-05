import { AES, MD5 } from 'crypto-js';

export const md5 = (data: string) => MD5(data).toString();

export const encrypt = (data: string, key: string) =>
  AES.encrypt(data, key).toString();

export const decrypt = (data: string, key: string) =>
  AES.decrypt(data, key).toString();
