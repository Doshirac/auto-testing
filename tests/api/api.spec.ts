import { test, expect } from '@playwright/test';

test('GET request', async ({ request }) => {
    const apiResponse = await request.get('https://jsonplaceholder.typicode.com/posts/1');

    expect(apiResponse.status()).toBe(200);
    const responseData = await apiResponse.json();
    expect(responseData.id).toBe(1);
});
