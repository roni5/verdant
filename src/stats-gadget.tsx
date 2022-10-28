import ForgeUI, {
  render,
  DashboardGadget,
  Text,
  Fragment,
  Row,
  Tag,
  Cell,
  Table,
  Strong,
  SectionMessage,
} from "@forge/ui";
import { useAuditsViaProperties } from "./storage";

const App = () => {
  const { audits } = useAuditsViaProperties();

  if (audits.length === 0) {
    return (
      <SectionMessage title="No audits" appearance="info">
        <Text>
          No audits have been triggered yet. To get started, highlight a URL
          within a confluence page and use the "Audit Site" action.
        </Text>
      </SectionMessage>
    );
  }

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

  const scoreKeys = [
    "pagePerformance",
    "pageWeight",
    "cachedWeight",
    "carbon",
    "carbonWithCache",
    "score",
    "elephant",
    "car",
    "tree",
    "diamond",
    "green",
  ];

  const averageScores = auditsWithUniqueUrls.reduce((acc, audit) => {
    scoreKeys.forEach((key) => {
      if (!acc[key]) {
        acc[key] = 0;
      }
      if (audit[key]) {
        acc[key] += audit[key];
      }
    });
    return acc;
  }, {});

  scoreKeys.forEach((key) => {
    if (averageScores[key]) {
      averageScores[key] = averageScores[key] / auditsWithUniqueUrls.length;
    }
  });
  return (
    <Fragment>
      <Text>
        Statistics here reflect the average of all verdant audits using the
        latest report for each unique URL. {"\n"}
      </Text>
      <Table>
        <Row>
          <Cell>
            <Text>
              <Strong>Carbon</Strong>
            </Text>
          </Cell>
        </Row>
        <Row>
          <Cell>
            <Text>
              <Tag
                text={`${averageScores.carbon.toFixed(1)}g`}
                color={
                  averageScores.carbon > 0.8
                    ? "green"
                    : averageScores.carbon > 0.5
                    ? "yellow"
                    : "red"
                }
              />{" "}
              Carbon
            </Text>
          </Cell>
          <Cell>
            <Text>
              {" "}
              <Tag
                text={`${averageScores.carbonWithCache.toFixed(1)}g`}
                color={
                  averageScores.carbonWithCache > 0.8
                    ? "green"
                    : averageScores.carbonWithCache > 0.5
                    ? "yellow"
                    : "red"
                }
              />{" "}
              Carbon with Cache
            </Text>
          </Cell>
        </Row>
        <Row>
          <Cell>
            <Text>
              <Strong>Performance</Strong>
            </Text>
          </Cell>
        </Row>
        <Row>
          <Cell>
            <Text>
              <Tag
                text={`${averageScores.pageWeight.toFixed(1)}MB`}
                color={
                  averageScores.pageWeight < 3
                    ? "green"
                    : averageScores.pageWeight < 5
                    ? "yellow"
                    : "red"
                }
              />{" "}
              Page Weight
            </Text>
          </Cell>
          <Cell>
            <Text>
              <Tag
                text={`${(averageScores.pagePerformance * 100).toFixed(1)}%`}
                color={
                  averageScores.pagePerformance > 0.8
                    ? "green"
                    : averageScores.pagePerformance > 0.5
                    ? "yellow"
                    : "red"
                }
              />{" "}
              JS Performance
            </Text>
          </Cell>
        </Row>
        <Row>
          <Cell>
            <Text>
              <Tag
                text={`${averageScores.cachedWeight.toFixed(1)}MB`}
                color={
                  averageScores.cachedWeight < 3
                    ? "green"
                    : averageScores.cachedWeight < 5
                    ? "yellow"
                    : "red"
                }
              />{" "}
              Page Weight (Cached)
            </Text>
          </Cell>
        </Row>
        <Row>
          <Cell>
            <Text>
              <Strong>Hosting</Strong>
            </Text>
          </Cell>
        </Row>
        <Row>
          <Cell>
            <Text>
              <Tag
                text={`${(averageScores.green * 100).toFixed(1)}%`}
                color={
                  averageScores.green > 0.8
                    ? "green"
                    : averageScores.green > 0.5
                    ? "yellow"
                    : "red"
                }
              />{" "}
              Green Hosting
            </Text>
          </Cell>
        </Row>
      </Table>
      <Text>
        10,000 uncached site visits produces{" "}
        {`${(averageScores.carbon * 10).toFixed(1)}kg`} which is equivalent to:
      </Text>
      <Text>
        - 🚗 Emissions emitted from {Math.ceil(averageScores.car)} miles of
        driving.
      </Text>
      <Text>
        - 🐘 The weight of {Math.ceil(averageScores.elephant)} baby elephants.
      </Text>
      <Text>
        - 🌲 The amount of carbon that {averageScores.tree.toFixed(0)} trees
        absorb in a year.
      </Text>
      <Text>
        - 💎 The amount of carbon released diamond mining for{" "}
        {averageScores.carbon.toFixed(0)} carats.
      </Text>
    </Fragment>
  );
};

export const run = render(
  <DashboardGadget>
    <App />
  </DashboardGadget>
);
