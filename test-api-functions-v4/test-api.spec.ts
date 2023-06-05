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
import dotenv from 'dotenv';
dotenv.config();

const user = process.env.GITHUB_USER;
const repo = 'Test-Repo-1';

test.use({
  baseURL: 'https://api.github.com',
  extraHTTPHeaders: {
    'Accept': 'application/vnd.github.v3+json',
    // Add authorization token to all requests.
    'Authorization': `token ${process.env.API_TOKEN}`,
  }
});

test.beforeAll(async ({ request }) => {

  console.log('user', process.env.GITHUB_USER);  
  console.log('token', process.env.API_TOKEN);

  // Create repo
  const response = await request.post('/user/repos', {
    data: {
      name: repo
    }
  });
  console.log(JSON.stringify(response))

  // 422 === already created
  expect(response.ok() || response.status()===422).toBeTruthy();
});

test.afterAll(async ({ request }) => {
  // Delete repo
  const response = await request.delete(`/repos/${user}/${repo}`);
  console.log(`delete ${response.status()}`);
  expect(response.ok()).toBeTruthy();
});

test('should create bug report', async ({ request }) => {

  const newIssue = await request.post(`/repos/${user}/${repo}/issues`, {
    data: {
      title: '[Bug] report 1',
      body: 'Bug description',
    }
  });
  expect(newIssue.ok()).toBeTruthy();

  const issues = await request.get(`/repos/${user}/${repo}/issues`);
  expect(issues.ok()).toBeTruthy();
  expect(await issues.json()).toContainEqual(expect.objectContaining({
    title: '[Bug] report 1',
    body: 'Bug description'
  }));
});

test('should create feature request', async ({ request }) => {
  const newIssue = await request.post(`/repos/${user}/${repo}/issues`, {
    data: {
      title: '[Feature] request 1',
      body: 'Feature description',
    }
  });
  console.log(`newissue ${newIssue.status()}`)
  expect(newIssue.ok()).toBeTruthy();

  const issues = await request.get(`/repos/${user}/${repo}/issues`);
  console.log(`issues ${issues.status()}`)


  expect(issues.ok()).toBeTruthy();
  expect(await issues.json()).toContainEqual(expect.objectContaining({
    title: '[Feature] request 1',
    body: 'Feature description'
  }));
});
