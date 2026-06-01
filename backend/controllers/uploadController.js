import { v2 as cloudinary } from 'cloudinary';

export const getUploadSignature = (req, res) => {
  try {
    const timestamp = Math.round(Date.now() / 1000);
    const folder = 'properties';

    // Parameters to sign — must EXACTLY match what frontend sends
    const paramsToSign = { timestamp, folder };

    const signature = cloudinary.utils.api_sign_request(
      paramsToSign,
      process.env.CLOUDINARY_SECRET_KEY  // make sure this is correct
    );

    console.log('Signature generated:', { timestamp, folder, signature }); // debug

    res.json({
      timestamp,
      signature,
      folder,
      cloudName: process.env.CLOUDINARY_CLOUD_NAME,
      apiKey: process.env.CLOUDINARY_API_KEY,
    });
    // uploadController.js — temporary debug
    console.log('Secret defined?', !!process.env.CLOUDINARY_SECRET_KEY);
    console.log('Cloud name:', process.env.CLOUDINARY_CLOUD_NAME);
    console.log('API key:', process.env.CLOUDINARY_API_KEY);
  } catch (err) {
    console.error('getUploadSignature error:', err);
    res.status(500).json({ message: 'Failed to generate upload signature' });
  }
};