/**
 * Listen for changes on the sliders, and send the appropriate message to
 * the content script in the page.
 */
import { browser } from "webextension-polyfill-ts";
import {ISimplifyOptions} from "../content_script";

function listenForInput(input) {
	input.addEventListener("input", () => {
		function updateSettings(tabs) {
			let settings: ISimplifyOptions = {
				simpliness: parseFloat((document.getElementById("simpliness") as any).value),
				shortness: parseFloat((document.getElementById("shortness") as any).value)
			};

			browser.tabs.sendMessage(tabs[0].id, {
					command: "simplify", settings,
				});
		}

		browser.tabs.query({active: true, currentWindow: true})
				.then(updateSettings)
				.catch(console.log);
	});
}

const inputs = document.querySelectorAll('input');

for (let input of Array.from(inputs)) {
	listenForInput(input);
}
