export const auditPageCreator = (url, auditData) =>
  `<h3>Overview</h3>
    <p><strong>Audit Time:</strong> ${auditData.auditTimestamp}</p>
    <p><strong>Audit Duration:</strong> ${(auditData.duration / 1000).toFixed(
      2
    )} seconds</p>
    <p><b>Audit Score:</b> ${auditData.score}/5 </p>
    <h3>Page Weight</h3>
    <table class="confluenceTable">
      <tbody>
        <tr>
          <th class="confluenceTh">Visit Type</th>
          <th class="confluenceTh">Page Weight</th>
          <th class="confluenceTh">Carbon Emitted</th>
        </tr>
        <tr>
          <td class="confluenceTd"><b>Uncached</b></td>
          <td class="confluenceTd">${auditData.pageWeight.toFixed(2)}MB</td>
          <td class="confluenceTd">${auditData.carbon.toFixed(2)}g</td>
        </tr>
        <tr>
          <td class="confluenceTd"><b>Cached</b></td>
          <td class="confluenceTd">${auditData.cachedWeight.toFixed(2)}MB</td>
          <td class="confluenceTd">${auditData.carbonWithCache.toFixed(2)}g</td>
        </tr>
      </tbody>
    </table>
    <p>Not sure what these results mean? Click here to learn more about carbon equivalents here.</p>
    <h3>Performance</h3>
    <p>...</p>
    <h3>Hosting</h3>
    <p>${
      auditData.hosting.url
    } is hosted on <a href=\"${auditData.hosting.hosted_by_website.replace(
    /&/g,
    "&amp;"
  )}\">${
    auditData.hosting.hosted_by
  }</a> which the green web foundation considers to be ${
    auditData.hosting ? "green" : "not green"
  }.</p>
    ${
      auditData.hosting.supporting_documents.length > 0
        ? `
    <p>Here are some supporting documents:</p>
    <ul>
      ${auditData.hosting.supporting_documents
        .map(
          ({ title, link }) =>
            `<li><a href=\"${link.replace(/&/g, "&amp;")}\">${title}</a></li>`
        )
        .join("")}
    </ul>`
        : ``
    }
    <h3>Suggested Actions</h3>
    <p>...</p>
    `;
