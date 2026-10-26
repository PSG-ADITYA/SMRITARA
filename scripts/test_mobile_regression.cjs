const puppeteer = require('puppeteer-core');
const fs = require('fs');

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';

const REQUIRED_VIEWPORTS = [
  { name: '320x640 (Small Mobile)', width: 320, height: 640, isMobile: true, hasTouch: true },
  { name: '375x812 (iPhone SE / X)', width: 375, height: 812, isMobile: true, hasTouch: true },
  { name: '390x844 (iPhone 12/13/14)', width: 390, height: 844, isMobile: true, hasTouch: true },
  { name: '430x932 (iPhone Pro Max)', width: 430, height: 932, isMobile: true, hasTouch: true },
  { name: '768x1024 (iPad Portrait)', width: 768, height: 1024, isMobile: true, hasTouch: true },
  { name: '1024x768 (iPad Landscape)', width: 1024, height: 768, isMobile: false, hasTouch: false },
  { name: '1280x800 (Laptop / Desktop)', width: 1280, height: 800, isMobile: false, hasTouch: false },
  { name: '1440x900 (Large Desktop)', width: 1440, height: 900, isMobile: false, hasTouch: false }
];

async function runMobileRegressionTest() {
  console.log('--- SMRITARA Multi-Viewport & Responsive Regression Test ---');

  if (!fs.existsSync(CHROME_PATH)) {
    console.error('Chrome not found at', CHROME_PATH);
    process.exit(1);
  }

  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  let testsPassed = 0;
  let testsFailed = 0;

  function assert(condition, message) {
    if (condition) {
      console.log(`  [PASS] ${message}`);
      testsPassed++;
    } else {
      console.error(`  [FAIL] ${message}`);
      testsFailed++;
    }
  }

  try {
    const page = await browser.newPage();

    // 1. Mobile Viewport Deep Test (390 x 844)
    console.log('\n--- 1. Deep Interaction Tests (Mobile 390x844) ---');
    await page.setViewport({ width: 390, height: 844, isMobile: true, hasTouch: true });
    await page.goto('http://localhost:5173', { waitUntil: 'networkidle2' });

    // If on welcome screen, click Explore Demo
    await page.evaluate(() => {
      const btns = Array.from(document.querySelectorAll('button'));
      const demo = btns.find(b => b.textContent && b.textContent.includes('Explore Demo'));
      if (demo) demo.click();
    });
    await new Promise(r => setTimeout(r, 800));

    // Test: Sidebar height on mobile should be compact (<= 140px)
    const sidebarHeight = await page.evaluate(() => {
      const el = document.querySelector('.app-sidebar');
      return el ? el.getBoundingClientRect().height : 0;
    });
    assert(sidebarHeight > 0 && sidebarHeight <= 140, `Mobile sidebar height is compact (${sidebarHeight.toFixed(1)}px <= 140px)`);

    // Test: Spoken guide bar is minimized on mobile and does not block screen
    const guideBarState = await page.evaluate(() => {
      const el = document.querySelector('.spoken-guide-bar');
      if (!el) return { found: false, minimized: false, height: 0 };
      const rect = el.getBoundingClientRect();
      const isMinimized = el.classList.contains('is-minimized') || rect.height < 80;
      return { found: true, minimized: isMinimized, height: rect.height };
    });
    assert(guideBarState.found && guideBarState.minimized, `Spoken guide bar is minimized by default on mobile (height: ${guideBarState.height.toFixed(1)}px)`);

    // Test: Page content is scrollable via touch / scrollBy
    const scrollTest = await page.evaluate(() => {
      const initialScroll = window.scrollY;
      window.scrollBy(0, 300);
      const afterScroll = window.scrollY;
      return { initialScroll, afterScroll, scrolled: afterScroll > initialScroll };
    });
    assert(scrollTest.scrolled, `Mobile window scrolls freely (from ${scrollTest.initialScroll} to ${scrollTest.afterScroll})`);

    // Test: Horizontal swipe navigation exists and contains tabs
    const navItemsCount = await page.evaluate(() => {
      const items = document.querySelectorAll('.sidebar-nav .nav-item');
      return items.length;
    });
    assert(navItemsCount >= 6, `Mobile swipeable navigation contains tabs (found ${navItemsCount} tabs)`);

    // Test: Can navigate to Cognitive Games on mobile
    const navigatedToGames = await page.evaluate(async () => {
      const buttons = Array.from(document.querySelectorAll('.sidebar-nav .nav-item'));
      const gamesBtn = buttons.find(b => b.textContent && b.textContent.includes('Games'));
      if (gamesBtn) {
        gamesBtn.click();
        return true;
      }
      return false;
    });
    assert(navigatedToGames, `Successfully tapped Games navigation tab on mobile`);
    await new Promise(r => setTimeout(r, 600));

    const gamesHeaderFound = await page.evaluate(() => {
      const h1 = document.querySelector('h1');
      return h1 ? h1.textContent.includes('Cognitive') : false;
    });
    assert(gamesHeaderFound, `Cognitive Games Center mounted and visible on mobile`);

    // 2. All 8 Viewports Horizontal Overflow Audit
    console.log('\n--- 2. Comprehensive 8-Viewport Layout & Overflow Audit ---');
    for (const vp of REQUIRED_VIEWPORTS) {
      await page.setViewport({
        width: vp.width,
        height: vp.height,
        isMobile: vp.isMobile,
        hasTouch: vp.hasTouch
      });
      await page.goto('http://localhost:5173', { waitUntil: 'networkidle2' });
      await page.evaluate(() => {
        const btns = Array.from(document.querySelectorAll('button'));
        const demo = btns.find(b => b.textContent && b.textContent.includes('Explore Demo'));
        if (demo) demo.click();
      });
      await new Promise(r => setTimeout(r, 400));

      const layoutCheck = await page.evaluate((expectedWidth) => {
        const docWidth = document.documentElement.scrollWidth;
        const winWidth = window.innerWidth;
        const noOverflow = docWidth <= winWidth + 1;
        const sidebar = document.querySelector('.app-sidebar');
        const sidebarRect = sidebar ? sidebar.getBoundingClientRect() : null;
        return {
          noOverflow,
          docWidth,
          winWidth,
          sidebarWidth: sidebarRect ? Math.round(sidebarRect.width) : null
        };
      }, vp.width);

      assert(layoutCheck.noOverflow, `Viewport ${vp.name}: No horizontal overflow (${layoutCheck.docWidth}px <= ${layoutCheck.winWidth}px)`);
    }

    // 3. Desktop Viewport Layout Preservation Test (1280 x 800)
    console.log('\n--- 3. Desktop Viewport Layout Preservation (1280x800) ---');
    await page.setViewport({ width: 1280, height: 800, isMobile: false, hasTouch: false });
    await page.goto('http://localhost:5173', { waitUntil: 'networkidle2' });
    await page.evaluate(() => {
      const btns = Array.from(document.querySelectorAll('button'));
      const demo = btns.find(b => b.textContent && b.textContent.includes('Explore Demo'));
      if (demo) demo.click();
    });
    await new Promise(r => setTimeout(r, 600));

    const desktopSidebar = await page.evaluate(() => {
      const el = document.querySelector('.app-sidebar');
      if (!el) return { found: false, width: 0, height: 0, isFlexCol: false };
      const rect = el.getBoundingClientRect();
      const style = window.getComputedStyle(el);
      return {
        found: true,
        width: rect.width,
        height: rect.height,
        position: style.position,
        isFlexCol: style.flexDirection === 'column'
      };
    });
    assert(desktopSidebar.found && desktopSidebar.width >= 200, `Desktop sidebar width preserved (${desktopSidebar.width.toFixed(1)}px >= 200px)`);
    assert(desktopSidebar.position === 'fixed' || desktopSidebar.height >= 700, `Desktop sidebar height preserved (${desktopSidebar.height.toFixed(1)}px)`);

    const desktopHeaderVisible = await page.evaluate(() => {
      const el = document.querySelector('.sidebar-desktop-header');
      return el ? window.getComputedStyle(el).display !== 'none' : false;
    });
    assert(desktopHeaderVisible, `Desktop brand header is visible on desktop`);

  } catch (err) {
    console.error('Error during regression test:', err);
    testsFailed++;
  } finally {
    await browser.close();
  }

  console.log(`\nRegression test summary: ${testsPassed} passed, ${testsFailed} failed.`);
  if (testsFailed > 0) {
    process.exit(1);
  }
}

runMobileRegressionTest();
