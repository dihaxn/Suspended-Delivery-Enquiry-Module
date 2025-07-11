import { getUploadInstance } from "@cookers/services";

 export const fileUpload = async (file: File) => {
     const URL = `file-upload`;
     const formData = new FormData();
      formData.append('FileDetails', file);
     formData.append('FileName', file.name);
     
    
     await getUploadInstance().post(URL, formData);

};
  