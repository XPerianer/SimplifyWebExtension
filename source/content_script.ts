import {browser} from "webextension-polyfill-ts";

export interface ISimplifyOptions {
	simpliness: number; // [0, 100]
	shortness: number; // [0, 100]
}

let originalParagraphTexts = Array.from(document.getElementsByTagName("p")).map(p => p.innerText);

(function() {

	console.log("Hello, here is SimplifyWebExtension");

	function adjustText(text: string[], options: ISimplifyOptions, changeFunction: (text: string[]) => void): void {
		const socket = new WebSocket('ws://localhost:8080');
		debugger
		socket.addEventListener('open', function (event) {
			socket.send(JSON.stringify({"text": text, "options": options}));
		});

		socket.addEventListener('message', function (event) {
			console.log('Message from server ', event.data);
			const response = JSON.parse(event.data);
			changeFunction(response.text);
			// doesn't work, need to use local storage or sth to remember state between invocations
			// (document.getElementById("simpliness") as any).value = response.options.simpliness;
			// (document.getElementById("shortness") as any).value = response.options.shortness;
		});
	}

	function modifyPage(configuration: ISimplifyOptions){
		console.log(configuration);
		let paragraphs = Array.from(document.getElementsByTagName("p"));
		adjustText(originalParagraphTexts, configuration, newContent => {
			for(let i=0; i < paragraphs.length; i++) {
				paragraphs[i].innerText = newContent[i];
				// debugger
			}
		});
	}

	modifyPage({simpliness: 100, shortness: 100});

	/**
	 * Listen for messages from the background script.
	 */
	browser.runtime.onMessage.addListener((message) => {
		if (message.command === "simplify") {
			modifyPage(message.settings)
		} else {
			console.log(`Unexpected message command, message was ${message}`);
		}
	});

})();
