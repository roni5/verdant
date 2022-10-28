import { fetch } from "@forge/api";
import greenFoundation from "./greenFoundation";

const addProtocolIfMissing = (url: string) => {
  if (!url.startsWith("http")) {
    return `https://${url}`;
  }
  return url;
};

const conductAudit = async (url) => {
  const APIKEY = process.env.GOOGLEPAGESPEED_APIKEY;
  const response = await fetch(
    `https://www.googleapis.com/pagespeedonline/v5/runPagespeed?url=${addProtocolIfMissing(
      url
    )}&key=${APIKEY}`
  );
  const data = await response.json();
  return { ...data };
};

const audit = async (auditURL) => {
  const results = await Promise.all([
    conductAudit(auditURL),
    greenFoundation(auditURL),
  ]);
  console.log(results);
  try {
    const {
      lighthouseResult: {
        audits,
        categories: { performance },
        timing: { total },
      },
      analysisUTCTimestamp,
      stackPacks,
    } = results[0];

    const { hosted_by_id, partner, modified, ...hostingInfo } = results[1];

    const MBWeight = audits["total-byte-weight"].numericValue / 1024 / 1024;

    const cachedWeight =
      MBWeight - audits["uses-long-cache-ttl"].numericValue / 1024 / 1024;

    const potentialImageSavings =
      audits["uses-responsive-images"].details.overallSavingsBytes /
      1024 /
      1024;
    const carbon = (MBWeight * 10)
    const payload = {
      auditTimestamp: analysisUTCTimestamp,
      duration: total,
      pageWeight: MBWeight,
      pagePerformance: performance.score,
      stackPacks,
      hosting: hostingInfo,
      carbon,
      carbonWithCache: MBWeight * 10 - cachedWeight * 10 + 0.5,
      potentialImageSavings,
      cachedWeight,
      elephant: Math.ceil((carbon*10) / 120),
      car: Math.ceil((carbon * 10000) / 351),
      tree: Math.ceil((carbon * 10) / 21),
      diamond: Math.ceil((carbon * 10) / 55),
      // fullAudit: audits,
    };

    let scores = [
      payload.hosting.green === true,
      payload.pagePerformance > 0.69,
      payload.pageWeight < 2.5,
      payload.carbonWithCache / payload.carbon < 0.3,
    ];

    let scoreTasks = [
      "Switch to Green Hosting",
      "Improve Page Performance",
      "Reduce Page Weight",
      "Increase Cached Resources",
    ];
    let scoreDesc = [
      "As a developer, I want to switch this domain to green hosting. Doing so will reduce the amount of energy used by our servers.",
      "As a developer, I want to make this webpage more performant. This will reduce the amount of energy used by the client when visiting this page.",
      "As a developer, I want to reduce the page weight of this webpage. Doing so will reduce the amount of energy required to send our webpage to the client.",
      "As a developer, I want to increase the amount of cached resources to at least 30% of page weight. Doing so will reduce the amount of data that we will need to send to a client on a repeat visit.",
    ];

    const suggestedTasks = [];

    scores.forEach((score, index) => {
      if (!score) {
        suggestedTasks.push({
          task: scoreTasks[index],
          description: scoreDesc[index],
        });
      }
    });

    const score = scores.filter((item) => item === true).length + 1;

    return { ...payload, score, suggestedTasks };
  } catch (error) {
    console.log(error);
    return null;
  }
};

export default audit;
