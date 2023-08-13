const convertStringToArrayBuffer = (str: string) => {
  const textEncoder = new TextEncoder();
  return textEncoder.encode(str).buffer;
};

export function convertFileToArrayBuffer(
  file: File
): Promise<ArrayBuffer | null> {
  return new Promise((resolve, reject) => {
    if (!file || !file.name) {
      reject(new Error('Invalid or missing file.'));
    }

    const reader = new FileReader();

    reader.onload = () => {
      const arrayBuffer: ArrayBuffer | null | string = reader.result;

      if (arrayBuffer === null) {
        resolve(null);
        return;
      }
      if (typeof arrayBuffer === 'string') {
        resolve(convertStringToArrayBuffer(arrayBuffer));
        return;
      }
      if (!arrayBuffer) {
        reject(new Error('Failed to read file into ArrayBuffer.'));
        return;
      }

      resolve(arrayBuffer);
    };

    reader.onerror = () => {
      reject(new Error('Error reading file.'));
    };

    reader.readAsArrayBuffer(file);
  });
}
