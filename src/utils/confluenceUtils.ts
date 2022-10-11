// This sample uses Atlassian Forge
// https://developer.atlassian.com/platform/forge/
import api, { route } from "@forge/api";

export const createConfluencePageBodyData = (spaceKey, ancestor, title, bodyContent) => ({
  title,
  type: "page",
  ...(ancestor ? { ancestors: [{ id: ancestor }] } : {}),
  space: {
    key: spaceKey,
  },
  body: {
    storage: {
      value: bodyContent,
      representation: "storage",
    },
  },
});

export const createConfluencePage = async (spaceId, ancestor, title, bodyContent) => {
  const bodyData = createConfluencePageBodyData(spaceId, ancestor, title, bodyContent);
  const response = await api
    .asApp()
    .requestConfluence(route`/wiki/rest/api/content`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(bodyData),
    });
  const data = await response.json();
  return data
};
