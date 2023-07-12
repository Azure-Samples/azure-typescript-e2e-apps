import { BlockBlobClient  } from "@azure/storage-blob";

export type uploadObjectResponse = {
  error: Error | unknown | undefined
}

class UploadFilesService {
  async upload(sasUrl: string, file: File):Promise<uploadObjectResponse> {

    try{
      const blockBlobClient = new BlockBlobClient(sasUrl);

      const buffer = await file.arrayBuffer();
      await blockBlobClient.uploadData(buffer);
      return { error: undefined }
    } catch(error){
      return { error };
    }

  }

}

export default new UploadFilesService();
