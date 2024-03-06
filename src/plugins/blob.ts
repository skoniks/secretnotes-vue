import { decrypt, encrypt } from './crypto';

export function base64ToBlob(data: string): Promise<Blob> {
  return fetch(data).then((res) => res.blob());
}

export function blobToBase64(data: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result !== 'string') reject();
      else resolve(reader.result);
    };
    reader.onerror = reject;
    reader.readAsDataURL(data);
  });
}

export async function encryptBlob(data: Blob, key: string): Promise<Blob> {
  const [type, content] = (await blobToBase64(data)).split(';base64,');
  return await base64ToBlob(`${type};base64,${encrypt(content, key)}`);
}

export async function decryptBlob(data: Blob, key: string): Promise<Blob> {
  const [type, content] = (await blobToBase64(data)).split(';base64,');
  return await base64ToBlob(`${type};base64,${decrypt(content, key)}`);
}
