import axios from 'axios';
import { API_BASEURL } from '../envVariables';

export const fileUpload = async (file, key) => {
  const reponse = await axios.get(`${API_BASEURL}/api/v1/file-upload${key}`, {
    headers: {
      // "Authorization":token?token:undefined
    },
  });
  const fileUploadData = reponse?.data?.data;
  const repos = await axios.put(fileUploadData.apiUrl, file, {
    'Content-Type': file?.type,
  });
  return fileUploadData;
};
