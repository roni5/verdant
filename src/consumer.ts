import Resolver from "@forge/resolver";
import { createConfluencePage } from "./utils/confluenceUtils";
import { storage } from "@forge/api";
import audit from "./utils/audit";
const resolver = new Resolver();

resolver.define("event-listener", async ({ payload, context }) => {
  const { url, spaceKey } = payload;

  let indexPageId = await storage.get("audits-index-page-id");
  if (!indexPageId) {
    const { id } = await createConfluencePage(
      spaceKey,
      undefined,
      "Carbon Audits",
      "<p>Audits Home Page</p>"
    );
    await storage.set("audits-index-page-id", id);
    indexPageId = id;
  }
  const date = new Date();
  const formattedDate = date.toISOString().split("T")[0] + " " + date.toTimeString().split(" ")[0]; // 2021-07-01 12:00:00
  const auditData = await audit(url);
  await createConfluencePage(
    spaceKey,
    indexPageId,
    `${formattedDate} | ${url}`,
    `<p>${auditData.carbon}</p>`
  );
});

export const handler = resolver.getDefinitions();
