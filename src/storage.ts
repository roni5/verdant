import { storage, properties } from "@forge/api";
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

export async function getAuditsViaProperties(){
  const value = await  properties.onJiraProject("WCA").get("audits");
  if (value) {
    return value;
  } else {
    return [];
  }
}

export async function saveAudit(url, contentId, auditData) {
  const audits = await getAudits();
  const exisitingIndex = audits.findIndex((audit) => audit.url === url && audit.contentId === contentId);
  if (exisitingIndex > -1) {
    const current = audits[exisitingIndex];
    audits[exisitingIndex] = { ...current, url, ...auditData };
  } else {
    audits.push({ url, ...auditData });
  }
  await storage.set("audits", [...audits]);
  await properties.onJiraProject("WCA").set("audits", [...audits]);
  return audits;
}

async function clearAudits(contentId) {
  const audits = await getAudits();
  const newAudits = audits.filter((audit) => audit.contentId !== contentId);
  await storage.set("audits", newAudits);
  return newAudits;
}

async function clearAllAudits() {
  await storage.set("audits", []);
  return [];
}

export function useAuditsViaProperties(){
  const [audits, setAudits] = useState(() => getAuditsViaProperties());
  return {
    audits
  }
}
export function useAudits() {
  const [audits, setAudits] = useState(() => getAudits());
  return {
    audits,
    refreshAudits: async () =>{
      setAudits(await getAudits());
    },
    clearAllAudits: async () => {
      const newAudits = await clearAllAudits();
      setAudits(newAudits);
    },
    clearAudits: async (contentId) => {
      const newAudits = await clearAudits(contentId);
      setAudits(newAudits);
    },
    async updateAudit(url, contentId, auditData) {
      await saveAudit(url, contentId, auditData);
      const i = audits.findIndex((item) => item.url === url);
      if (i >= 0) {
        audits[i] = { ...auditData, url };
        setAudits(audits);
      }
    },
  };
}
