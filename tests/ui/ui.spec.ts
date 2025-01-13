import { expect } from '@playwright/test';
import { extendedTest } from './fixtures/extendedTest';

const PRODUCTS = {
  backpack: 'sauce-labs-backpack',
  bikeLight: 'sauce-labs-bike-light',
};

extendedTest.describe('SauceDemo E2E Tests', () => {
  extendedTest.describe('Login, Adding Items to Cart, Checkout Process for Multiple Items and Logout Tests', () => {
    
    extendedTest.beforeEach(async ({ loginPage, user, page }) => {
      await loginPage.page.goto('https://www.saucedemo.com/');
      await loginPage.login(user.validUser);
    });

    extendedTest('Test Case 1: Verify User Login', async ({ homePage }) => {
      await expect(homePage.logo).toHaveText('Swag Labs');
    });

    extendedTest('Test Case 2: Verify Cart', async ({ homePage, cartPage }) => {
      await homePage.addToCart(PRODUCTS.backpack);
      expect(homePage.badge).toHaveText('1');

      await homePage.button.click();
      await expect(cartPage.page).toHaveURL(/.*cart.html/);

      await expect(cartPage.cartItems).toHaveCount(1);
      await expect(cartPage.page.locator('[data-test="inventory-item-name"]', { hasText: 'Sauce Labs Backpack' })).toBeVisible();
    });

    extendedTest('Test Case 3: Verify Adding Multiple Items to Cart', async ({ homePage, cartPage }) => {
      await homePage.addToCart(PRODUCTS.backpack);
      await homePage.addToCart(PRODUCTS.bikeLight);
      expect(homePage.badge).toHaveText('2');

      await homePage.button.click();
      await expect(cartPage.cartItems).toHaveCount(2);
    });

    extendedTest('Test Case 6: Verify Checkout Process for Multiple Items', 
      async ({ homePage, cartPage, checkoutPage }) => {
        await homePage.addToCart(PRODUCTS.backpack);
        await homePage.addToCart(PRODUCTS.bikeLight);
        expect(homePage.badge).toHaveText('2');

        await homePage.button.click();
        await expect(cartPage.cartItems).toHaveCount(2);

        await cartPage.checkoutButton.click();
        await expect(cartPage.page).toHaveURL(/.*checkout-step-one.html/);
        
        await checkoutPage.fillCheckoutDetails('John', 'Dou', '12345');
        await checkoutPage.continueButton.click();
        await expect(cartPage.page).toHaveURL(/.*checkout-step-two.html/);

        const summaryTotal = cartPage.page.locator('[data-test="total-label"]');
        await expect(summaryTotal).toHaveText('Total: $43.18');

        await checkoutPage.finishButton.click();
        await expect(cartPage.page).toHaveURL(/.*checkout-complete.html/);

        const completeOrderHeader = cartPage.page.locator('[data-test="complete-header"]');
        await expect(completeOrderHeader).toHaveText('Thank you for your order!');
      }
    );

    extendedTest('Test Case 7: Verify Non-Existing User Is Not Able to Login', 
      async ({ loginPage, user, page }) => {
        await loginPage.page.goto('https://www.saucedemo.com/');
        await loginPage.login(user.invalidUser);

        await expect(page).not.toHaveURL(/.*inventory.html/);
        const errorMessage = page.locator('.error-message-container');
        await expect(errorMessage).toBeVisible();
        await expect(errorMessage).toHaveText('Epic sadface: Username and password do not match any user in this service');
      }
    );

    extendedTest('Test Case 8: Verify User is Able to Logout', async ({ page, menuPage }) => {
      await menuPage.menuButton.click();
      await expect(menuPage.menuPanel).toBeVisible();
      await menuPage.logoutLink.click();

      await expect(page.locator('[data-test="username"]')).toBeVisible();
      await expect(page.locator('[data-test="password"]')).toBeVisible();
      await expect(page.locator('[data-test="login-button"]')).toBeVisible();
    });
  });

  extendedTest.describe('Removing from Cart and Checkout Process for One Item Tests', () => {
    extendedTest.beforeEach(async ({ page, loginPage, user, homePage }) => {
      await loginPage.page.goto('https://www.saucedemo.com/');
      await loginPage.login(user.validUser);
      await homePage.addToCart(PRODUCTS.backpack);
      await homePage.button.click();
      await expect(page).toHaveURL(/.*cart.html/);
    });

    extendedTest('Test Case 4: Verify Removing Item from Cart', async ({ cartPage, homePage }) => {
      await expect(cartPage.cartItems).toHaveCount(1);

      await cartPage.removeItem(PRODUCTS.backpack);

      await expect(cartPage.cartItems).toHaveCount(0);

      const badge = homePage.page.locator('[data-test="shopping-cart-badge"]');
      await expect(badge).toBeHidden();
    });

    extendedTest('Test Case 5: Verify Checkout Process', async ({ cartPage, checkoutPage }) => {
      const backpackItem = cartPage.page.locator('[data-test="inventory-item-name"]', { hasText: 'Sauce Labs Backpack'});
      await expect(backpackItem).toBeVisible();

      await cartPage.checkoutButton.click();
      await expect(cartPage.page).toHaveURL(/.*checkout-step-one.html/);

      await checkoutPage.fillCheckoutDetails('John', 'Dou', '12345');
      await checkoutPage.continueButton.click();
      await expect(cartPage.page).toHaveURL(/.*checkout-step-two.html/);

      const summaryTotal = cartPage.page.locator('[data-test="total-label"]');
      await expect(summaryTotal).toHaveText('Total: $32.39');

      await checkoutPage.finishButton.click();
      await expect(cartPage.page).toHaveURL(/.*checkout-complete.html/);

      const completeOrderHeader = cartPage.page.locator('[data-test="complete-header"]');
      await expect(completeOrderHeader).toHaveText('Thank you for your order!');
    });
  });
});
