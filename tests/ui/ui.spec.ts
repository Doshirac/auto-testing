import { test, expect, Page } from '@playwright/test';

async function login({ page }, username: string = 'standard_user', password: string = 'secret_sauce') {
  await page.goto('https://www.saucedemo.com/');
  await page.locator('[data-test="username"]').fill(username);
  await page.locator('[data-test="password"]').fill(password);
  await page.locator('[data-test="login-button"]').click();
}

async function addToCart({ page }: { page: Page }, productTestId: string) {
  const addToCartSelector = `[data-test="add-to-cart-${productTestId}"]`;
  await expect(page.locator(addToCartSelector)).toBeVisible();
  await page.click(addToCartSelector);
}

const cartBadgeSelector = '[data-test="shopping-cart-badge"]';
const cartButtonSelector = '[data-test="shopping-cart-link"]';
const cartItemsSelector = '[data-test="inventory-item"]';
const inventoryItemNameSelector = '[data-test="inventory-item-name"]';

const PRODUCTS = {
  backpack: 'sauce-labs-backpack',
  bikeLight: 'sauce-labs-bike-light',
};

test.describe('SauceDemo E2E Tests', () => {

  test.describe('Login, Adding Items to Cart, Checkout Process for Multiple Items and Logout Tests', () => {
    
    test.beforeEach(async ({ page }) => {
      await login({ page });
    });

    test('Test Case 1: Verify User Login', async ({ page }) => {
      const appLogo = page.locator('.app_logo');
      await expect(appLogo).toHaveText('Swag Labs');
    });

    test('Test Case 2: Verify Cart', async ({ page }) => {
      await addToCart({ page }, PRODUCTS.backpack);

      const cartBadge = page.locator(cartBadgeSelector);
      await expect(cartBadge).toHaveText('1');

      await expect(page.locator(cartButtonSelector)).toBeVisible();
      await page.click(cartButtonSelector);

      await page.waitForURL('https://www.saucedemo.com/cart.html');

      const cartItems = page.locator(cartItemsSelector);
      await expect(cartItems).toHaveCount(1);

      const backpackItem = page.locator(inventoryItemNameSelector, { hasText: 'Sauce Labs Backpack' });
      await expect(backpackItem).toBeVisible();
    });

    test('Test Case 3: Verify Adding Multiple Items to Cart', async ({ page }) => {
      await addToCart({ page }, PRODUCTS.backpack);
      await addToCart({ page }, PRODUCTS.bikeLight);

      const cartBadge = page.locator(cartBadgeSelector);
      await expect(cartBadge).toHaveText('2');

      await page.click(cartButtonSelector);
      await page.waitForURL('https://www.saucedemo.com/cart.html');

      const cartItems = page.locator(cartItemsSelector);
      await expect(cartItems).toHaveCount(2);

      const backpackItem = page.locator(inventoryItemNameSelector, { hasText: 'Sauce Labs Backpack' });
      const bikeLightItem = page.locator(inventoryItemNameSelector, { hasText: 'Sauce Labs Bike Light' });

      await expect(backpackItem).toBeVisible();
      await expect(bikeLightItem).toBeVisible();
    });

    test('Test Case 6: Verify Checkout Process for Multiple Items', async ({ page }) => {
      await addToCart({ page }, PRODUCTS.backpack);
      await addToCart({ page }, PRODUCTS.bikeLight);

      const cartBadge = page.locator(cartBadgeSelector);
      await expect(cartBadge).toHaveText('2');

      await page.click(cartButtonSelector);
      await page.waitForURL('https://www.saucedemo.com/cart.html');

      const cartItems = page.locator(cartItemsSelector);
      await expect(cartItems).toHaveCount(2);

      await page.click('[data-test="checkout"]');
      await page.waitForURL('https://www.saucedemo.com/checkout-step-one.html');

      await page.fill('[data-test="firstName"]', 'John');
      await page.fill('[data-test="lastName"]', 'Dou');
      await page.fill('[data-test="postalCode"]', '12345');
      await page.click('[data-test="continue"]');

      await page.waitForURL('https://www.saucedemo.com/checkout-step-two.html');

      const summaryTotal = page.locator('[data-test="total-label"]');
      await expect(summaryTotal).toHaveText('Total: $43.18');

      await page.click('[data-test="finish"]');
      await page.waitForURL('https://www.saucedemo.com/checkout-complete.html');

      const completeOrderHeader = page.locator('[data-test="complete-header"]');
      await expect(completeOrderHeader).toHaveText('Thank you for your order!');
    });

    test('Test Case 7: Verify Non-Existing User Is Not Able to Login', async ({ page }) => {
      await login({ page }, 'standard_user_123', 'secret_sauce_123');

      await expect(page).not.toHaveURL('https://www.saucedemo.com/inventory.html');

      const errorMessage = page.locator('.error-message-container');
      await expect(errorMessage).toBeVisible();
      await expect(errorMessage).toHaveText('Epic sadface: Username and password do not match any user in this service');
    });

    test('Test Case 8: Verify User is Able to Logout', async ({ page }) => {
      await page.click('#react-burger-menu-btn');

      const burgerMenu = page.locator('.bm-menu');
      await expect(burgerMenu).toBeVisible();

      await page.click('[data-test="logout-sidebar-link"]');

      await expect(page.locator('[data-test="username"]')).toBeVisible();
      await expect(page.locator('[data-test="password"]')).toBeVisible();
      await expect(page.locator('[data-test="login-button"]')).toBeVisible();
    });
  });

  test.describe('Removing from Cart and Checkout Process for One Items Tests', () => {
    test.beforeEach(async ({ page }) => {
      await login({ page });
      await addToCart({ page }, PRODUCTS.backpack);
      await page.click(cartButtonSelector);
      await page.waitForURL('https://www.saucedemo.com/cart.html');
    });

    test('Test Case 4: Verify Removing Item from Cart', async ({ page }) => {
      const cartBadge = page.locator(cartBadgeSelector);
      const cartItems = page.locator(cartItemsSelector);
      await expect(cartItems).toHaveCount(1);

      const backpackItem = page.locator(inventoryItemNameSelector, { hasText: 'Sauce Labs Backpack' });
      await expect(backpackItem).toBeVisible();

      await page.click('[data-test="remove-sauce-labs-backpack"]');

      await expect(cartItems).toHaveCount(0);
      await expect(cartBadge).toBeHidden();
    });

    test('Test Case 5: Verify Checkout Process', async ({ page }) => {
      const backpackItem = page.locator(inventoryItemNameSelector, { hasText: 'Sauce Labs Backpack' });
      await expect(backpackItem).toBeVisible();

      await page.click('[data-test="checkout"]');
      await page.waitForURL('https://www.saucedemo.com/checkout-step-one.html');

      await page.fill('[data-test="firstName"]', 'John');
      await page.fill('[data-test="lastName"]', 'Dou');
      await page.fill('[data-test="postalCode"]', '12345');
      await page.click('[data-test="continue"]');

      await page.waitForURL('https://www.saucedemo.com/checkout-step-two.html');

      const summaryTotal = page.locator('[data-test="total-label"]');
      await expect(summaryTotal).toHaveText('Total: $32.39');

      await page.click('[data-test="finish"]');
      await page.waitForURL('https://www.saucedemo.com/checkout-complete.html');

      const completeOrderHeader = page.locator('[data-test="complete-header"]');
      await expect(completeOrderHeader).toHaveText('Thank you for your order!');
    });
  });
});