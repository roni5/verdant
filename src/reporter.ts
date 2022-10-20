import Resolver from "@forge/resolver";
import { saveAudit } from "./storage";
import audit from "./utils/audit";
import {
  createAuditPage,
  createOrFindAuditIndexPage,
} from "./utils/confluenceUtils";
import { createOrFindAuditJiraProject } from "./utils/jiraUtils";
const resolver = new Resolver();

resolver.define("event-listener", async ({ payload, context }) => {
  const { url, spaceKey, contentId, accountId } = payload;
  const indexPageId = await createOrFindAuditIndexPage(spaceKey);
  const auditData = await audit(url);
  const pageId = await createAuditPage(auditData, spaceKey, indexPageId, url);
  // const jiraId = await createOrFindAuditJiraProject(accountId);
  await saveAudit(url, contentId, {
    pageId,
    status: "success",
    ...auditData,
  });
});

export const handler = resolver.getDefinitions();
