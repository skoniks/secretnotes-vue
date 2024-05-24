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

export function saveBlob(data: Blob, name: string) {
  const [type, ext] = data.type.split('+');
  if (type.startsWith('image')) {
    data.arrayBuffer().then((buffer) => {
      const blob = new Blob([buffer], { type });
      window.open(URL.createObjectURL(blob));
    });
  } else {
    const a = document.createElement('a');
    a.href = URL.createObjectURL(data);
    a.download = name + (ext ? '.' + ext : '');
    document.body.appendChild(a), a.click();
    document.body.removeChild(a);
  }
}

export async function encryptBlob(data: Blob, key: string): Promise<Blob> {
  const [type, content] = (await blobToBase64(data)).split(';base64,');
  return await base64ToBlob(`${type};base64,${encrypt(content, key)}`);
}

export async function decryptBlob(data: Blob, key: string): Promise<Blob> {
  const [type, content] = (await blobToBase64(data)).split(';base64,');
  return await base64ToBlob(`${type};base64,${decrypt(content, key)}`);
}

export async function fileToBlob(file: File): Promise<Blob> {
  const buffer = await file.arrayBuffer();
  const [, ext] = file.name.match(/\.([^.]+)$/) || [];
  const type = [file.type, ext ?? ''].join('+');
  return new Blob([buffer], { type });
}
