import { Page } from "@playwright/test";

export class BasePage {
    page: Page;

    constructor({page}: {page: Page}) {
        this.page = page;
    }
}