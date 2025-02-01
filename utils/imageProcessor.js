const path = require('path');
const fs = require('fs');
const sharp = require('sharp');

const resizeImage = async (buffer) => {
  try {
    const resizedImage = await sharp(buffer)
      .resize({ width: 800 }) 
      .jpeg({ quality: 70 }) 
      .toBuffer();
    return resizedImage;
  } catch (error) {
    throw new Error('Error resizing and compressing the image');
  }
};


const handleImageProcessing = async (file) => {
  if (!file || !file.buffer) {
    throw new Error('No file uploaded or file buffer missing');
  }

  try {
    const resizedImage = await resizeImage(file.buffer); 

    if (resizedImage.length > 50 * 1024) {
      throw new Error('Image exceeds 50KB after resizing');
    }

    return resizedImage;  // Return the resized buffer
  } catch (error) {
    throw new Error('Error processing the image: ' + error.message);
  }
};

module.exports = { handleImageProcessing };


module.exports = { handleImageProcessing };
