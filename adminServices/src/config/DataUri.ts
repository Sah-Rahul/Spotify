import DataUriParser from "datauri/parser.js";
import path from "path";

const getBuffer = (file: Express.Multer.File) => {
  if (!file) return null;

  const parser = new DataUriParser();
  const extName = path.extname(file.originalname).toString();

  const result = parser.format(extName, file.buffer);

  return result.content;
};

export default getBuffer;
