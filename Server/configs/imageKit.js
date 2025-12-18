// Server / configs / imageKit.js
import ImageKit from "@imagekit/nodejs";

const imageKit = new ImageKit({
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
  urlEndPoint: process.env.IMAGEKIT_URL_ENDPOINT,
});

export default imageKit;
