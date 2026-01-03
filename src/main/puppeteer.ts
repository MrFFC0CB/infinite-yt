import puppeteer, { Page, Browser } from 'puppeteer';
import fs from 'fs';
import path from 'path';

const pathToCookieFile = path.join(process.cwd(), 'data/cookies.json');

const blockPupResources = async (page: Page) => {
	// Block images, css, fonts and other resources
	await page.setRequestInterception(true);
	page.on('request', (req) => {
		const resourceType = req.resourceType();
		const resourceUrl = req.url();

		if (['image', 'stylesheet', 'font'].includes(resourceType)) {
			req.abort();
		} else if (
			resourceType === 'xhr' &&
			(resourceUrl.includes('googleads') || resourceUrl.includes('doubleclick') || resourceUrl.includes('gtm'))
		) {
			return req.abort();
		} else {
			req.continue();
		}
	});
};

const loadCookies = async (browser: Browser) => {
	let cookies;
	try {
		cookies = fs.readFileSync(pathToCookieFile, 'utf-8').trim();
		if (cookies) cookies = JSON.parse(cookies);
	} catch (error) {
		console.log('Cookies file not found. Attempting to create it...');
		// create empty cookies.json if doesn't exists
		fs.writeFile(pathToCookieFile, '[]', (err) => {
			if (err) throw err;
		});
	}

	if (cookies) await browser.setCookie(...cookies);
};

