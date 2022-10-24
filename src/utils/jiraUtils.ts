import api, { route, storage } from "@forge/api";
import { auditIssuesCreator } from "./auditIssuesCreator";

export const createJiraIssues = async (url, auditData) => {
  let jiraProjectID = await storage.get("audits-jira-project-id");
  const issue = await api.asApp().requestJira(route`/rest/api/3/issue/bulk`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      issueUpdates: auditIssuesCreator(jiraProjectID, url, auditData)
    }),
  });
  const data = await issue.json();
  // const issueKeys = data.issues.map((issue) => issue.key);
  // const issueURLS = issueKeys.map((issueKey) => `https://jira.atlassian.com/browse/${issueKey}`);
  return  data.issues;
};

export const createJiraProject = async (spaceKey, name, accountId) => {
  const response = await api.asApp().requestJira(route`/rest/api/3/project`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      leadAccountId: accountId,
      key: spaceKey,
      name,
      projectTypeKey: "software",
      projectTemplateKey:
        "com.pyxis.greenhopper.jira:gh-simplified-agility-kanban",
    }),
  });
  const data = await response.json();
  return data;
};

export const createOrFindAuditJiraProject = async (accountId) => {
  let jiraProjectID = await storage.get("audits-jira-project-id");
  const spaceKey = `WCA`;
  const spaceName = "Web Carbon Audits";
  if (!jiraProjectID) {
    const { id } = await createJiraProject(spaceKey, spaceName, accountId);
    jiraProjectID = id;
    await storage.set("audits-jira-project-id", jiraProjectID);
  } else {
    const response = await api
      .asApp()
      .requestJira(route`/rest/api/3/project/${spaceKey}`, {
        method: "GET",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      });
    const status = await response.status;
    if (status === 404) {
      const { id } = await createJiraProject(spaceKey, spaceName, accountId);
      jiraProjectID = id;
      await storage.set("audits-jira-project-id", jiraProjectID);
    }
  }
  return jiraProjectID;
};
