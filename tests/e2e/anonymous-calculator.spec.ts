import { expect, test } from "@playwright/test";

test("visitor can open the calculator and change a scenario", async ({ page }) => {
  await page.goto("/en");
  await expect(page.getByRole("heading", { name: "Plan your shifts. See what's ahead." })).toBeVisible();
  await page.getByRole("link", { name: "See my outlook" }).first().click();
  await expect(page).toHaveURL(/\/calculator/);
  await expect(page.getByRole("heading", { name: "Let's build your shift outlook" })).toBeVisible();
  await expect(page.getByText("¥", { exact: false }).first()).toBeVisible();

  const slider = page.getByRole("slider", { name: "Hours in a future week" });
  await slider.press("End");
  await expect(slider).toHaveValue("50");
});

test("visitor can add a second job and hours are combined", async ({ page }) => {
  await page.goto("/en/calculator");
  await page.getByRole("button", { name: "Add another job" }).click();
  await expect(page.getByLabel("What do you call this job? 2")).toBeVisible();
  await page.locator(".week-table tbody tr").first().getByRole("spinbutton").nth(1).fill("5");
  await expect(page.getByText("15.0h").first()).toBeVisible();
});

test("full-year result exposes assumptions and warns above the reference", async ({ page }) => {
  await page.goto("/en/calculator");
  await expect(page.getByText("Your 2026 outlook", { exact: false }).first()).toBeVisible();
  await expect(page.getByText("Forecast assumptions")).toBeVisible();
  await page.getByRole("slider", { name: "Hours in a future week" }).press("End");
  await expect(page.getByText("above the 28h weekly reference", { exact: false })).toBeVisible();
});

test("Japanese locale changes calculator copy", async ({ page }) => {
  await page.goto("/en/calculator");
  await page.getByRole("link", { name: "日本語" }).click();
  await expect(page).toHaveURL(/\/ja\/calculator/);
  await expect(page.getByRole("heading", { name: "シフトの見通しを一緒に作ろう" })).toBeVisible();
});

test("official long-vacation mode combines jobs by day", async ({ page }) => {
  await page.goto("/en/calculator");
  await page.getByRole("button", { name: "Add another job" }).click();
  await page.getByRole("button", { name: "Official school long vacation" }).click();
  await expect(page.getByText("Official long-vacation mode")).toBeVisible();

  const firstDay = page.locator(".daily-editor").last().locator(".daily-entry").first();
  await firstDay.getByRole("spinbutton").nth(0).fill("5");
  await firstDay.getByRole("spinbutton").nth(1).fill("4");
  await expect(firstDay.getByText("9.0 / 8h")).toBeVisible();
  await expect(firstDay.getByText("Possible limit issue")).toBeVisible();
  await expect(page.getByText("not a universal 40h weekly limit", { exact: false })).toBeVisible();
});
