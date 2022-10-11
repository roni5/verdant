import api, { route } from "@forge/api";
import { ContentData, TermDescriptor } from "./types";

export const getContentProperty = async (contentId: string, key: string) => {
  const res = await api
    .asApp()
    .requestConfluence(route`/wiki/rest/api/content/${contentId}/property/${key}`);

  if (!res.ok) {
    return {};
  }
  return await res.json();
};

export const createContentProperty = async (
  contentId: string,
  key: string,
  selectedText: string,
  data2store: TermDescriptor
): Promise<ContentData> => {
  const body: ContentData = {
    value: {
      [selectedText]: data2store,
    },
    key,
  };

  const res = await api
    .asApp()
    .requestConfluence(route`/wiki/rest/api/content/${contentId}/property`, {
      method: "POST",
      body: JSON.stringify(body),
    });

  if (!res.ok) {
    return null;
  }

  return await res.json();
};

export const updateContentProperty = async (
  contentId: string,
  key: string,
  contentData: ContentData,
  selectedText: string,
  data2store: TermDescriptor
): Promise<ContentData> => {
  const allDefinitions = contentData.value || {};
  const body: ContentData = {
    value: {
      ...allDefinitions,
      [selectedText]: data2store,
    },
    version: {
      number: contentData.version.number + 1,
    },
  };

  const res = await api
    .asApp()
    .requestConfluence(route`/wiki/rest/api/content/${contentId}/property/${key}`, {
      method: "PUT",
      body: JSON.stringify(body),
    });

  if (!res.ok) {
    return null;
  }

  return await res.json();
};
