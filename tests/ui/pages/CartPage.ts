import { BasePage } from "./BasePage";

export class CartPage extends BasePage {
    cartItems = this.page.locator('[data-test="inventory-item"]');
    checkoutButton = this.page.locator('[data-test="checkout"]');

    async removeItem(productTestId: string) {
        await this.page.locator(`[data-test="remove-${productTestId}"]`).click();
    }
}
