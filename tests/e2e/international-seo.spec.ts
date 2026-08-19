import { expect, test } from "@playwright/test";

test("root offers stable crawlable language choices", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { name: "Choose your language" })).toBeVisible();
  await expect(page.getByRole("link", { name: "English" })).toHaveAttribute("href", "/en");
  await expect(page.getByRole("link", { name: "日本語" })).toHaveAttribute("href", "/ja");
});

test("homepage roadmap offers a non-persistent feature voting preview", async ({ page }) => {
  await page.goto("/en");
  await expect(page.getByRole("heading", { name: "What's coming next" })).toBeVisible();
  await expect(page.getByText("Variable shift tracking", { exact: true })).toBeVisible();
  await expect(page.getByText("Resident tax estimator", { exact: true })).toBeVisible();
  await expect(page.getByText("Payslip upload", { exact: true })).toBeVisible();

  await page.getByRole("button", { name: "Help choose what we build next" }).click();
  const dialog = page.getByRole("dialog");
  await expect(dialog.getByRole("heading", { name: "What would help you most?" })).toBeVisible();
  await dialog.getByText("Payslip upload", { exact: true }).click();
  await dialog.getByRole("button", { name: "Choose this idea" }).click();
  await expect(dialog.getByText("Thanks for helping shape BaitoPlan!" )).toBeVisible();
});

for (const viewport of [{ width: 375, height: 812 }, { width: 768, height: 1024 }, { width: 1440, height: 900 }]) {
  test(`homepage and calculator fit a ${viewport.width}px viewport`, async ({ page }) => {
    await page.setViewportSize(viewport);
    await page.goto("/en");
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth)).toBe(true);
    await expect(page.getByRole("heading", { level: 1 })).toHaveCount(1);

    await page.goto("/en/calculator");
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth)).toBe(true);
    await expect(page.getByLabel("What do you call this job? 1")).toBeVisible();
    await expect(page.getByLabel("Pay per hour 1")).toBeVisible();
  });
}

test("feature voting dialog supports keyboard dismissal and restores focus", async ({ page }) => {
  await page.goto("/en");
  const trigger = page.getByRole("button", { name: "Help choose what we build next" });
  await trigger.focus();
  await trigger.press("Enter");
  await expect(page.getByRole("dialog")).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(page.getByRole("dialog")).toBeHidden();
  await expect(trigger).toBeFocused();
});

test("Japanese SEO page has localized metadata and switches to its English equivalent", async ({ page }) => {
  await page.goto("/ja/留学生-28時間");
  await expect(page.locator("html")).toHaveAttribute("lang", "ja");
  await expect(page.getByRole("heading", { level: 1, name: "留学生のアルバイト時間を自動計算" })).toBeVisible();
  await expect(page).toHaveTitle("留学生の週28時間アルバイト計算ツール｜BaitoPlan（バイトプラン）");
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute("href", /\/ja\/%E7%95%99%E5%AD%A6%E7%94%9F-28%E6%99%82%E9%96%93$/);
  await expect(page.locator('link[rel="alternate"][hreflang="en"]')).toHaveAttribute("href", /\/en\/international-student-work-hours-japan$/);
  await expect(page.locator('link[rel="alternate"][hreflang="x-default"]')).toHaveAttribute("href", /\/en\/international-student-work-hours-japan$/);

  await page.getByRole("link", { name: "English" }).click();
  await expect(page).toHaveURL(/\/en\/international-student-work-hours-japan$/);
  await expect(page.locator("html")).toHaveAttribute("lang", "en");
  await expect(page.getByRole("heading", { level: 1, name: "Check Your Part-Time Work Hours in Japan" })).toBeVisible();
});

test("sitemap and robots expose localized discovery files", async ({ request }) => {
  const sitemap = await request.get("/sitemap.xml");
  expect(sitemap.ok()).toBeTruthy();
  const sitemapText = await sitemap.text();
  expect(sitemapText).toContain("/en/international-student-work-hours-japan");
  expect(sitemapText).toContain(encodeURI("/ja/留学生-28時間"));

  const robots = await request.get("/robots.txt");
  expect(robots.ok()).toBeTruthy();
  expect(await robots.text()).toContain("Sitemap:");
});
