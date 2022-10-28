import Resolver from "@forge/resolver";
import { saveAudit } from "./storage";
import audit from "./utils/audit";
import {
  createAuditPage,
  createOrFindAuditIndexPage,
} from "./utils/confluenceUtils";
import { createJiraIssues, createOrFindAuditJiraProject } from "./utils/jiraUtils";
const resolver = new Resolver();

resolver.define("event-listener", async ({ payload, context }) => {
  const { url, spaceKey, contentId, accountId } = payload;
  const indexPageId = await createOrFindAuditIndexPage(spaceKey, url);
  const auditData = await audit(url);
  const jiraId = await createOrFindAuditJiraProject(accountId);
  if(auditData.suggestedTasks.length > 0) {
    const issues = await createJiraIssues(url, auditData);
    auditData.suggestedTasks = auditData.suggestedTasks.map(({...rest}, i) => {
      return {
        ...rest,
        issue: issues[i],
      };
    })
  }
  const pageId = await createAuditPage(auditData, spaceKey, indexPageId, url);
  await saveAudit(url, contentId, {
    pageId,
    status: "success",
    ...auditData,
  });
});

export const handler = resolver.getDefinitions();
