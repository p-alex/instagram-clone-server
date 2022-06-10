export const replaceBlankLines = (text: string | undefined) => {
  if (text === undefined) return "";
  return text.replace(/^(\s*\r?\n){1,}/gm, "").replace(/( ){2,}/gm, "");
};
