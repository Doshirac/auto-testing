import { BasePage } from "./BasePage";

export class HomePage extends BasePage {
    logo = this.page.locator('.app_logo');
    badge = this.page.locator('[data-test="shopping-cart-badge"]');
    button = this.page.locator('[data-test="shopping-cart-link"]');

    async addToCart(productTestId: string) {
        await this.page.locator(`[data-test="add-to-cart-${productTestId}"]`).click();
    }

    async removeFromCart(productTestId: string) {
        await this.page.locator(`[data-test="remove-${productTestId}"]`).click();
    }
}
