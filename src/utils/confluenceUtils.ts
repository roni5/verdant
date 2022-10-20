import api, { route, storage } from "@forge/api";
import { saveAudit } from "src/storage";
import { auditPageCreator } from "./auditPageCreator";

export const createConfluencePageBodyData = (
  spaceKey,
  ancestor,
  title,
  bodyContent
) => ({
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

export const createConfluencePage = async (
  spaceId,
  ancestor,
  title,
  bodyContent
) => {
  const bodyData = createConfluencePageBodyData(
    spaceId,
    ancestor,
    title,
    bodyContent
  );
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
  return data;
};

export const getConfluencePageByID = async (pageId) => {
  const response = await api
    .asApp()
    .requestConfluence(route`/wiki/rest/api/content/${pageId}`, {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    });
  const data = await response.json();
  return data;
};

export const deleteConfluencePageByID = async (pageId) => {
  const response = await api
    .asApp()
    .requestConfluence(route`/wiki/rest/api/content/${pageId}`, {
      method: "DELETE",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    });
  return response;
};

async function createHomePage(spaceKey) {
  const { id } = await createConfluencePage(
    spaceKey,
    null,
    "Web Carbon Audits",
    "<p>Web Carbon Audits</p>"
  );
  await storage.set("audits-index-page-id", id);
  return id;
}

export const createOrFindAuditIndexPage = async (spaceKey) => {
  let indexPageId = await storage.get("audits-index-page-id");
  if (!indexPageId) {
    indexPageId = await createHomePage(spaceKey);
  } else {
    const { status } = await getConfluencePageByID(indexPageId);
    if (status !== "current") {
      await deleteConfluencePageByID(indexPageId);
      indexPageId = await createHomePage(spaceKey);
    }
  }
  return indexPageId;
};

export const createAuditPage = async (
  auditData,
  spaceKey,
  indexPageId,
  url
) => {
  const date = new Date();
  const formattedDate =
    date.toISOString().split("T")[0] + " " + date.toTimeString().split(" ")[0]; // 2021-07-01 12:00:00
  const { id } = await createConfluencePage(
    spaceKey,
    indexPageId,
    `${formattedDate} | ${url}`,
    auditPageCreator(url, auditData)
  );
    return id
};
