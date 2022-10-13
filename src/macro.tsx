import ForgeUI, {
  render,
  Badge,
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
  Link,
  Button,
  Fragment,
  Heading,
  Strong,
} from "@forge/ui";
import { useAudits } from "./storage";

const App = () => {
  const { contentId } = useProductContext();
  const { audits, clearAllAudits, clearAudits, refreshAudits } = useAudits();
  const pageRelatedAudits = audits.filter(
    (audit) => audit.contentId === contentId
  );

  return (
    <Fragment>
      <Heading size="medium">WebCarbon Reports</Heading>
      <Tabs>
        <Tab label="Overview">
          {pageRelatedAudits.length > 0 ? (
            <Table>
              <Head>
                <Cell>
                  <Text>Webpage</Text>
                </Cell>
                <Cell>
                  <Text>Status</Text>
                </Cell>
                <Cell>
                  <Text>Score</Text>
                </Cell>
                <Cell>
                  <Text>Actions</Text>
                </Cell>
              </Head>
              {pageRelatedAudits.map(
                ({ url, status, spaceKey, pageId, score }) => {
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
                          text={status}
                          color={isComplete ? "green" : "grey"}
                        />
                      </Cell>
                      <Cell>
                        {isComplete ? (
                          <Tag
                            text={score + " / 5"}
                            color={
                              score > 3 ? "green" : score > 1 ? "yellow" : "red"
                            }
                          />
                        ) : (
                          <Text>-</Text>
                        )}
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
                No audits have been triggered within this page. To get started,
                highlight a URL within your confluence page and use the "Audit
                Site" action.
              </Text>
            </SectionMessage>
          )}
          <Button text="Refresh" onClick={() => refreshAudits()} />
        </Tab>
        {pageRelatedAudits.length > 0 && (
          <Tab label="Stats">
            <Text>Coming soon!</Text>
          </Tab>
        )}
        <Tab label="Settings">
          <Text>Clear page audits</Text>
          <Button text="Clear" onClick={() => clearAudits(contentId)} />
          <Text>Clear all audits</Text>
          <Button text="Clear" onClick={() => clearAllAudits()} />
        </Tab>
      </Tabs>
    </Fragment>
  );
};

export const run = render(<Macro app={<App />} />);
