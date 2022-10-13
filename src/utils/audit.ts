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
  return {...data};
};

const audit = async (auditURL) => {
  const results = await Promise.all([
    conductAudit(auditURL),
    greenFoundation(auditURL),
  ]);
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

    const { hosted_by_id, url, partner, modified, ...hostingInfo } = results[1];

    const MBWeight = audits["total-byte-weight"].numericValue / 1024 / 1024;

    const cachedWeight =
      MBWeight - audits["uses-long-cache-ttl"].numericValue / 1024 / 1024;

    const potentialImageSavings =
      audits["uses-responsive-images"].details.overallSavingsBytes /
      1024 /
      1024;

    const payload = {
      auditTimestamp: analysisUTCTimestamp,
      duration: total,
      pageWeight: MBWeight,
      pagePerformance: performance.score,
      stackPacks,
      hosting: hostingInfo,
      carbon: MBWeight * 10,
      carbonWithCache: MBWeight * 10 - cachedWeight * 10 + 0.5,
      potentialImageSavings,
      // fullAudit: audits,
    };
    return payload;
  } catch (error) {
    console.log(error);
    return null;
  }
};

export default audit;
