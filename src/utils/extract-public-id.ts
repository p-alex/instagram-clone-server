export const extractPublicId = (image: string) => {
  return image.substring(image.indexOf("instagram"), image.indexOf(".jpg"));
};
