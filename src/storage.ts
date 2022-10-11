import { storage } from "@forge/api";
import { useState } from "@forge/ui";

function auditKey(term) {
  return `audit-${term}`;
}

export async function getAudit(url) {
  const value = await storage.get(auditKey(url));

  if (value) {
    return value;
  }
}

export async function getAudits() {
  const value = await storage.get("audits");
  if (value) {
    return value;
  } else {
    return [];
  }
}

async function saveAudit(url, auditData) {
  const audits = await getAudits();
  const newAudits = [...audits, { ...auditData, url }];
  return await storage.set("audits", newAudits);
}

export function useAudits() {
  const [audits, setAudits] = useState(() => getAudits());
  return {
    audits,
    async updateAudit(url, auditData) {
      await saveAudit(url, auditData);
      const i = audits.findIndex((item) => item.url === url);
      if (i >= 0) {
        audits[i] = { ...auditData, url };
        setAudits(audits);
      }
    },
  };
}
