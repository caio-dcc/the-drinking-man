"use server";

import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function createArticle(data: {
  title: string;
  slug: string;
  content: string;
  image?: string;
  author: string;
  published: boolean;
}) {
  try {
    const article = await db.article.create({
      data: {
        title: data.title,
        slug: data.slug,
        content: data.content,
        image: data.image,
        author: data.author,
        published: data.published,
      },
    });
    revalidatePath("/articles");
    revalidatePath("/admin/articles");
    return { success: true, article };
  } catch (error) {
    console.error("Error creating article:", error);
    return { success: false, error: "Failed to create article" };
  }
}

export async function getArticles() {
  try {
    return await db.article.findMany({
      orderBy: { createdAt: "desc" },
    });
  } catch (error) {
    console.error("Error fetching articles:", error);
    return [];
  }
}

export async function deleteArticle(id: string) {
  try {
    await db.article.delete({
      where: { id },
    });
    revalidatePath("/articles");
    revalidatePath("/admin/articles");
    return { success: true };
  } catch (error) {
    console.error("Error deleting article:", error);
    return { success: false };
  }
}

export async function createReading(data: {
  title: string;
  author?: string;
  link?: string;
  image?: string;
  review?: string;
}) {
  try {
    const reading = await db.reading.create({
      data,
    });
    revalidatePath("/readings");
    revalidatePath("/admin/readings");
    return { success: true, reading };
  } catch (error) {
    console.error("Error creating reading:", error);
    return { success: false, error: "Failed to create reading" };
  }
}

export async function getReadings() {
  try {
    return await db.reading.findMany({
      orderBy: { createdAt: "desc" },
    });
  } catch (error) {
    console.error("Error fetching readings:", error);
    return [];
  }
}
