const issueCreator = (jiraProjectID, url, summary, description) => {
  return {
    update: {},
    fields: {
      project: {
        id: jiraProjectID,
      },
      summary: `${summary} on ${url}`,
      description: {
        type: "doc",
        version: 1,
        content: [
          {
            type: "paragraph",
            content: [
              {
                text: description,
                type: "text",
              },
            ],
          },
        ],
      },
      issuetype: {
        name: "Task",
      },
    },
  };
};

export const auditIssuesCreator = (jiraProjectID, url, auditData) => {
  const issues = []
  auditData.suggestedTasks.map(({task, description}) => {
    return issues.push(issueCreator(jiraProjectID, url, task, description));
  });
  return issues;
};
