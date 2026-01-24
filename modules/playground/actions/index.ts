"use server";

import {db} from "@/lib/db";
import { TemplateFolder } from "../lib/path-to-json";
import { currentUser } from "@/modules/auth/actions";


export const getPlaygroundById = async (id: string) => {
  const user = await currentUser();
  if (!user) return null;

  try {
    return await db.playground.findUnique({
      where: { id },
      select: {
        title:true,
        templateFiles: {
          select: { content: true },
        },
      },
    });
  } catch (error) {
    console.error("getPlaygroundById error", error);
    return null;
  }
};

export const saveUpdatedCode = async (
  playgroundId: string,
  data: TemplateFolder
) => {
  const user = await currentUser();
  if (!user) return null;

  try {
    return await db.templateFile.upsert({
      where: { playgroundId }, // MUST be unique
      update: { content: JSON.stringify(data) },
      create: {
        playgroundId,
        content: JSON.stringify(data),
      },
    });
  } catch (error) {
    console.error("SaveUpdatedCode error", error);
    return null;
  }
};
