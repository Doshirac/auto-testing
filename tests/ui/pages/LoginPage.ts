import { BasePage } from "./BasePage";

export class LoginPage extends BasePage {
    usernameInput = this.page.locator('[data-test="username"]');
    passwordInput = this.page.locator('[data-test="password"]');
    loginButton = this.page.locator('[data-test="login-button"]');

    async login({username, password}: {username: string, password: string}) {
        await this.usernameInput.fill(username);
        await this.passwordInput.fill(password);
        await this.loginButton.click();
    }
}