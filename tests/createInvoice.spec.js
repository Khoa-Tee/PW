// @ts-check
import { test, expect } from '@playwright/test';
import { username, pw, customername } from '../credentials.js';
import * as loginLocators from '../locators/loginPage.js';
import * as homeLocators from '../locators/homePage.js';
import * as invoicesPageLocators from '../locators/invoicesPage.js';
import * as newInvoicePageLocators from '../locators/newInvoicePage.js';
import * as invoiceDetailsPageLocators from '../locators/invoiceDetailsPage.js';
import * as customersPageLocators from '../locators/customersPage.js';
import * as customerDetailsPageLocators from '../locators/customerDetailsPage.js';
import * as randomString from '../random.js';

test.describe('Group of create a draft invoice scenarios: customer name + payment terms from Custom to NET 90. ID is generated automatically.', () => {
  test.beforeEach(async ({ page }) => {
    // Sleep for 60 seconds
    await new Promise(resolve => setTimeout(resolve, 60000));
    
    // Additional setup before each test can go here
  });
  test('Create a draft invoice directly via Invoices section. Only need to choose a Customer and Payment Terms to create.', async ({ page }) => {
    // Login phase
    await page.goto(loginLocators.loginPageURL);
    await expect(page).toHaveTitle(/Login - Blixo - Accounts Receivable Automation/);
    await page.locator(loginLocators.userName).isVisible();
    await expect(page.locator(loginLocators.userName)).toBeEnabled();
    await page.locator(loginLocators.userName).fill(username);
    await page.locator(loginLocators.password).isVisible();
    await expect(page.locator(loginLocators.password)).toBeEnabled();
    await page.locator(loginLocators.password).fill(pw);
    await page.locator(loginLocators.loginButton).isVisible();
    await expect(page.locator(loginLocators.loginButton)).toBeEnabled();
    await page.locator(loginLocators.loginButton).click();
    // Check if login success or failed
    await expect(page).toHaveTitle(/Dashboard - Blixo - Get Started/);
    await expect(page.locator(loginLocators.loginButton)).toBeHidden();
    // Create a draft invoice
    await page.waitForSelector(homeLocators.invoiceSection), { state: 'visible' };
    await page.waitForSelector(homeLocators.invoiceSection), { state: 'enabled' };
    await expect(page.locator(homeLocators.invoiceSection)).toBeEnabled();
    await page.locator(homeLocators.invoiceSection).click();
    const options = [
      page.locator(newInvoicePageLocators.custom),
      page.locator(newInvoicePageLocators.DueOnReceipt),
      page.locator(newInvoicePageLocators.NET7),
      page.locator(newInvoicePageLocators.NET10),
      page.locator(newInvoicePageLocators.NET15),
      page.locator(newInvoicePageLocators.NET30),
      page.locator(newInvoicePageLocators.NET60),
      page.locator(newInvoicePageLocators.NET90)
    ];
    for (let i = 0; i < options.length; i++) {
      const option = options[i];
      await page.waitForSelector(invoicesPageLocators.addInvoiceButton), { state: 'visible' };
      await page.locator(invoicesPageLocators.addInvoiceButton).isVisible();
      await page.waitForSelector(invoicesPageLocators.addInvoiceButton), { state: 'enabled' };
      await expect(page.locator(invoicesPageLocators.addInvoiceButton)).toBeEnabled();
      await page.locator(invoicesPageLocators.addInvoiceButton).click();
      await expect(page.locator(invoicesPageLocators.addInvoiceButton)).toBeHidden();
      await page.waitForSelector(newInvoicePageLocators.newInvoiceCustomerSearchBar), { state: 'visible' };
      await expect(page.locator(newInvoicePageLocators.newInvoiceCustomerSearchBar)).toBeVisible();
      await page.waitForSelector(newInvoicePageLocators.newInvoiceCustomerSearchBar), { state: 'enabled' };
      await expect(page.locator(newInvoicePageLocators.newInvoiceCustomerSearchBar)).toBeEnabled();
      await page.locator(newInvoicePageLocators.newInvoiceCustomerSearchBar).click();
      await page.locator(newInvoicePageLocators.newInvoiceCustomerSearchBar).fill(customername);
      await page.waitForSelector(newInvoicePageLocators.customerName), { state: 'visible' };
      await page.locator(newInvoicePageLocators.customerName).isVisible();
      await page.waitForSelector(newInvoicePageLocators.customerName), { state: 'enabled' };
      await expect(page.locator(newInvoicePageLocators.customerName)).toBeEnabled();
      await page.locator(newInvoicePageLocators.customerName).click();
      // Two 'Save as draft' buttons must be disabled
      await page.waitForSelector(newInvoicePageLocators.saveAsDraftButton1), { state: 'disabled' };
      await expect(page.locator(newInvoicePageLocators.saveAsDraftButton1)).toBeDisabled();
      await page.waitForSelector(newInvoicePageLocators.saveAsDraftButton2), { state: 'disabled' };
      await expect(page.locator(newInvoicePageLocators.saveAsDraftButton2)).toBeDisabled();
      // Check if Customer name is exist
      const customerReturnedResults1 = await page.locator(newInvoicePageLocators.customerName1).textContent();
      console.log("Bill To: " + customerReturnedResults1);
      const customerReturnedResults2 = await page.locator(newInvoicePageLocators.customerName2).textContent();
      console.log("Ship To: " + customerReturnedResults2);
      const PaymentTerms = [
        await options[i].textContent()
      ];
      if (customerReturnedResults1 == customername && customerReturnedResults2 == customername) {
        await option.isVisible();
        await expect(option).toBeEnabled();
        await option.click();
        // Two 'Save as draft' buttons must be enabled
        await page.waitForSelector(newInvoicePageLocators.saveAsDraftButton1), { state: 'enabled' };
        await expect(page.locator(newInvoicePageLocators.saveAsDraftButton1)).toBeEnabled();
        await page.waitForSelector(newInvoicePageLocators.saveAsDraftButton2), { state: 'enabled' };
        await expect(page.locator(newInvoicePageLocators.saveAsDraftButton2)).toBeEnabled();
        // Issue
        await page.locator(newInvoicePageLocators.saveAsDraftButton1).click();
        while (true) {
          if (await page.locator(invoicesPageLocators.closeIconOfPushNotification).first().isEnabled()) {
            await page.locator(invoicesPageLocators.closeIconOfPushNotification).first().click();
          }
          else {
            break;
          }
          // await page.waitForTimeout(500);
        }
        // Confirm that draft invoice has been created successfully
        await page.waitForSelector(newInvoicePageLocators.saveAsDraftButton1), { state: 'hidden' };
        await page.waitForSelector(newInvoicePageLocators.saveAsDraftButton2), { state: 'hidden' };
        await expect(page.locator(newInvoicePageLocators.saveAsDraftButton1)).toBeHidden();
        await expect(page.locator(newInvoicePageLocators.saveAsDraftButton2)).toBeHidden();
        await page.waitForSelector(invoiceDetailsPageLocators.draftStatus1), { state: 'visible' };
        await expect(page.locator(invoiceDetailsPageLocators.draftStatus1)).toBeVisible();
        await page.waitForSelector(invoiceDetailsPageLocators.draftStatus2), { state: 'visible' };
        await expect(page.locator(invoiceDetailsPageLocators.draftStatus2)).toBeVisible();
        console.log("Draft invoice has been created successfully! - " + PaymentTerms);
        // Delete test data
        await page.waitForSelector(invoiceDetailsPageLocators.moreButton), { state: 'visible' };
        await page.waitForSelector(invoiceDetailsPageLocators.moreButton), { state: 'enabled' };
        await expect(page.locator(invoiceDetailsPageLocators.moreButton)).toBeEnabled();
        await page.locator(invoiceDetailsPageLocators.moreButton).click();
        await page.locator(invoiceDetailsPageLocators.deleteInvoiceButton).isVisible();
        await page.waitForSelector(invoiceDetailsPageLocators.deleteInvoiceButton), { state: 'enabled' };
        await expect(page.locator(invoiceDetailsPageLocators.deleteInvoiceButton)).toBeEnabled();
        await page.locator(invoiceDetailsPageLocators.deleteInvoiceButton).click();
        await page.locator(invoiceDetailsPageLocators.confirmQuestion).isVisible();
        await page.locator(invoiceDetailsPageLocators.okButton).isVisible();
        await page.waitForSelector(invoiceDetailsPageLocators.okButton), { state: 'enabled' };
        await expect(page.locator(invoiceDetailsPageLocators.okButton)).toBeEnabled();
        await page.locator(invoiceDetailsPageLocators.okButton).click();
        await page.waitForSelector(invoiceDetailsPageLocators.okButton), { state: 'hidden' };
        await expect(page.locator(invoiceDetailsPageLocators.okButton)).toBeHidden();
        console.log("Data test is cleaned!");
      } else {
        console.log("Customer is not exist!");
      }
    }
  });

  test('Create a draft invoice via Customer profile. Only need to choose a Customer and Payment Terms to create.', async ({ page }) => {
    // Login phase
    await page.goto(loginLocators.loginPageURL);
    await expect(page).toHaveTitle(/Login - Blixo - Accounts Receivable Automation/);
    await page.locator(loginLocators.userName).isVisible();
    await expect(page.locator(loginLocators.userName)).toBeEnabled();
    await page.locator(loginLocators.userName).fill(username);
    await page.locator(loginLocators.password).isVisible();
    await expect(page.locator(loginLocators.password)).toBeEnabled();
    await page.locator(loginLocators.password).fill(pw);
    await page.locator(loginLocators.loginButton).isVisible();
    await expect(page.locator(loginLocators.loginButton)).toBeEnabled();
    await page.locator(loginLocators.loginButton).click();
    // Check if login success or failed
    await expect(page).toHaveTitle(/Dashboard - Blixo - Get Started/);
    await expect(page.locator(loginLocators.loginButton)).toBeHidden();
    // Create a draft invoice
    await page.waitForSelector(homeLocators.customerSection), { state: 'visible' };
    await page.waitForSelector(homeLocators.customerSection), { state: 'enabled' };
    await expect(page.locator(homeLocators.customerSection)).toBeEnabled();
    await page.locator(homeLocators.customerSection).click();
    await page.waitForSelector(customersPageLocators.customerSearchBar), { state: 'visible' };
    await page.locator(customersPageLocators.customerSearchBar).isVisible();
    await page.waitForSelector(customersPageLocators.customerSearchBar), { state: 'enabled' };
    await expect(page.locator(customersPageLocators.customerSearchBar)).toBeEnabled();
    await page.locator(customersPageLocators.customerSearchBar).click();
    await page.locator(customersPageLocators.customerSearchBar).fill(customername);
    await page.waitForSelector(customersPageLocators.customerName), { state: 'visible' };
    await page.locator(customersPageLocators.customerName).isVisible();
    await page.waitForSelector(customersPageLocators.customerName), { state: 'enabled' };
    await expect(page.locator(customersPageLocators.customerName)).toBeEnabled();
    await page.locator(customersPageLocators.customerName).click();
    await page.waitForSelector(customersPageLocators.anticonCheckSearchBar), { state: 'visible' };
    await page.locator(customersPageLocators.anticonCheckSearchBar).isVisible();
    await page.waitForSelector(customersPageLocators.customerNumber), { state: 'visible' };
    await page.locator(customersPageLocators.customerNumber).isVisible();
    await page.waitForSelector(customersPageLocators.customerNumber), { state: 'enabled' };
    await expect(page.locator(customersPageLocators.customerNumber)).toBeEnabled();
    await page.locator(customersPageLocators.customerNumber).click();
    await page.locator(customersPageLocators.addCustomerButton).isHidden();
    await expect(page.locator(customersPageLocators.addCustomerButton)).toBeHidden();
    await page.waitForSelector(customerDetailsPageLocators.addButton), { state: 'visible' };
    await page.locator(customerDetailsPageLocators.addButton).isVisible();
    await page.waitForSelector(customerDetailsPageLocators.addButton), { state: 'enabled' };
    await expect(page.locator(customerDetailsPageLocators.addButton)).toBeEnabled();
    await page.locator(customerDetailsPageLocators.addButton).click();
    await page.waitForSelector(customerDetailsPageLocators.newInvoiceButton), { state: 'visible' };
    await page.locator(customerDetailsPageLocators.newInvoiceButton).isVisible();
    await page.waitForSelector(customerDetailsPageLocators.newInvoiceButton), { state: 'enabled' };
    await expect(page.locator(customerDetailsPageLocators.newInvoiceButton)).toBeEnabled();
    await page.locator(customerDetailsPageLocators.newInvoiceButton).click();
    // Two 'Save as draft' buttons must be disabled
    await page.waitForSelector(newInvoicePageLocators.saveAsDraftButton1), { state: 'disabled' };
    await expect(page.locator(newInvoicePageLocators.saveAsDraftButton1)).toBeDisabled();
    await page.waitForSelector(newInvoicePageLocators.saveAsDraftButton2), { state: 'disabled' };
    await expect(page.locator(newInvoicePageLocators.saveAsDraftButton2)).toBeDisabled();
    const options = [
      page.locator(newInvoicePageLocators.custom),
      page.locator(newInvoicePageLocators.DueOnReceipt),
      page.locator(newInvoicePageLocators.NET7),
      page.locator(newInvoicePageLocators.NET10),
      page.locator(newInvoicePageLocators.NET15),
      page.locator(newInvoicePageLocators.NET30),
      page.locator(newInvoicePageLocators.NET60),
      page.locator(newInvoicePageLocators.NET90)
    ];
    for (let i = 0; i < options.length; i++) {
      const option = options[i];
      await option.isVisible();
      await expect(option).toBeEnabled();
      await option.click();
      const PaymentTerms = [
        await options[i].textContent()
      ];
      await page.waitForSelector(newInvoicePageLocators.saveAsDraftButton1), { state: 'enabled' };
      await expect(page.locator(newInvoicePageLocators.saveAsDraftButton1)).toBeEnabled();
      await page.waitForSelector(newInvoicePageLocators.saveAsDraftButton2), { state: 'enabled' };
      await expect(page.locator(newInvoicePageLocators.saveAsDraftButton2)).toBeEnabled();
      // Issue a draft invoice
      await page.locator(newInvoicePageLocators.saveAsDraftButton1).click();
      await page.waitForSelector(newInvoicePageLocators.saveAsDraftButton1), { state: 'hidden' };
      await page.waitForSelector(newInvoicePageLocators.saveAsDraftButton2), { state: 'hidden' };
      await expect(page.locator(newInvoicePageLocators.saveAsDraftButton1)).toBeHidden();
      await expect(page.locator(newInvoicePageLocators.saveAsDraftButton2)).toBeHidden();
      while (true) {
        if (await page.locator(invoicesPageLocators.closeIconOfPushNotification).first().isVisible() && await page.locator(invoicesPageLocators.closeIconOfPushNotification).first().isEnabled()) {
          await page.locator(invoicesPageLocators.closeIconOfPushNotification).first().click();
        }
        else {
          break;
        }
        await page.waitForTimeout(500);
      }
      await page.waitForSelector(invoiceDetailsPageLocators.draftStatus1), { state: 'visible' };
      await expect(page.locator(invoiceDetailsPageLocators.draftStatus1)).toBeVisible();
      await page.waitForSelector(invoiceDetailsPageLocators.draftStatus2), { state: 'visible' };
      await expect(page.locator(invoiceDetailsPageLocators.draftStatus2)).toBeVisible();
      console.log("Draft invoice has been created successfully! - " + PaymentTerms);
      // Delete test data
      await page.waitForSelector(invoiceDetailsPageLocators.moreButton), { state: 'visible' };
      await page.waitForSelector(invoiceDetailsPageLocators.moreButton), { state: 'enabled' };
      await expect(page.locator(invoiceDetailsPageLocators.moreButton)).toBeEnabled();
      await page.locator(invoiceDetailsPageLocators.moreButton).click();
      await page.locator(invoiceDetailsPageLocators.deleteInvoiceButton).isVisible();
      await page.waitForSelector(invoiceDetailsPageLocators.deleteInvoiceButton), { state: 'enabled' };
      await expect(page.locator(invoiceDetailsPageLocators.deleteInvoiceButton)).toBeEnabled();
      await page.locator(invoiceDetailsPageLocators.deleteInvoiceButton).click();
      await page.locator(invoiceDetailsPageLocators.confirmQuestion).isVisible();
      await page.locator(invoiceDetailsPageLocators.okButton).isVisible();
      await page.waitForSelector(invoiceDetailsPageLocators.okButton), { state: 'enabled' };
      await expect(page.locator(invoiceDetailsPageLocators.okButton)).toBeEnabled();
      await page.locator(invoiceDetailsPageLocators.okButton).click();
      await page.waitForSelector(invoiceDetailsPageLocators.okButton), { state: 'hidden' };
      await expect(page.locator(invoiceDetailsPageLocators.okButton)).toBeHidden();
      console.log("Data test is cleaned!");
      for (let i = 0; i < options.length - 1; i++) {
        await page.waitForSelector(homeLocators.customerSection), { state: 'visible' };
        await page.waitForSelector(homeLocators.customerSection), { state: 'enabled' };
        await expect(page.locator(homeLocators.customerSection)).toBeEnabled();
        await page.locator(homeLocators.customerSection).click();
        await page.waitForSelector(customersPageLocators.customerSearchBar), { state: 'visible' };
        await page.locator(customersPageLocators.customerSearchBar).isVisible();
        await page.waitForSelector(customersPageLocators.customerSearchBar), { state: 'enabled' };
        await expect(page.locator(customersPageLocators.customerSearchBar)).toBeEnabled();
        await page.locator(customersPageLocators.customerSearchBar).click();
        await page.locator(customersPageLocators.customerSearchBar).fill(customername);
        await page.waitForSelector(customersPageLocators.customerName), { state: 'visible' };
        await page.locator(customersPageLocators.customerName).isVisible();
        await page.waitForSelector(customersPageLocators.customerName), { state: 'enabled' };
        await expect(page.locator(customersPageLocators.customerName)).toBeEnabled();
        await page.locator(customersPageLocators.customerName).click();
        await page.waitForSelector(customersPageLocators.anticonCheckSearchBar), { state: 'visible' };
        await page.locator(customersPageLocators.anticonCheckSearchBar).isVisible();
        await page.waitForSelector(customersPageLocators.customerNumber), { state: 'visible' };
        await page.locator(customersPageLocators.customerNumber).isVisible();
        await page.waitForSelector(customersPageLocators.customerNumber), { state: 'enabled' };
        await expect(page.locator(customersPageLocators.customerNumber)).toBeEnabled();
        await page.locator(customersPageLocators.customerNumber).click();
        await page.locator(customersPageLocators.addCustomerButton).isHidden();
        await expect(page.locator(customersPageLocators.addCustomerButton)).toBeHidden();
        await page.waitForSelector(customerDetailsPageLocators.addButton), { state: 'visible' };
        await page.locator(customerDetailsPageLocators.addButton).isVisible();
        await page.waitForSelector(customerDetailsPageLocators.addButton), { state: 'enabled' };
        await expect(page.locator(customerDetailsPageLocators.addButton)).toBeEnabled();
        await page.locator(customerDetailsPageLocators.addButton).click();
        await page.waitForSelector(customerDetailsPageLocators.newInvoiceButton), { state: 'visible' };
        await page.locator(customerDetailsPageLocators.newInvoiceButton).isVisible();
        await page.waitForSelector(customerDetailsPageLocators.newInvoiceButton), { state: 'enabled' };
        await expect(page.locator(customerDetailsPageLocators.newInvoiceButton)).toBeEnabled();
        await page.locator(customerDetailsPageLocators.newInvoiceButton).click();
      }
    }
  });

  test('Create a draft invoice directly via Invoices section by clicking on the "Create a new one" button. Only need to choose a Customer and Payment Terms to create.', async ({ page }) => {
    // Login phase
    await page.goto(loginLocators.loginPageURL);
    await expect(page).toHaveTitle(/Login - Blixo - Accounts Receivable Automation/);
    await page.locator(loginLocators.userName).isVisible();
    await expect(page.locator(loginLocators.userName)).toBeEnabled();
    await page.locator(loginLocators.userName).fill(username);
    await page.locator(loginLocators.password).isVisible();
    await expect(page.locator(loginLocators.password)).toBeEnabled();
    await page.locator(loginLocators.password).fill(pw);
    await page.locator(loginLocators.loginButton).isVisible();
    await expect(page.locator(loginLocators.loginButton)).toBeEnabled();
    await page.locator(loginLocators.loginButton).click();
    // Check if login success or failed
    await expect(page).toHaveTitle(/Dashboard - Blixo - Get Started/);
    await expect(page.locator(loginLocators.loginButton)).toBeHidden();
    // Create a draft invoice
    await page.waitForSelector(homeLocators.invoiceSection), { state: 'visible' };
    await page.waitForSelector(homeLocators.invoiceSection), { state: 'enabled' };
    await expect(page.locator(homeLocators.invoiceSection)).toBeEnabled();
    await page.locator(homeLocators.invoiceSection).click();
    const options = [
      page.locator(newInvoicePageLocators.custom),
      page.locator(newInvoicePageLocators.DueOnReceipt),
      page.locator(newInvoicePageLocators.NET7),
      page.locator(newInvoicePageLocators.NET10),
      page.locator(newInvoicePageLocators.NET15),
      page.locator(newInvoicePageLocators.NET30),
      page.locator(newInvoicePageLocators.NET60),
      page.locator(newInvoicePageLocators.NET90)
    ];
    for (let i = 0; i < options.length; i++) {
      await page.waitForSelector(invoicesPageLocators.createNewOneButton), { state: 'visible' };
      await page.locator(invoicesPageLocators.createNewOneButton).isVisible();
      await page.waitForSelector(invoicesPageLocators.createNewOneButton), { state: 'enabled' };
      await expect(page.locator(invoicesPageLocators.createNewOneButton)).toBeEnabled();
      const isEnabled = await page.locator(invoicesPageLocators.createNewOneButton).isEnabled()
      if (isEnabled) {
        await page.locator(invoicesPageLocators.createNewOneButton).click();
        await page.waitForSelector(newInvoicePageLocators.newInvoiceHeadingTitle), { state: 'visible' };
        await expect(page.locator(newInvoicePageLocators.newInvoiceHeadingTitle)).toBeVisible();
        await page.waitForSelector(newInvoicePageLocators.newInvoiceCustomerSearchBar), { state: 'visible' };
        await page.waitForSelector(newInvoicePageLocators.newInvoiceCustomerSearchBar), { state: 'enabled' };
        await expect(page.locator(newInvoicePageLocators.newInvoiceHeadingTitle)).toBeEnabled();
        await page.locator(newInvoicePageLocators.newInvoiceCustomerSearchBar).click();
        await page.locator(newInvoicePageLocators.newInvoiceCustomerSearchBar).fill(customername);
        await page.waitForSelector(newInvoicePageLocators.customerName), { state: 'visible' };
        await page.waitForSelector(newInvoicePageLocators.customerName), { state: 'enabled' };
        await expect(page.locator(newInvoicePageLocators.customerName)).toBeEnabled();
        await page.locator(newInvoicePageLocators.customerName).click();
        // Two 'Save as draft' buttons must be disabled
        await page.waitForSelector(newInvoicePageLocators.saveAsDraftButton1), { state: 'disabled' };
        await expect(page.locator(newInvoicePageLocators.saveAsDraftButton1)).toBeDisabled();
        await page.waitForSelector(newInvoicePageLocators.saveAsDraftButton2), { state: 'disabled' };
        await expect(page.locator(newInvoicePageLocators.saveAsDraftButton2)).toBeDisabled();
        // Kiểm tra xem Customer name có tồn tại hay không
        const customerReturnedResults1 = await page.locator(newInvoicePageLocators.customerName1).textContent();
        console.log(customerReturnedResults1);
        const customerReturnedResults2 = await page.locator(newInvoicePageLocators.customerName2).textContent();
        console.log(customerReturnedResults2);
        const option = options[i];
        if (customerReturnedResults1 == customername && customerReturnedResults2 == customername) {
          const option = options[i];
          await option.isVisible();
          await expect(option).toBeEnabled();
          await option.click();
          const PaymentTerms = [
            await options[i].textContent()
          ];
          await page.locator(newInvoicePageLocators.saveAsDraftButton1).isVisible()
          await expect(page.locator(newInvoicePageLocators.saveAsDraftButton1)).toBeVisible();
          await page.waitForSelector(newInvoicePageLocators.saveAsDraftButton1), { state: 'enabled' };
          await expect(page.locator(newInvoicePageLocators.saveAsDraftButton1)).toBeEnabled();
          await page.locator(newInvoicePageLocators.saveAsDraftButton2).isVisible()
          await expect(page.locator(newInvoicePageLocators.saveAsDraftButton2)).toBeVisible();
          await page.waitForSelector(newInvoicePageLocators.saveAsDraftButton2), { state: 'enabled' };
          await expect(page.locator(newInvoicePageLocators.saveAsDraftButton2)).toBeEnabled();
          // Issue a draft invoice
          await page.locator(newInvoicePageLocators.saveAsDraftButton1).click();
          while (true) {
            if (await page.locator(invoicesPageLocators.closeIconOfPushNotification).first().isEnabled()) {
              await page.locator(invoicesPageLocators.closeIconOfPushNotification).first().click();
            }
            else {
              break;
            }
            await page.waitForTimeout(100);
          }
          // Confirm that draft invoice has been created successfully
          await page.waitForSelector(newInvoicePageLocators.saveAsDraftButton1), { state: 'hidden' };
          await page.waitForSelector(newInvoicePageLocators.saveAsDraftButton2), { state: 'hidden' };
          await expect(page.locator(newInvoicePageLocators.saveAsDraftButton1)).toBeHidden();
          await expect(page.locator(newInvoicePageLocators.saveAsDraftButton2)).toBeHidden();
          await page.waitForSelector(invoiceDetailsPageLocators.draftStatus1), { state: 'visible' };
          await expect(page.locator(invoiceDetailsPageLocators.draftStatus1)).toBeVisible();
          await page.waitForSelector(invoiceDetailsPageLocators.draftStatus2), { state: 'visible' };
          await expect(page.locator(invoiceDetailsPageLocators.draftStatus2)).toBeVisible();
          console.log("Draft invoice has been created successfully! - " + PaymentTerms);
          // Delete test data
          await page.waitForSelector(invoiceDetailsPageLocators.moreButton), { state: 'visible' };
          await page.waitForSelector(invoiceDetailsPageLocators.moreButton), { state: 'enabled' };
          await expect(page.locator(invoiceDetailsPageLocators.moreButton)).toBeEnabled();
          await page.locator(invoiceDetailsPageLocators.moreButton).click();
          await page.locator(invoiceDetailsPageLocators.deleteInvoiceButton).isVisible();
          await page.waitForSelector(invoiceDetailsPageLocators.deleteInvoiceButton), { state: 'enabled' };
          await expect(page.locator(invoiceDetailsPageLocators.deleteInvoiceButton)).toBeEnabled();
          await page.locator(invoiceDetailsPageLocators.deleteInvoiceButton).click();
          await page.locator(invoiceDetailsPageLocators.confirmQuestion).isVisible();
          await page.locator(invoiceDetailsPageLocators.okButton).isVisible();
          await page.waitForSelector(invoiceDetailsPageLocators.okButton), { state: 'enabled' };
          await expect(page.locator(invoiceDetailsPageLocators.okButton)).toBeEnabled();
          await page.locator(invoiceDetailsPageLocators.okButton).click();
          await page.waitForSelector(invoiceDetailsPageLocators.okButton), { state: 'hidden' };
          await expect(page.locator(invoiceDetailsPageLocators.okButton)).toBeHidden();
          console.log("Data test is cleaned!");
          while (true) {
            if (await page.locator(invoicesPageLocators.closeIconOfPushNotification).first().isEnabled()) {
              await page.locator(invoicesPageLocators.closeIconOfPushNotification).first().click();
            }
            else {
              break;
            }
            await page.waitForTimeout(500);
          }
        }
        else {
          console.log("Customer is not exist!");
        }
      }
      else {
        console.log("Button is not displayed because the list doesn't null.");
      }
    }
  });
});

