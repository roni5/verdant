export const auditPageCreator = (url, auditData) =>
  `<h3>✨ Overview</h3>
    <p><strong>URL:</strong> <a href="https://${url.replace(
      /&/g,
      "&amp;"
    )}">${url}</a></p>
    <p><strong>Audit Time:</strong> ${auditData.auditTimestamp}</p>
    <p><strong>Audit Duration:</strong> ${(auditData.duration / 1000).toFixed(
      2
    )} seconds</p>
    <p><b>Audit Score:</b> ${auditData.score}/5 </p>
    <h3>🏋️‍♀️ Page Weight</h3>
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
    <p>Assuming this page has 10,000 uncached visits throughout the year, it releases ${(auditData.carbon*10).toFixed(0)}kg of carbon, which is a equivalent to:</p>
    <ul>
    <li>
      <p>🐘 The weight as ${auditData.elephant.toFixed(0)} baby elephants.</p>
    </li>
    <li>
      <p>🚗 The amount of carbon your car would produce on a ${auditData.car.toFixed(0)} mile drive.</p>
    </li>
    <li>
      <p>🌲 The amount of carbon that ${auditData.tree.toFixed(0)} trees absorb in a year.</p>
    </li>
    <li>
      <p>💎 The amount of carbon released diamond mining for ${auditData.carbon.toFixed(0)} carats.</p>
    </li>
    </ul>
    <h3>⚡️ Performance</h3>
    <p>Your site has a performance score of ${(auditData.pagePerformance*100).toFixed(2)}%. This is ${auditData.pagePerformance < 0.69 ? "lower than average and you should take measures to address this.":"is above average and not a concern. Though it is always good to rerun these tests and make sure you are regularly checking these scores for change."}</p>
    <h3>🌎 Hosting</h3>
    ${
      auditData.data
        ? `<p>${
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
          ? `<p>Here are some supporting documents:</p>
      <ul>
        ${auditData.hosting.supporting_documents
          .map(
            ({ title, link }) =>
              `<li><a href=\"${link.replace(/&/g, "&amp;")}\">${title}</a></li>`
          )
          .join("")}
      </ul>`:``
      }`: `<p>We were not able to find any carbon information around the page's hosting. This normally means that the page is not on a green hosting.</p>`
    }
    <h3>💡 Suggested Actions</h3>${
      auditData.suggestedTasks.length > 0
        ? `${auditData.suggestedTasks
        .map(({ task, description, issue }) => {
          return `<p><strong>${task}</strong>: ${description}</p>
                <ac:structured-macro ac:name="jira">  
                <ac:parameter ac:name="columns">key</ac:parameter>  
                <ac:parameter ac:name="key">${issue.key}</ac:parameter>
              </ac:structured-macro>`;
        })
        .join("")}`: 
`No suggested tasks`
    }`;