let isPupRunning = false;
/*
	Timeout example:
		await new Promise(resolve => setTimeout(resolve, 2000));
		const navigationPromise = page.waitForNavigation({waitUntil: "domcontentloaded"});
*/
async function fetchRelateds(currentVideoId: string): Promise<VideoDataType[]> {
	if (isPupRunning) return [];
	isPupRunning = true;

	const browser = await puppeteer.launch({
		// headless: false,
		defaultViewport: {
			width: 1024,
			height: 768
		}
	});

	try {
		const page = await browser.newPage();

		page.setUserAgent({userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/129.0.0.0 Safari/537.36'});

		await blockPupResources(page);

		await loadCookies(browser);

		await page.goto(`https://music.youtube.com/watch?v=${currentVideoId}`, {
			waitUntil: 'networkidle2'
		});

		await page.waitForSelector('#player-page #side-panel #tabsContainer #tabsContent .tab-header');

		await page.locator('#player-page #tab-renderer').scroll({
			scrollTop: 5000,
			scrollLeft: 0,
		});

		await new Promise(resolve => setTimeout(resolve, 500));

		const relatedsArray: VideoDataType[] = [];

		const fromUpNextTab = await page.$$eval('#automix-contents img.yt-img-shadow', links => {
			return links.map(e => {
				const videoId = (e.src.includes('ytimg.com/vi/')) ? e.src.split('vi/')[1].split('/')[0] : '';

				if (!videoId) return null;

				const songArtist = e?.closest<HTMLElement>('ytmusic-player-queue-item')?.querySelector<HTMLElement>('.song-info .byline')?.title;
				const songTitle = e?.closest<HTMLElement>('ytmusic-player-queue-item')?.querySelector<HTMLElement>('.song-info .song-title')?.title;

				return {
					videoId: videoId,
					videoTitle: songArtist + ' · ' + songTitle
				};
			})
			.filter((v): v is VideoDataType => v !== null);
		});

		relatedsArray.push(...fromUpNextTab);

		await page.click('#player-page #side-panel #tabsContainer #tabsContent .tab-header:last-of-type');

		await page.waitForSelector('#player-page #items-wrapper a[href*="watch?v="]');

		await new Promise(resolve => setTimeout(resolve, 1000));

		const fromRelatedsTab = await page.$$eval('#player-page #items-wrapper a[href*="watch?v="]', links => {
			return links.map(e => {
				// const linkText = e.textContent.trim();
				const linkText = e.innerText.trim();

				if (
					e?.closest<HTMLElement>('.ytmusic-section-list-renderer')?.textContent?.toLocaleLowerCase().includes('other performances')
					|| 
					linkText.toLowerCase().includes('enganchado rock') 
					|| 
					linkText.toLowerCase().includes('enganchado retro')
					|| 
					linkText.toLowerCase().includes('cuarteto enganchado')
				) {
					// console.log(`%cskipping%c: ${linkText}`, 'font-weight: bold', 'font-weight: normal');
					return null;
				}
				// console.log(`linkText: `, linkText);

				return {
					videoId: e.href.split('watch?v=')[1].split('&')[0],
					videoTitle: linkText
				};
			})
			.filter(Boolean);
		});

		fromRelatedsTab.forEach((elm, index)=>{
			relatedsArray.splice(2 * index + 1, 0, {
				videoId: elm?.videoId || '',
				videoTitle: elm?.videoTitle || '',
			});
		});

		// console.log(`relatedsArray.length: `, relatedsArray.length);

		/* await page.goto(`https://youtube.com/watch?v=${currentVideoId}`, {
			waitUntil: 'networkidle2'
		});

		// await navigationPromise;
		
		await page.locator('html').scroll({
			scrollLeft: 0,
			scrollTop: 3000,
		});

		await new Promise(resolve => setTimeout(resolve, 800));

		await page.waitForSelector('ytd-compact-video-renderer a#thumbnail');

		const relatedIds = await page.evaluate(
			() => Array.from(
				document.querySelectorAll('ytd-compact-video-renderer a#thumbnail'),
				el => el.getAttribute('href').split('watch?v=')[1].split('&')[0]
			)
		);
		const relatedTitles = await page.evaluate(
			() => Array.from(
				document.querySelectorAll('ytd-compact-video-renderer span#video-title'),
				el => el.getAttribute('title')
			)
		);

		console.log(`relatedIds.length: `, relatedIds.length);
		console.log(`relatedTitles.length: `, relatedTitles.length);

		relatedIds.forEach((elm, index)=>{
			relatedsArray.splice(2 * index + 1, 0, {
				videoId: elm,
				videoTitle: relatedTitles[index],
			});
		}); */

		/* // console.log(await page.cookies());
		cookies = await page.cookies();
		fs.writeFileSync(pathToCookieFile, JSON.stringify(cookies, null, 2)); */

		return relatedsArray;
	} catch (error) {
		// console.log(`error.name: `, error.name);
		console.log(`Error fetching related videos: `, error);

		return [];
	} finally {
		await browser.close();
		isPupRunning = false;
	}
};


async function fetchSearchResults(searchString: string, resultsToSkip: number = 0): Promise<VideoDataType[]> {
	if (isPupRunning) return [];
	isPupRunning = true;

	const browser = await puppeteer.launch({
		// headless: false,
		/* defaultViewport: {
			width: 1024,
			height: 1200
			} */
	});

	try {
		const page = await browser.newPage();

		page.setUserAgent({userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/129.0.0.0 Safari/537.36'});

		await blockPupResources(page);

		await loadCookies(browser);

		// yt music
		await page.goto(`https://music.youtube.com/search?q=${searchString}`, {
			waitUntil: 'networkidle2'
		});

		await new Promise(resolve => setTimeout(resolve, 500));

		// get data from 'songs' tab
		const songsTabBtn = await page.$('a[title*="song results"]');
		
		songsTabBtn?.click();

		await new Promise(resolve => setTimeout(resolve, 5000));

		if (resultsToSkip > 0) {
			await page.locator('html').scroll({
				scrollLeft: 0,
				scrollTop: 3000,
			});

			await new Promise(resolve => setTimeout(resolve, 1000));
		}

		const songsResultsArray = await page.$$eval('#content a[href*="watch?v="]', el => {
			return el.map(e => {
				return {
					videoId: e.href.split('watch?v=')[1].split('&')[0],
					videoTitle: e.innerText
				};
			});
		});

		// get data from 'videos' tab
		const videosTabBtn = await page.$('a[title*="video results"]');
		
		videosTabBtn?.click();

		await new Promise(resolve => setTimeout(resolve, 2000));

		if (resultsToSkip > 0) {
			await page.locator('html').scroll({
				scrollLeft: 0,
				scrollTop: 3000,
			});

			await new Promise(resolve => setTimeout(resolve, 1000));
		}
		
		const videosResultsArray = await page.$$eval('#content a[href*="watch?v="]', el => {
			return el.map(e => {
				return {
					videoId: e.href.split('watch?v=')[1].split('&')[0],
					videoTitle: e.innerText
				}
			});
		});

		const resultsArray: VideoDataType[] = [];
		for (let i = 0; i < Math.max(songsResultsArray.length, videosResultsArray.length); i++) {
			if (songsResultsArray[i]) {
				if (!resultsArray.includes(songsResultsArray[i])) resultsArray.push(songsResultsArray[i]);
			}
			if (videosResultsArray[i]) {
				if (!resultsArray.includes(videosResultsArray[i])) resultsArray.push(videosResultsArray[i]);
			}
		}

		return resultsArray;
	} catch (error) {
		console.log(`Error getting search results: `, error);

		return [];
	} finally {
		await browser.close();
		isPupRunning = false;
	}
};

export { fetchRelateds, fetchSearchResults };