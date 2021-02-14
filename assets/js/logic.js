const HISTORY_URL = "https://77.47.130.190/history";
const STREAM_URL = "http://77.47.130.190:8000/stream.ogg";

class streamHandler {
	playBtn = document.getElementById("play-btn");
	volumeEl = document.getElementById("sound-volume");
	streamInstance;

	toggle() {
		let that = this;
		if (this.playBtn.dataset.state === "paused") {
			this.playBtn.dataset.state = "plays";

			this.streamInstance = new Audio(STREAM_URL);
			let playPromise = this.streamInstance.play(); // trying to start the stream
			if (playPromise !== undefined) {
				playPromise.then(function() {
					// Automatic playback started successfully
					that.updateVolume();
				}).catch(function(error) {
					// Automatic playback failed.
					// TODO: Show a UI element to let the user manually restart playback.
					console.error(error);
				});
			}
		}
		else if (this.playBtn.dataset.state === "plays") {
			this.playBtn.dataset.state = "paused";
			this.streamInstance.pause(); // stop stream
		}
	}

	updateVolume() {
		if (this.streamInstance !== undefined) {
			console.log(`${this.streamInstance.volume} set to ${this.volumeEl.value}`);
			this.streamInstance.volume = this.volumeEl.value;
		}
	}
}

class historyHandler {
	historyList = document.getElementsByClassName("history-url");
	currSong = document.getElementById("current-song-name");

	update() {
		fetch(HISTORY_URL)
			.then(response => {
				return response.json();
				// if (response.status === 200) {}
			})
			.then(json => {
				this.currSong.textContent = `${json[0]["performer"]} - ${json[0]["title"]}`;
				for (let i = 0; i < this.historyList.length; i++) {
					this.historyList[i].textContent = `${json[i+1]["performer"]} - ${json[i+1]["title"]}`;
				}
			})
			.catch(error => console.error(error));
	}

	mockUpdate() {
		const response = `[{"performer": "Slipknot", "title": "Duality", "start_time": "2021-02-14 14:17:11"}, {"performer": "\u0421\u0430\u043c\u043e\u0435 \u0411\u043e\u043b\u044c\u0448\u043e\u0435 \u041f\u0440\u043e\u0441\u0442\u043e\u0435 \u0427\u0438\u0441\u043b\u043e", "title": "\u041c\u043e\u043b\u043e\u0434\u043e\u0441\u0442\u044c \u043f\u0440\u043e\u0441\u0442\u0438\u0442", "start_time": "2021-02-14 14:13:18"}, {"performer": "Royal Blood", "title": "Loose Change", "start_time": "2021-02-14 14:10:46"}, {"performer": "\u0416\u0443\u043a\u0438", "title": "\u0421\u0435\u043b\u0430 \u0431\u0430\u0442\u0430\u0440\u0435\u0439\u043a\u0430", "start_time": "2021-02-14 14:07:05"}, {"performer": "\u043a\u0438\u0441-\u043a\u0438\u0441", "title": "\u043c\u043e\u043b\u0447\u0438", "start_time": "2021-02-14 14:03:50"}]`;
		const json = JSON.parse(response);
		this.currSong.textContent = `${json[0]["performer"]} - ${json[0]["title"]}`;
		for (let i = 0; i < this.historyList.length; i++) {
			this.historyList[i].textContent = `${json[i+1]["performer"]} - ${json[i+1]["title"]}`;
		}
	}
}

const stream = new streamHandler();
const history = new historyHandler();
history.mockUpdate()