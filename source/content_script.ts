import {browser} from "webextension-polyfill-ts";

(function() {

	console.log("Hello, here is SimplifyWebExtension");


	function modifyPage(configuration){
		console.log(configuration);
		let paragraphs = Array.from(document.getElementsByTagName("p"));
		let content = paragraphs.map(p => p.innerText);
		console.log(content);
		let newContent = adjustText(content, configuration);

		for(let i=0; i < paragraphs.length; i++) {
			paragraphs[i].innerText = newContent[i];
			debugger
		}

	}

	function adjustText(text: string[], configuration) {
		return text.map(text => text.toUpperCase());
	}

	modifyPage({simpliness: 50, shortness: 50});

	/**
	 * Listen for messages from the background script.
	 * Call "insertBeast()" or "removeExistingBeasts()".
	 */
	browser.runtime.onMessage.addListener((message) => {
		if (message.command === "simplify") {
			modifyPage(message.settings)
		} else {
			console.log(`Unexpected message command, message was ${message}`);
		}
	});

})();
