/* eslint-disable notice/notice */

/**
 * In this script, we will login and run a few tests that use GitHub API.
 *
 * Steps summary
 * 1. Create a new repo.
 * 2. Run tests that programmatically create new issues.
 * 3. Delete the repo.
 */

import { test, expect } from '@playwright/test';

test.use({
  baseURL: 'http://localhost:7071',
  extraHTTPHeaders: {
    //'Accept': 'application/vnd.github.v3+json',
    // Add authorization token to all requests.
    //'Authorization': `token ${process.env.API_TOKEN}`,
  }
});

test.beforeAll(async ({ request }) => {

});

test.afterAll(async ({ request }) => {

});

test('should return status', async ({ request }) => {

  const statusResult = await request.get(`/api/status`);
  expect(statusResult.ok()).toBeTruthy();

  const status = await statusResult.json();
  expect(status?.env?.AZURE_FUNCTIONS_ENVIRONMENT).toEqual('Development');
});

// test('should create feature request', async ({ request }) => {
//   const newIssue = await request.post(`/repos/${user}/${repo}/issues`, {
//     data: {
//       title: '[Feature] request 1',
//       body: 'Feature description',
//     }
//   });
//   console.log(`newissue ${newIssue.status()}`)
//   expect(newIssue.ok()).toBeTruthy();

//   const issues = await request.get(`/repos/${user}/${repo}/issues`);
//   console.log(`issues ${issues.status()}`)


//   expect(issues.ok()).toBeTruthy();
//   expect(await issues.json()).toContainEqual(expect.objectContaining({
//     title: '[Feature] request 1',
//     body: 'Feature description'
//   }));
// });
