const puppeter = require("puppeteer");
const cluster = require("cluster");
const process = require("process");

const openWithPuppeter = async (url) => {
	const browser = await puppeter.launch({
		args: ["--use-fake-ui-for-media-stream"],
		headless: false,
	});
	const page = await browser.newPage();
	page.goto(url).then(() => {
		page
			.$(
				"#root > div.MuiGrid-root.MuiGrid-container.MuiGrid-direction-xs-column.MuiGrid-align-items-xs-center.MuiGrid-justify-xs-center > button"
			)
			.then((el) => el.click())
			.catch(console.error);
	});
	setTimeout(() => {
		return browser.close();
	}, 10000);
};

const url = [
	"https://ocrfr.alpabit.com:3010/onboarding?sipExtension=3131&password=FnRwamun",
	"https://ocrfr.alpabit.com:3010/onboarding?sipExtension=3181&password=NcSGUFcU5",
];

multiThread(url, (url) => {
	openWithPuppeter(url);
});

function multiThread(dataArr, func) {
	if (cluster.isPrimary) {
		console.log(`Primary ${process.pid} is running`);

		// Fork workers.
		for (let i = 0; i < dataArr.length; i++) {
			cluster.fork();
			func(dataArr[i]);
		}

		cluster.on("exit", (worker, code, signal) => {
			console.log(`worker ${worker.process.pid} died`);
		});
	} else {
		// Workers can share any TCP connection
		// In this case it is an HTTP server

		console.log(`Worker ${process.pid} started`);
	}
}

