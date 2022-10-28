import ForgeUI, {
  render,
  Fragment,
  DashboardGadget,
  Text,
  useProductContext,
  Form,
  useState,
  Strong,
  Badge,
  Button,
  TextField,
} from "@forge/ui";
import { Queue } from "@forge/events";
import { isValidURLWithOrWithoutProtocol } from "./utils/functions";
import { useAudits } from "./storage";
import { auditSubmitter } from "./utils/auditSubmitter";



const App = () => {
  const { contentId, accountId, spaceKey } =
    useProductContext();

  const queue = new Queue({ key: "audit-queue" });
  const { updateAudit } = useAudits();
  const [submitted, setSubmitted] = useState(false);
  const [valid, setValid] = useState(true);
  const [jobId, setJobId] = useState("");
  const [jobResponse, setJobResponse] = useState(null);

  const submitAudit = async (formData) => {
    const { url } = formData;
    const isValid = isValidURLWithOrWithoutProtocol(url);
    setValid(isValid);
    setSubmitted(true);
    if(!isValid) {
      return;
    }
    const { success, inProgress, failed, jobId } = await auditSubmitter(queue, updateAudit, { url, spaceKey, contentId, accountId})
    setJobId(jobId);
    setJobResponse({ success, inProgress, failed });
  };

  if(!valid && submitted) {
    return   <Fragment>
    <Text>
      <Badge appearance="removed" text="Error" />{" "}
      <Strong>Site not recognised.</Strong>
    </Text>
    <Text>The entered text is not a valid URL.</Text>
    <Button text='Retry' onClick={() => {
      setSubmitted(false);
    }}/>
  </Fragment>
  }


  return (
    <Fragment>
      {submitted ? (
        <Fragment>
          {/* {jobResponse && <Text>{JSON.stringify(jobResponse)}</Text>} */}
          <Text>
            <Badge appearance="added" text="Site Added" />{" "}
            <Strong>Success!</Strong>
          </Text>
          <Text>
            This URL has been added to the queue and will be audited soon.
          </Text>
          <Button text="Audit another" onClick={() => setSubmitted(false)} />
        </Fragment>
      ) : (
        <Fragment>
          <Text>
             This gadget adds a desired URL to the audit queue - Verdant will analyse the site and add any required actions to JIRA.
          </Text>
          <Form onSubmit={submitAudit} >
            <TextField name="url" label="URL" />
          </Form>
        </Fragment>
      )}
    </Fragment>
  );
};

export const run = render(
  <DashboardGadget>
    <App />
  </DashboardGadget>
);
