
export const auditSubmitter = async (queue, updateAudit, details) => {
    const jobId = await queue.push(details);
    const auditData = {
        ...details,
        status: "pending",
    }
    await updateAudit(details.url, details.contentId, auditData);
    const jobProgress = queue.getJob(jobId);
    const response = await jobProgress.getStats();
    const data = await response.json()
    return {...data, jobId}
}