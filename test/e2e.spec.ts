import { test, expect } from '@playwright/test';

test.describe('PhotoSwipeImage Component', () => {
    test('should render gallery container', async ({ page }) => {
        await page.goto('/');
        const gallery = page.locator('#gallery');
        await expect(gallery).toBeVisible();
    });

    test('should render gallery with grid layout', async ({ page }) => {
        await page.goto('/');
        const gallery = page.locator('#gallery');
        await expect(gallery).toHaveClass(/grid/);
    });

    test('should include photoswipe module in page', async ({ page }) => {
        await page.goto('/');
        const hasPhotoswipeImport = await page.evaluate(() => {
            const html = document.documentElement.innerHTML;
            return html.includes('photoswipe') || html.includes('PhotoSwipe');
        });
        expect(hasPhotoswipeImport).toBe(true);
    });

    test('images should have photoswipe data attributes when present', async ({ page }) => {
        await page.goto('/');
        const imageLinks = page.locator('#gallery a');
        const count = await imageLinks.count();

        if (count === 0) {
            console.log('No images in gallery - skipping data attribute check');
            return;
        }

        const firstLink = imageLinks.first();
        await expect(firstLink).toHaveAttribute('data-pswp-width');
        await expect(firstLink).toHaveAttribute('data-pswp-height');
    });

    test('images should have grayscale effect classes', async ({ page }) => {
        await page.goto('/');
        const images = page.locator('#gallery img');
        const count = await images.count();

        if (count === 0) {
            console.log('No images in gallery - skipping grayscale check');
            return;
        }

        const firstImg = images.first();
        await expect(firstImg).toHaveClass(/grayscale/);
    });

    test('clicking image should open lightbox', async ({ page }) => {
        await page.goto('/');
        const imageLinks = page.locator('#gallery a');
        const count = await imageLinks.count();

        if (count === 0) {
            console.log('No images in gallery - skipping lightbox open test');
            return;
        }

        await imageLinks.first().click();
        const lightbox = page.locator('.pswp');
        await expect(lightbox).toBeVisible();
    });

    test('escape key should close lightbox', async ({ page }) => {
        await page.goto('/');
        const imageLinks = page.locator('#gallery a');
        const count = await imageLinks.count();

        if (count === 0) {
            console.log('No images in gallery - skipping lightbox close test');
            return;
        }

        await imageLinks.first().click();
        const lightbox = page.locator('.pswp');
        await expect(lightbox).toBeVisible();

        await page.waitForTimeout(500);
        await page.keyboard.press('Escape');
        await page.waitForTimeout(500);
        await expect(lightbox).toBeHidden();
    });
});
