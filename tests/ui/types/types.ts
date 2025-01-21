import { Page } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { userFactory } from '../factories/userFactory';
import { HomePage } from '../pages/HomePage';
import { CartPage } from '../pages/CartPage';
import { CheckoutPage } from '../pages/CheckoutPage';    
import { MenuPage } from '../pages/MenuPage';

export type Fixture = {
  page: Page,
  loginPage: LoginPage,
  homePage: HomePage,
  user: userFactory,
  cartPage: CartPage,
  checkoutPage: CheckoutPage,
  menuPage: MenuPage
}