test.describe('Group of create a draft invoice scenarios: customer name + payment terms from Custom to NET 90. ID is inputted manually by the end user.', () => {

  test('Create a draft invoice directly via Invoices section. Only need to choose a Customer and Payment Terms to create. From Custom to NET 90.', async ({ page }) => {
    // Login phase
    await page.goto(loginLocators.loginPageURL);
    await expect(page).toHaveTitle(/Login - Blixo - Accounts Receivable Automation/);
    await page.locator(loginLocators.userName).isVisible();
    await page.locator(loginLocators.userName).fill(username);
    await page.locator(loginLocators.password).isVisible();
    await page.locator(loginLocators.password).fill(pw);
    await page.locator(loginLocators.loginButton).isVisible();
    await page.locator(loginLocators.loginButton).isEnabled();
    await page.locator(loginLocators.loginButton).click();

    // Check if login success or failed
    await expect(page).toHaveTitle(/Dashboard - Blixo - Get Started/);
    await page.locator(loginLocators.userName).isHidden();
    await expect(page.locator(loginLocators.loginButton)).toBeHidden();
    await page.locator(homeLocators.invoiceSection).isVisible();
    await page.locator(homeLocators.invoiceSection).click();

    const options = [
      page.locator(newInvoicePageLocators.custom),
      page.locator(newInvoicePageLocators.DueOnReceipt),
      page.locator(newInvoicePageLocators.NET7),
      page.locator(newInvoicePageLocators.NET10),
      page.locator(newInvoicePageLocators.NET15),
      page.locator(newInvoicePageLocators.NET30),
      page.locator(newInvoicePageLocators.NET60),
      page.locator(newInvoicePageLocators.NET90)
    ];

    for (let i = 0; i < options.length; i++) {
      // Create a draft invoice
      await page.locator(invoicesPageLocators.addInvoiceButton).isVisible();
      await page.locator(invoicesPageLocators.addInvoiceButton).click();
      await page.locator(newInvoicePageLocators.newInvoiceHeadingTitle).isVisible();
      await page.locator(newInvoicePageLocators.newInvoiceCustomerSearchBar).isVisible();
      await page.locator(newInvoicePageLocators.newInvoiceCustomerSearchBar).isEnabled();
      await page.locator(newInvoicePageLocators.newInvoiceCustomerSearchBar).click();
      await page.locator(newInvoicePageLocators.newInvoiceCustomerSearchBar).fill(customername);
      await page.locator(newInvoicePageLocators.customerName).isVisible();
      await page.locator(newInvoicePageLocators.customerName).click();
      // Two 'Save as draft' buttons must be disabled
      await expect(page.locator(newInvoicePageLocators.saveAsDraftButton1)).toBeDisabled();
      await expect(page.locator(newInvoicePageLocators.saveAsDraftButton1)).toBeDisabled();
      await page.locator(newInvoicePageLocators.newInvoiceHeadingTitle).click();
      // Kiểm tra xem Customer name có tồn tại hay không
      const customerReturnedResults1 = await page.locator(newInvoicePageLocators.customerName1).textContent();
      console.log(customerReturnedResults1);
      const customerReturnedResults2 = await page.locator(newInvoicePageLocators.customerName2).textContent();
      console.log(customerReturnedResults2);
      const option = options[i];
      if (customerReturnedResults1 == customername && customerReturnedResults2 == customername) {
        // Two 'Save as draft' buttons must be enabled if one any value in the Payment Terms field is chosen
        await option.isVisible();
        await option.isEnabled();
        await option.click();
        await expect(page.locator(newInvoicePageLocators.saveAsDraftButton1)).toBeEnabled();
        await expect(page.locator(newInvoicePageLocators.saveAsDraftButton2)).toBeEnabled();
        // Issue a draft invoice
        await page.locator(newInvoicePageLocators.saveAsDraftButton1).click();
        await expect(page.locator(newInvoicePageLocators.saveAsDraftButton1)).toBeHidden();
        await expect(page.locator(newInvoicePageLocators.saveAsDraftButton2)).toBeHidden();
        // Confirm that draft invoice has been created successfully
        await expect(page.locator(invoiceDetailsPageLocators.draftStatus1)).toBeVisible();
        await expect(page.locator(invoiceDetailsPageLocators.draftStatus2)).toBeVisible();
        console.log("Draft invoice has been created successfully!");
        await page.locator(invoiceDetailsPageLocators.moreButton).isVisible();
        await page.locator(invoiceDetailsPageLocators.moreButton).click();
        await page.locator(invoiceDetailsPageLocators.deleteInvoiceButton).isVisible();
        await expect(page.locator(invoiceDetailsPageLocators.deleteInvoiceButton)).toBeEnabled();
        await page.locator(invoiceDetailsPageLocators.deleteInvoiceButton).click();
        await page.locator(invoiceDetailsPageLocators.confirmQuestion).isVisible();
        await page.locator(invoiceDetailsPageLocators.okButton).isVisible();
        await expect(page.locator(invoiceDetailsPageLocators.okButton)).toBeEnabled();
        await page.locator(invoiceDetailsPageLocators.okButton).click();
        console.log("Data test is cleaned!");
      } else {
        console.log("Customer is not exist!");
      }
    }
  });

  test('Create a draft invoice via Customer profile. Only need to choose a Customer and Payment Terms to create. From Custom to NET 90.', async ({ page }) => {
    // Login phase
    await page.goto(loginLocators.loginPageURL);
    await expect(page).toHaveTitle(/Login - Blixo - Accounts Receivable Automation/);
    await page.locator(loginLocators.userName).isVisible();
    await page.locator(loginLocators.userName).fill(username);
    await page.locator(loginLocators.password).isVisible();
    await page.locator(loginLocators.password).fill(pw);
    await page.locator(loginLocators.loginButton).isVisible();
    await page.locator(loginLocators.loginButton).isEnabled();
    await page.locator(loginLocators.loginButton).click();

    // Check if login success or failed
    await expect(page).toHaveTitle(/Dashboard - Blixo - Get Started/);
    await page.locator(loginLocators.userName).isHidden();
    await expect(page.locator(loginLocators.loginButton)).toBeHidden();

    // Create a draft invoice
    await page.locator(homeLocators.customerSection).isVisible();
    await page.locator(homeLocators.customerSection).click();
    await page.locator(customersPageLocators.addCustomerButton).isVisible();
    await page.locator(customersPageLocators.customerSearchBar).isVisible();
    await expect(page.locator(customersPageLocators.customerSearchBar)).toBeEnabled();
    await page.locator(customersPageLocators.customerSearchBar).click();
    await page.locator(customersPageLocators.customerSearchBar).fill(customername);
    await page.locator(customersPageLocators.customerName).isVisible();
    await expect(page.locator(customersPageLocators.customerName)).toBeEnabled();
    await page.locator(customersPageLocators.customerName).click();
    await page.locator(customersPageLocators.anticonCheckSearchBar).isVisible();
    await page.locator(customersPageLocators.customerNumber).isVisible();
    await expect(page.locator(customersPageLocators.customerNumber)).toBeEnabled();
    await page.locator(customersPageLocators.customerNumber).click();
    await page.locator(customersPageLocators.addCustomerButton).isHidden();
    await expect(page.locator(customersPageLocators.addCustomerButton)).toBeHidden();
    await page.locator(customerDetailsPageLocators.addButton).isVisible();
    await expect(page.locator(customerDetailsPageLocators.addButton)).toBeEnabled();
    await page.locator(customerDetailsPageLocators.addButton).click();
    await page.locator(customerDetailsPageLocators.newInvoiceButton).isVisible();
    await expect(page.locator(customerDetailsPageLocators.newInvoiceButton)).toBeEnabled();
    await page.locator(customerDetailsPageLocators.newInvoiceButton).click();

    // Two 'Save as draft' buttons must be disabled
    await expect(page.locator(newInvoicePageLocators.saveAsDraftButton1)).toBeDisabled();
    await expect(page.locator(newInvoicePageLocators.saveAsDraftButton1)).toBeDisabled();

    const options = [
      page.locator(newInvoicePageLocators.custom),
      page.locator(newInvoicePageLocators.DueOnReceipt),
      page.locator(newInvoicePageLocators.NET7),
      page.locator(newInvoicePageLocators.NET10),
      page.locator(newInvoicePageLocators.NET15),
      page.locator(newInvoicePageLocators.NET30),
      page.locator(newInvoicePageLocators.NET60),
      page.locator(newInvoicePageLocators.NET90)
    ];
    for (let i = 0; i < options.length; i++) {
      const option = options[i];
      await option.isVisible();
      await option.isEnabled();
      await option.click();
      // Issue a draft invoice
      await page.locator(newInvoicePageLocators.saveAsDraftButton1).click();
      // Confirm that draft invoice has been created successfully
      await expect(page.locator(newInvoicePageLocators.saveAsDraftButton1)).toBeHidden();
      await expect(page.locator(newInvoicePageLocators.saveAsDraftButton2)).toBeHidden();
      await expect(page.locator(invoiceDetailsPageLocators.draftStatus1)).toBeVisible();
      await expect(page.locator(invoiceDetailsPageLocators.draftStatus2)).toBeVisible();
      console.log("Draft invoice has been created successfully!");
      await page.locator(invoiceDetailsPageLocators.moreButton).isVisible();
      await page.locator(invoiceDetailsPageLocators.moreButton).click();
      await page.locator(invoiceDetailsPageLocators.deleteInvoiceButton).isVisible();
      await expect(page.locator(invoiceDetailsPageLocators.deleteInvoiceButton)).toBeEnabled();
      await page.locator(invoiceDetailsPageLocators.deleteInvoiceButton).click();
      await page.locator(invoiceDetailsPageLocators.confirmQuestion).isVisible();
      await page.locator(invoiceDetailsPageLocators.okButton).isVisible();
      await expect(page.locator(invoiceDetailsPageLocators.okButton)).toBeEnabled();
      await page.locator(invoiceDetailsPageLocators.okButton).click();
      console.log("Data test is cleaned!");
      for (let i = 0; i < options.length - 1; i++) {
        await page.locator(homeLocators.customerSection).isVisible();
        await page.locator(homeLocators.customerSection).click();
        await page.locator(customersPageLocators.addCustomerButton).isVisible();
        await page.locator(customersPageLocators.customerSearchBar).isVisible();
        await expect(page.locator(customersPageLocators.customerSearchBar)).toBeEnabled();
        await page.locator(customersPageLocators.customerSearchBar).click();
        await page.locator(customersPageLocators.customerSearchBar).fill(customername);
        await page.locator(customersPageLocators.customerName).isVisible();
        await expect(page.locator(customersPageLocators.customerName)).toBeEnabled();
        await page.locator(customersPageLocators.customerName).click();
        await page.locator(customersPageLocators.anticonCheckSearchBar).isVisible();
        await page.locator(customersPageLocators.customerNumber).isVisible();
        await expect(page.locator(customersPageLocators.customerNumber)).toBeEnabled();
        await page.locator(customersPageLocators.customerNumber).click();
        await page.locator(customersPageLocators.addCustomerButton).isHidden();
        await expect(page.locator(customersPageLocators.addCustomerButton)).toBeHidden();
        await page.locator(customerDetailsPageLocators.addButton).isVisible();
        await expect(page.locator(customerDetailsPageLocators.addButton)).toBeEnabled();
        await page.locator(customerDetailsPageLocators.addButton).click();
        await page.locator(customerDetailsPageLocators.newInvoiceButton).isVisible();
        await expect(page.locator(customerDetailsPageLocators.newInvoiceButton)).toBeEnabled();
        await page.locator(customerDetailsPageLocators.newInvoiceButton).click();
        // Two 'Save as draft' buttons must be disabled
        await expect(page.locator(newInvoicePageLocators.saveAsDraftButton1)).toBeDisabled();
        await expect(page.locator(newInvoicePageLocators.saveAsDraftButton1)).toBeDisabled();
      }
    }
  });

  test('Create a draft invoice directly via Invoices section by clicking on the "Create a new one" button. Only need to choose a Customer and Payment Terms to create. From Custom to NET 90.', async ({ page }) => {
    // Login phase
    await page.goto(loginLocators.loginPageURL);
    await expect(page).toHaveTitle(/Login - Blixo - Accounts Receivable Automation/);
    await page.locator(loginLocators.userName).isVisible();
    await page.locator(loginLocators.userName).fill(username);
    await page.locator(loginLocators.password).isVisible();
    await page.locator(loginLocators.password).fill(pw);
    await page.locator(loginLocators.loginButton).isVisible();
    await page.locator(loginLocators.loginButton).isEnabled();
    await page.locator(loginLocators.loginButton).click();

    // Check if login success or failed
    await expect(page).toHaveTitle(/Dashboard - Blixo - Get Started/);
    await page.locator(loginLocators.userName).isHidden();
    await expect(page.locator(loginLocators.loginButton)).toBeHidden();

    // Create a draft invoice
    await page.locator(homeLocators.invoiceSection).isVisible();
    await page.locator(homeLocators.invoiceSection).click();
    await page.locator(invoicesPageLocators.createNewOneButton).isVisible();
    const isEnbaled = await page.locator(invoicesPageLocators.createNewOneButton).isEnabled();
    const options = [
      page.locator(newInvoicePageLocators.custom),
      page.locator(newInvoicePageLocators.DueOnReceipt),
      page.locator(newInvoicePageLocators.NET7),
      page.locator(newInvoicePageLocators.NET10),
      page.locator(newInvoicePageLocators.NET15),
      page.locator(newInvoicePageLocators.NET30),
      page.locator(newInvoicePageLocators.NET60),
      page.locator(newInvoicePageLocators.NET90)
    ];
    for (let i = 0; i < options.length; i++) {
      if (isEnbaled) {
        await page.locator(invoicesPageLocators.createNewOneButton).click();
        await page.locator(newInvoicePageLocators.newInvoiceHeadingTitle).isVisible();
        await page.locator(newInvoicePageLocators.newInvoiceCustomerSearchBar).isVisible();
        await page.locator(newInvoicePageLocators.newInvoiceCustomerSearchBar).isEnabled();
        await page.locator(newInvoicePageLocators.newInvoiceCustomerSearchBar).click();
        await page.locator(newInvoicePageLocators.newInvoiceCustomerSearchBar).fill(customername);
        await page.locator(newInvoicePageLocators.customerName).isVisible();
        await page.locator(newInvoicePageLocators.customerName).click();
        // Two 'Save as draft' buttons must be disabled
        await expect(page.locator(newInvoicePageLocators.saveAsDraftButton1)).toBeDisabled();
        await expect(page.locator(newInvoicePageLocators.saveAsDraftButton1)).toBeDisabled();
        await page.locator(newInvoicePageLocators.newInvoiceHeadingTitle).click();
        // Kiểm tra xem Customer name có tồn tại hay không
        const customerReturnedResults1 = await page.locator(newInvoicePageLocators.customerName1).textContent();
        console.log(customerReturnedResults1);
        const customerReturnedResults2 = await page.locator(newInvoicePageLocators.customerName2).textContent();
        console.log(customerReturnedResults2);
        const option = options[i];
        if (customerReturnedResults1 == customername && customerReturnedResults2 == customername) {
          // Two 'Save as draft' buttons must be enabled if one any value in the Payment Terms field is chosen
          await option.isVisible();
          await option.isEnabled();
          await option.click();
          await expect(page.locator(newInvoicePageLocators.saveAsDraftButton1)).toBeEnabled();
          await expect(page.locator(newInvoicePageLocators.saveAsDraftButton2)).toBeEnabled();
          // Issue a draft invoice
          await page.locator(newInvoicePageLocators.saveAsDraftButton1).click();
          await expect(page.locator(newInvoicePageLocators.saveAsDraftButton1)).toBeHidden();
          await expect(page.locator(newInvoicePageLocators.saveAsDraftButton2)).toBeHidden();
          // Confirm that draft invoice has been created successfully
          await expect(page.locator(invoiceDetailsPageLocators.draftStatus1)).toBeVisible();
          await expect(page.locator(invoiceDetailsPageLocators.draftStatus2)).toBeVisible();
          console.log("Draft invoice has been created successfully!");
          await page.locator(invoiceDetailsPageLocators.moreButton).isVisible();
          await page.locator(invoiceDetailsPageLocators.moreButton).click();
          await page.locator(invoiceDetailsPageLocators.deleteInvoiceButton).isVisible();
          await expect(page.locator(invoiceDetailsPageLocators.deleteInvoiceButton)).toBeEnabled();
          await page.locator(invoiceDetailsPageLocators.deleteInvoiceButton).click();
          await page.locator(invoiceDetailsPageLocators.confirmQuestion).isVisible();
          await page.locator(invoiceDetailsPageLocators.okButton).isVisible();
          await expect(page.locator(invoiceDetailsPageLocators.okButton)).toBeEnabled();
          await page.locator(invoiceDetailsPageLocators.okButton).click();
          console.log("Data test is cleaned!");
        } else {
          console.log("Customer is not exist!");
        }
      }
      else {
        console.log("Button is not displayed because the list doesn't null.");
      }
    }
  });
});