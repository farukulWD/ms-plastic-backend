import { readFile } from "fs/promises";
import path from "path";

export const getTemplate = async (templatePath, replacements) => {
  let template = await readFile(templatePath, "utf-8");
  for (const [key, value] of Object.entries(replacements)) {
    template = template.replace(new RegExp(`{{${key}}}`, "g"), value);
  }
  return template;
};

export default getTemplate;
