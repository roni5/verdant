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
  console.log(bodyData)
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
  console.log(data)
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

const highlights = [
  "Your carbon score has been calculated and you can find out about your audited URLs by visiting the sub-pages below.",
  "We've used a traffic light colour system 🔴 🟡 🟢 to indicate the score of each URL audited: green shows you're doing great, and red shows you need to take action.",
  "Engineers, click-through on the sub-page to see the suggested actions that have been added to JIRA.",
  "Leadership, head to JIRA to find dashboard widgets to help you get a top-down perspective!"
]

async function createHomePage(spaceKey) {
  const { id } = await createConfluencePage(
    spaceKey,
    null,
    "Web Carbon Audits",
    `<h3>🍃 Welcome to your Verdant hub!</h3>
    <p>Congratulations on making the first step to having a greener digital footprint! This page has been automatically created to keep track of all your audit reports.</p>
    <h4>🧐 Things to explore:</h4>
    <ul>
      ${highlights.map((highlight) => `<li>${highlight}</li>`).join("")}
    </ul>`
  );
  await storage.set("audits-index-page-id", id);
  return id;
}

async function createSubPage(indexHomePageId, spaceKey, url, storageKey) {
  const { id } = await createConfluencePage(
    spaceKey,
    indexHomePageId,
    url,
    `<p>This is the directory containing audits of ${url}</p>`
  );
  await storage.set(storageKey, id);
  return id;
}

export const createOrFindAuditIndexPage = async (spaceKey, url) => {
  const urlWithoutProtocol = url.replace(/(^\w+:|^)\/\//, "");
  const storageKeyforURL = `audits-${urlWithoutProtocol}-page-id`;
  let indexHomePageId = await storage.get("audits-index-page-id");
  let urlPageId = await storage.get(storageKeyforURL);
  if (!indexHomePageId) {
    indexHomePageId = await createHomePage(spaceKey);
    urlPageId = await createSubPage(
      indexHomePageId,
      spaceKey,
      url,
      storageKeyforURL
    );
  } else {
    const { status } = await getConfluencePageByID(indexHomePageId);
    if (status !== "current") {
      await deleteConfluencePageByID(indexHomePageId);
      indexHomePageId = await createHomePage(spaceKey);
    }
  }
  if (!urlPageId) {
    urlPageId = await createSubPage(
      indexHomePageId,
      spaceKey,
      url,
      storageKeyforURL
    );
  } else {
    const { status: urlPageStatus } = await getConfluencePageByID(urlPageId);
    if (urlPageStatus !== "current") {
      await deleteConfluencePageByID(urlPageId);
      urlPageId = await createSubPage(
        indexHomePageId,
        spaceKey,
        url,
        storageKeyforURL
      );
    }
  }
  return urlPageId;
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
    `${auditData.score > 4 ? "🟢": auditData.score > 2 ? "🟠": "🔴"} ${formattedDate}`,
    auditPageCreator(url, auditData)
  );
  return id;
};
