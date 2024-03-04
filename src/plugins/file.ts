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

// export const fileFromBase64 = (url: string, name: string) => {
//   const element = document.createElement('a');
//   element.href = url;
//   element.target = '_parent';
//   element.download = name;
//   document.body.appendChild(element);
//   element.dispatchEvent(new MouseEvent('click'));
//   element.parentNode?.removeChild(element);
// };
