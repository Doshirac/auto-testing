import { test, expect } from '@playwright/test';

test('GET posts', async ({ request }) => {
    const response = await request.get('https://jsonplaceholder.typicode.com/posts');
    expect(response.status()).toEqual(200);

    const data = await response.json();
    expect(Array.isArray(data)).toBe(true);
    expect(data.length).toBeGreaterThan(0);
});

test('GET comments by postId', async ({ request }) => {
    const id = 2;
    const response = await request.get(`https://jsonplaceholder.typicode.com/comments?postId=${id}`);
    expect(response.status()).toEqual(200);

    const data = await response.json();
    expect(Array.isArray(data)).toBe(true);
    expect(data.length).toBeGreaterThan(0);

    data.forEach(comment => {
        expect(comment.postId).toEqual(id);
    });
});

test('POST create a new post', async ({ request }) => {
    const testBody = {
        "title": "test title",
        "body": "test body",
        "userId": 1
    };

    const response = await request.fetch('https://jsonplaceholder.typicode.com/posts', {
        method: 'POST',
        data: testBody
    });

    expect(response.status()).toEqual(201);

    const data = await response.json();
    expect(data.id).toEqual(101);
    expect(data.title).toEqual(testBody.title);
    expect(data.body).toEqual(testBody.body);
    expect(data.userId).toEqual(testBody.userId);
});

test('GraphQL query to fetch episodes containing "Rick"', async ({ request }) => {
    const query = `
      query {
        episodes(filter: { name: "Rick" }) {
          results {
            name
          }
        }
      }
    `;
  
    const response = await request.post('https://rickandmortyapi.com/graphql', {
      headers: {
        'Content-Type': 'application/json',
      },
      data: {
        query,
      },
    });
  
    expect(response.status()).toBe(200);
  
    const responseData = await response.json();
    const episodes = responseData.data.episodes.results;
  
    episodes.forEach(episode => {
        expect(episode.name.toLowerCase()).toContain('rick');
    });
});