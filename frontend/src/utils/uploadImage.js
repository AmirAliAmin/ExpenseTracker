import { API_PATH } from "./apiPath";
import axiosInstance from "./axiosInstance";

const uploadImage = async (imageFile) => {
    const formData = new FormData();

    //append image file tp from data
    formData.append('image', imageFile);

    try {
        const response = await axiosInstance.post(API_PATH.IMAGE.UPLOAD_IMAGE, formData,{
            headers:{
                'Content-Type': "multipart/form-data" //set haeder for file uplaod
            }
        });
        return response.data;  
    } catch (error) {
        console.error('Error uploading the image', error);
        throw error; 
    }
}

export default uploadImage;