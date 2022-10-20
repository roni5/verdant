import api, { route, storage } from "@forge/api";
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
  const spaceKey = `WCA${new Date().getTime()}`.slice(0, 10);
  const spaceName = "Web Carbon Audits";
  if (!jiraProjectID) {
    jiraProjectID = await createJiraProject(spaceKey, spaceName, accountId);
  }else {
    const response = await api.asApp().requestJira(route`/rest/api/3/project/${spaceKey}`, {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    });
    const status = await response.status;
    if (status === 404) {
        jiraProjectID = await createJiraProject(spaceKey, spaceName, accountId);
        await storage.set("audits-jira-project-id", jiraProjectID);
    }
  }
  return jiraProjectID;
};
