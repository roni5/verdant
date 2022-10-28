import ForgeUI, {
  render,
  Tag,
  Macro,
  Text,
  Tabs,
  Tab,
  Table,
  Head,
  Row,
  Cell,
  useProductContext,
  SectionMessage,
  DashboardGadget,
  Link,
  Button,
  Fragment,
  Heading,
  Strong,
} from "@forge/ui";
import { useAuditsViaProperties } from "./storage";

const App = () => {
  const { audits } = useAuditsViaProperties();

  const auditsByDescDate = audits.sort((a, b) => {
    return (
      new Date(b.auditTimestamp).getTime() -
      new Date(a.auditTimestamp).getTime()
    );
  });

  let auditsWithUniqueUrls = auditsByDescDate
    .filter((audit, index, self) => {
      return (
        index ===
        self.findIndex((a) => {
          return a.url === audit.url;
        })
      );
    })
    .map(({ hosting, ...item }) => ({ ...item, green: hosting.green }));

  let audistByScore = auditsWithUniqueUrls
    .filter(({ status }) => status === "success")
    .sort((a, b) => {
      return a.score - b.score;
    });
  const worstAudits = audistByScore.slice(0, 5);
  const bestAudits = audistByScore.slice(-5).reverse();

  return (
    <Fragment>
      <Tabs>
        <Tab label="Worst">
          {worstAudits.length > 0 ? (
            <Table>
              <Head>
                <Cell>
                  <Text>Webpage</Text>
                </Cell>
                <Cell>
                  <Text>Score</Text>
                </Cell>
                <Cell>
                  <Text>Suggested Tasks</Text>
                </Cell>
                <Cell>
                  <Text>Actions</Text>
                </Cell>
              </Head>
              {worstAudits.map(
                ({ url, status, spaceKey, pageId, score, suggestedTasks }) => {
                  const isComplete = status === "success";
                  return (
                    <Row>
                      <Cell>
                        <Text>
                          <Strong>{url}</Strong>
                        </Text>
                      </Cell>

                      <Cell>
                        <Tag
                          text={score + " / 5"}
                          color={
                            score > 3 ? "green" : score > 1 ? "yellow" : "red"
                          }
                        />
                      </Cell>
                      <Cell>
                        <Tag
                          text={`${suggestedTasks.length} tasks`}
                          color={suggestedTasks.length > 0 ? "yellow" : "green"}
                        />
                      </Cell>
                      <Cell>
                        <Text>
                          {isComplete ? (
                            <Link
                              href={`/wiki/spaces/${spaceKey}/pages/${pageId}`}
                            >
                              View Report
                            </Link>
                          ) : (
                            "-"
                          )}
                        </Text>
                      </Cell>
                    </Row>
                  );
                }
              )}
            </Table>
          ) : (
            <SectionMessage title="No audits" appearance="info">
              <Text>
                No audits have been triggered yet. To get started, highlight a
                URL within a confluence page and use the "Audit Site" action.
              </Text>
            </SectionMessage>
          )}
        </Tab>
        <Tab label="Best">
          {bestAudits.length > 0 ? (
            <Table>
              <Head>
                <Cell>
                  <Text>Webpage</Text>
                </Cell>
                <Cell>
                  <Text>Score</Text>
                </Cell>
                <Cell>
                  <Text>Suggested Tasks</Text>
                </Cell>
                <Cell>
                  <Text>Actions</Text>
                </Cell>
              </Head>
              {bestAudits.map(
                ({ url, status, spaceKey, pageId, score, suggestedTasks }) => {
                  const isComplete = status === "success";
                  return (
                    <Row>
                      <Cell>
                        <Text>
                          <Strong>{url}</Strong>
                        </Text>
                      </Cell>

                      <Cell>
                        <Tag
                          text={score + " / 5"}
                          color={
                            score > 3 ? "green" : score > 1 ? "yellow" : "red"
                          }
                        />
                      </Cell>
                      <Cell>
                        <Tag
                          text={`${suggestedTasks.length} tasks`}
                          color={suggestedTasks.length > 0 ? "yellow" : "green"}
                        />
                      </Cell>
                      <Cell>
                        <Text>
                          {isComplete ? (
                            <Link
                              href={`/wiki/spaces/${spaceKey}/pages/${pageId}`}
                            >
                              View Report
                            </Link>
                          ) : (
                            "-"
                          )}
                        </Text>
                      </Cell>
                    </Row>
                  );
                }
              )}
            </Table>
          ) : (
            <SectionMessage title="No audits" appearance="info">
              <Text>
                No audits have been triggered yet. To get started, highlight a
                URL within a confluence page and use the "Audit Site" action.
              </Text>
            </SectionMessage>
          )}
        </Tab>
      </Tabs>
    </Fragment>
  );
};

export const run = render(
  <DashboardGadget>
    <App />
  </DashboardGadget>
);
