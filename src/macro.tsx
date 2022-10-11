import ForgeUI, {
  render,
  Badge,
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
} from "@forge/ui";
import { useAudits } from "./storage";

const App = () => {
  const { contentId } = useProductContext();
  const { audits } = useAudits();
  const pageRelatedAudits = audits.filter(
    (audit) => audit.contentId === contentId
  );
  if (pageRelatedAudits.length > 0) {
    return (
      <Tabs>
        <Tab label="Overview">
          <Table>
            <Head>
              <Cell>
                <Text>Website</Text>
              </Cell>
              <Cell>
                <Text>Status</Text>
              </Cell>
              <Cell>
                <Text>Actions</Text>
              </Cell>
            </Head>
            {pageRelatedAudits.map(({ url, status }) => (
              <Row>
                <Cell>
                  <Text>{url}</Text>
                </Cell>
                <Cell>
                  <Badge text={status}/>
                </Cell>
                <Cell>
                  <Text>
                    <Link openNewTab href="/">View Report</Link>
                  </Text>
                </Cell>
              </Row>
            ))}
          </Table>
        </Tab>
        <Tab label="Stats">
          <Text>Coming soon!</Text>
        </Tab>
        <Tab label="Settings">
          <Text>Clear audits</Text>
        </Tab>
      </Tabs>
    );
  }
  return (
    <SectionMessage title="No audits" appearance="info">
      <Text>
        No audits have been triggered within this page. To get started,
        highlight a URL within your confluence page and use the "Audit Site" action.
      </Text>
    </SectionMessage>
  );
};

export const run = render(<Macro app={<App />} />);
