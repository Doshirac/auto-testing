import { BasePage } from "./BasePage";

export class MenuPage extends BasePage {
    menuButton = this.page.locator('#react-burger-menu-btn');
    menuPanel = this.page.locator('.bm-menu');
    logoutLink = this.page.locator('[data-test="logout-sidebar-link"]');
}
