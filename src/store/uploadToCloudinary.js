import axios from "axios";

const uploadToCloudinary = async (file) => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", "swipely_unsigned");
  formData.append("cloud_name", "dsauziwdq");

  try {
    const res = await axios.post(
      `https://api.cloudinary.com/v1_1/dsauziwdq/image/upload`,
      formData
    );
    return res.data.secure_url; // image URL
  } catch (err) {
    console.error("Cloudinary Upload Error:", err);
    throw err;
  }
};

export default uploadToCloudinary;
