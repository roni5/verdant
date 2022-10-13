import ForgeUI, {
  render,
  Fragment,
  ContextMenu,
  Text,
  InlineDialog,
  useProductContext,
  ModalDialog,
  useState,
  ContextMenuExtensionContext,
  Strong,
  Badge,
  Button,
} from "@forge/ui";
import { Queue } from "@forge/events";
import { isValidURLWithOrWithoutProtocol } from "./utils/functions";
import { useAudits } from "./storage";

const ErrorMessage = () => {
  return (
    <InlineDialog>
      <Text>
        <Badge appearance="removed" text="Error" />{" "}
        <Strong>Site not recognised.</Strong>
      </Text>
      <Text>The selected text is not a valid URL.</Text>
    </InlineDialog>
  );
};

const App = () => {
  const { extensionContext, contentId, accountId, spaceKey } =
    useProductContext();

  const queue = new Queue({ key: "audit-queue" });
  const { updateAudit } = useAudits();
  const [submitted, setSubmitted] = useState(false);
  const [jobId, setJobId] = useState("");
  const [jobResponse, setJobResponse] = useState(null);

  let url = (extensionContext as ContextMenuExtensionContext)?.selectedText;
  const isValid = isValidURLWithOrWithoutProtocol(url);

  if (!contentId) {
    return null;
  }

  if (!isValid) {
    return <ErrorMessage />;
  }

  const submitAudit = async () => {
    const jobId = await queue.push({ url, spaceKey });
    await updateAudit(url, {
      status: "pending",
      url,
      contentId,
      accountId,
      jobId,
      spaceKey,
    });
    setSubmitted(true);
    setJobId(jobId);
    const jobProgress = queue.getJob(jobId);
    const response = await jobProgress.getStats();
    const { success, inProgress, failed } = await response.json();
    setJobResponse({ success, inProgress, failed });
  };

  const refreshJobStatus = async () => {
    const jobProgress = queue.getJob(jobId);
    const response = await jobProgress.getStats();
    const { success, inProgress, failed } = await response.json();
    setJobResponse({ success, inProgress, failed });
  };

  return (
    <ModalDialog header="Carbon Auditor" onClose={() => {}}>
      {submitted ? (
        <Fragment>
          {jobResponse && <Text>{JSON.stringify(jobResponse)}</Text>}
          <Text>
            <Badge appearance="added" text="Site Added" />{" "}
            <Strong>Success!</Strong>
          </Text>
          <Text>
            This URL has been added to the queue and will be audited soon.
          </Text>
          <Button text="Refresh" onClick={refreshJobStatus} />
        </Fragment>
      ) : (
        <Fragment>
          <Text>
            <Badge appearance="added" text="Site Added" />{" "}
            <Strong>Ready to audit {url}?</Strong>
          </Text>
          <Text>Click the button below to add.</Text>
          <Button onClick={submitAudit} text="Audit" />
        </Fragment>
      )}
    </ModalDialog>
  );
};

export const run = render(
  <ContextMenu>
    <App />
  </ContextMenu>
);
