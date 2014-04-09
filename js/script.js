bestBands = function () {
	var options = {'limit': 5, 'frequency': 15},
	app = new window.massrel.Poller(options, update),
	appDisplay = {
		height : 325,
		width : 580,
		numOfResults : 5,
	},
	resultsBox = {
		height : appDisplay.numOfResults * 45,
		width : 440,
		padding : {'left' : 32 , 'right': 32},
		margin : {'top' : 110},
		offsetLeft: 6,
		offsetTop: 5
	},
	prevResults = [],
	currentResults = [];

	return {
		init: function () {
			makeDisplay();
			app.start();
		}
	};

	function update (data) {
		var i;
		$('.MRAppResults').remove();
		$('.MRLeaderBoardBorder').append('<div class="MRAppResults"></div>');
		for (i = 0; i < appDisplay.numOfResults; i++) {
			$('.MRAppResults').append('<div class="MRResult MRResultNumber' + i + '">' + data[i].name + ' <span class="mentions"><span class="number">' + numberWithCommas(data[i].count) + '</span><span class="numberLabel">Mentions</span></span></div>');
		}
	}
	function makeDisplay () {
		appDisplay.position = {'x' : ((window.innerWidth/2) - (appDisplay.width/2)),  'y' : (window.innerHeight/2) - (appDisplay.height/2)};
		$('body').append('<div class="MRApplicationDisplay"></div>');
		$('.MRApplicationDisplay').css({'width': appDisplay.width, 
										'height': appDisplay.height,
										'top': appDisplay.position.y,
										'left': appDisplay.position.x
									});
		$('.MRApplicationDisplay').append('<div class="MRLeaderBoard"></div>');
		$('.MRLeaderBoard').css({'width': resultsBox.width,
								  'height': resultsBox.height,
								  'top': resultsBox.margin.top + resultsBox.offsetTop,
								  'left': (appDisplay.width/2) - (resultsBox.width/2),
								  'opacity': 0.8});
	    $('.MRApplicationDisplay').append('<div class="MRLeaderBoardBorder"></div>');
		$('.MRLeaderBoardBorder').css({'width': resultsBox.width,
								  'height': resultsBox.height,
								  'top': resultsBox.margin.top,
								  'left': (appDisplay.width/2) - (resultsBox.width/2) - resultsBox.offsetLeft});
	}
}();
bestBands.init();

function numberWithCommas(x) {
	console.log('nwc ' + x);
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}