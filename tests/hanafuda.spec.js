import { test, expect } from '@playwright/test';

test.describe('Hanafuda Score Tracker', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should display setup section on initial load', async ({ page }) => {
    await expect(page.locator('#setupSection')).toBeVisible();
    await expect(page.locator('h1')).toContainText('Ханафуда');
    await expect(page.locator('label[for="player1Name"]')).toBeVisible();
    await expect(page.locator('label[for="player2Name"]')).toBeVisible();
  });

  test('should start game with default values', async ({ page }) => {
    await page.click('button:has-text("Начать игру")');
    
    await expect(page.locator('#gameSection')).toBeVisible();
    await expect(page.locator('#setupSection')).not.toBeVisible();
    await expect(page.locator('#player1Display')).toContainText('Игрок 1');
    await expect(page.locator('#player2Display')).toContainText('Игрок 2');
    await expect(page.locator('#player1Score')).toContainText('30');
    await expect(page.locator('#player2Score')).toContainText('30');
  });

  test('should start game with custom player names', async ({ page }) => {
    await page.fill('#player1Name', 'Alice');
    await page.fill('#player2Name', 'Bob');
    await page.click('button:has-text("Начать игру")');
    
    await expect(page.locator('#player1Display')).toContainText('Alice');
    await expect(page.locator('#player2Display')).toContainText('Bob');
  });

  test('should display winner buttons', async ({ page }) => {
    await page.click('button:has-text("Начать игру")');
    
    await expect(page.locator('#winnerBtn1')).toBeVisible();
    await expect(page.locator('#winnerBtn2')).toBeVisible();
    await expect(page.locator('#winnerBtn1')).toContainText('Игрок 1');
    await expect(page.locator('#winnerBtn2')).toContainText('Игрок 2');
  });

  test('should select winner and calculate points', async ({ page }) => {
    await page.click('button:has-text("Начать игру")');
    
    // Select winner
    await page.click('#winnerBtn1');
    await expect(page.locator('#winnerBtn1')).toHaveClass(/active/);
    
    // Select a yaku combination
    await page.click('.yaku-btn:has-text("Касу")');
    await expect(page.locator('.yaku-btn:has-text("Касу")')).toHaveClass(/active/);
    
    // Check that points are calculated
    await expect(page.locator('#pointsEarned')).toBeVisible();
  });

  test('should submit a deal and update scores', async ({ page }) => {
    await page.click('button:has-text("Начать игру")');
    
    // Select winner
    await page.click('#winnerBtn1');
    
    // Select a yaku
    await page.click('.yaku-btn:has-text("Касу")');
    
    // Submit deal
    await page.click('button:has-text("Подтвердить раздачу")');
    
    // Check that scores are updated
    const player1Score = await page.locator('#player1Score').textContent();
    const player2Score = await page.locator('#player2Score').textContent();
    
    expect(parseInt(player1Score)).toBeGreaterThan(30);
    expect(parseInt(player2Score)).toBeLessThan(30);
  });

  test('should display deal history', async ({ page }) => {
    await page.click('button:has-text("Начать игру")');
    
    // Submit first deal
    await page.click('#winnerBtn1');
    await page.click('.yaku-btn:has-text("Касу")');
    await page.click('button:has-text("Подтвердить раздачу")');
    
    // Check history
    await expect(page.locator('.history-section')).toBeVisible();
    await expect(page.locator('.history-item')).toContainText('Раздача 1');
  });

  test('should allow editing a deal', async ({ page }) => {
    await page.click('button:has-text("Начать игру")');
    
    // Submit first deal
    await page.click('#winnerBtn1');
    await page.click('.yaku-btn:has-text("Касу")');
    await page.click('button:has-text("Подтвердить раздачу")');
    
    // Edit the deal
    await page.click('button:has-text("Редактировать")');
    
    // Check that edit mode is active
    await expect(page.locator('button:has-text("Сохранить изменения")')).toBeVisible();
    await expect(page.locator('#cancelEditBtn')).toBeVisible();
  });

  test('should switch language to English', async ({ page }) => {
    await page.click('#langEn');
    
    await expect(page.locator('#langEn')).toHaveClass(/active/);
    await expect(page.locator('h1')).toContainText('Hanafuda');
    await expect(page.locator('button:has-text("Start Game")')).toBeVisible();
  });

  test('should switch language to Russian', async ({ page }) => {
    // Switch to English first
    await page.click('#langEn');
    await expect(page.locator('button:has-text("Start Game")')).toBeVisible();
    
    // Switch back to Russian
    await page.click('#langRu');
    
    await expect(page.locator('#langRu')).toHaveClass(/active/);
    await expect(page.locator('button:has-text("Начать игру")')).toBeVisible();
  });

  test('should increment and decrement number inputs', async ({ page }) => {
    const initialPointsInput = page.locator('#initialPoints');
    const initialValue = await initialPointsInput.inputValue();
    
    // Increment - find the button in the same number-input-wrapper
    const wrapper = page.locator('#initialPoints').locator('xpath=ancestor::div[contains(@class, "number-input-wrapper")]');
    await wrapper.locator('button:has-text("+")').click();
    const incrementedValue = await initialPointsInput.inputValue();
    expect(parseInt(incrementedValue)).toBeGreaterThan(parseInt(initialValue));
    
    // Decrement
    await wrapper.locator('button:has-text("−")').click();
    const decrementedValue = await initialPointsInput.inputValue();
    expect(parseInt(decrementedValue)).toBe(parseInt(initialValue));
  });

  test('should handle koi-koi count input', async ({ page }) => {
    await page.click('button:has-text("Начать игру")');
    
    const koiKoiInput = page.locator('#koiKoiCount');
    await expect(koiKoiInput).toHaveValue('0');
    
    // Increment koi-koi count
    await page.locator('.koi-koi-input button:has-text("+")').click();
    await expect(koiKoiInput).toHaveValue('1');
  });

  test('should validate winner selection before submitting', async ({ page }) => {
    await page.click('button:has-text("Начать игру")');
    
    // Try to submit without selecting winner
    await page.click('button:has-text("Подтвердить раздачу")');
    
    // Should show alert (we can't easily test alerts, but we can check that deal wasn't submitted)
    const dealNumber = await page.locator('#dealNumber').textContent();
    expect(dealNumber).toContain('Раздача 1');
  });

  test('should validate yaku selection before submitting', async ({ page }) => {
    await page.click('button:has-text("Начать игру")');
    
    // Select winner but no yaku
    await page.click('#winnerBtn1');
    
    // Try to submit
    await page.click('button:has-text("Подтвердить раздачу")');
    
    // Deal should not be submitted (deal number should still be 1)
    const dealNumber = await page.locator('#dealNumber').textContent();
    expect(dealNumber).toContain('Раздача 1');
  });

  test('should disable conflicting yaku combinations', async ({ page }) => {
    await page.click('button:has-text("Начать игру")');
    
    // Select one light combination using data attribute for precision
    await page.click('.yaku-btn[data-yaku="sanko"]');
    await expect(page.locator('.yaku-btn[data-yaku="sanko"]')).toHaveClass(/active/);
    
    // Other light combinations should be disabled
    await expect(page.locator('.yaku-btn[data-yaku="shiko"]')).toHaveClass(/disabled/);
    await expect(page.locator('.yaku-btn[data-yaku="goku"]')).toHaveClass(/disabled/);
  });

  test('should allow extra cards input for specific yaku', async ({ page }) => {
    await page.click('button:has-text("Начать игру")');
    
    // Select a yaku that supports extra cards
    await page.click('#winnerBtn1');
    await page.click('.yaku-btn[data-yaku="kasu"]');
    
    // Check that extra cards input is visible
    await expect(page.locator('#extra-cards-kasu')).toBeVisible();
    
    // Increment extra cards - find button in the same number-input-wrapper
    const extraCardsWrapper = page.locator('#extra-cards-kasu').locator('xpath=ancestor::div[contains(@class, "number-input-wrapper")]');
    await extraCardsWrapper.locator('button:has-text("+")').click();
    await expect(page.locator('#extra-cards-kasu')).toHaveValue('1');
  });

  test('should reset game', async ({ page }) => {
    await page.click('button:has-text("Начать игру")');
    
    // Submit a deal
    await page.click('#winnerBtn1');
    await page.click('.yaku-btn:has-text("Касу")');
    await page.click('button:has-text("Подтвердить раздачу")');
    
    // Reset game
    page.on('dialog', dialog => dialog.accept());
    await page.click('button:has-text("Сбросить игру")');
    
    // Should return to setup
    await expect(page.locator('#setupSection')).toBeVisible();
  });

  test('should persist game state in localStorage', async ({ page }) => {
    await page.fill('#player1Name', 'Test Player 1');
    await page.fill('#player2Name', 'Test Player 2');
    await page.click('button:has-text("Начать игру")');
    
    // Reload page
    await page.reload();
    
    // Game should be restored
    await expect(page.locator('#gameSection')).toBeVisible();
    await expect(page.locator('#player1Display')).toContainText('Test Player 1');
    await expect(page.locator('#player2Display')).toContainText('Test Player 2');
  });

  test('should persist language preference', async ({ page }) => {
    // Switch to English
    await page.click('#langEn');
    await expect(page.locator('button:has-text("Start Game")')).toBeVisible();
    
    // Reload page
    await page.reload();
    
    // Language should be persisted
    await expect(page.locator('#langEn')).toHaveClass(/active/);
    await expect(page.locator('button:has-text("Start Game")')).toBeVisible();
  });
});

