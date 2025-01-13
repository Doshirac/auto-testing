import { test, Page } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { userFactory } from '../factories/userFactory';
import { HomePage } from '../pages/HomePage';
import { CartPage } from '../pages/CartPage';
import { CheckoutPage } from '../pages/CheckoutPage';
import { MenuPage } from '../pages/MenuPage';
import { Fixture } from '../types/types';

export const extendedTest = test.extend<Fixture>({
  loginPage: async ({ page }, use) => {
    await use(new LoginPage({page}));
  },
  homePage: async ({ page }, use) => {
    await use(new HomePage({page}));
  },
  user: async ({}, use) => {
    await use(new userFactory());
  },
  cartPage: async ({ page }, use) => {
    await use(new CartPage({page}));
  },
  checkoutPage: async ({ page }, use) => {
    await use(new CheckoutPage({page}));
  },
  menuPage: async ({ page }, use) => {
    await use(new MenuPage({page}));
  },
});
