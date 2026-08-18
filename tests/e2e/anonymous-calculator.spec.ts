import { expect, test } from "@playwright/test";

test("visitor can open the calculator and change a scenario", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { name: "Know what your shifts mean for your money." })).toBeVisible();
  await page.getByRole("link", { name: "Check My Work & Income" }).first().click();
  await expect(page).toHaveURL(/\/calculator/);
  await expect(page.getByRole("heading", { name: "Build your shift forecast" })).toBeVisible();
  await expect(page.getByText("¥", { exact: false }).first()).toBeVisible();

  const slider = page.getByRole("slider", { name: "Future weekly hours" });
  await slider.fill("30");
  await expect(slider).toHaveValue("30");
});

test("visitor can add a second job and hours are combined", async ({ page }) => {
  await page.goto("/calculator");
  await page.getByRole("button", { name: "Add another job" }).click();
  await expect(page.getByLabel("Job nickname 2")).toBeVisible();
  await page.getByLabel("Week 1 Job 2").fill("5");
  await expect(page.getByText("15.0h").first()).toBeVisible();
});

test("Japanese locale changes calculator copy", async ({ page }) => {
  await page.goto("/calculator");
  await page.getByRole("button", { name: /日本語/ }).click();
  await expect(page.getByRole("heading", { name: "シフト予測を作成" })).toBeVisible();
});
