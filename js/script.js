var options = {'limit': 5, 'frequency': 15},
	app = new window.massrel.Poller(options, update),
	appDisplay = {
		height : 325,
		width : 580,
		numOfResults : 5,
	},
	resultsBox = {
		height : 215,
		width : 440,
		padding : {'left' : 32 , 'right': 32},
		margin : {'top' : 110},
		offsetLeft: 6,
		offsetTop: 5
	}
	prevResults = [],
	currentResults = [];

(function () {
	makeDisplay();
	app.start()
})();

function update (data) {
	var i;
	$('.MRAppResults').remove();
	$('.MRLeaderBoardBorder').append('<div class="MRAppResults"></div>');
	for (i = 0; i < appDisplay.numOfResults; i++) {
		$('.MRAppResults').append('<div class="MRResult MRResultNumber' + i + '">' + data[i].name + ' <span class="mentions"><span class="number">' + numberWithCommas(data[i].count) + '</span><span class="numberLabel">Mentions</span></span></div>');
	}
}

function changeNumber(num){}
function makeDisplay () {
	appDisplay.position = {'x' : ((window.innerWidth/2) - (appDisplay.width/2)),  'y' : (window.innerHeight/2) - (appDisplay.height/2)}
	$('body').append('<div class="MRApplicationDisplay"></div>');
	$('.MRApplicationDisplay').css('width', appDisplay.width)
							  .css('height', appDisplay.height)
							  .css('top', appDisplay.position.y)
							  .css('left', appDisplay.position.x);
	$('.MRApplicationDisplay').append('<div class="MRLeaderBoard"></div>');
	$('.MRLeaderBoard').css('width', resultsBox.width)
							  .css('height', resultsBox.height)
							  .css('top', resultsBox.margin.top + resultsBox.offsetTop)
							  .css('left', (appDisplay.width/2) - (resultsBox.width/2))
							  .css('opacity', .45);
    $('.MRApplicationDisplay').append('<div class="MRLeaderBoardBorder"></div>');
	$('.MRLeaderBoardBorder').css('width', resultsBox.width)
							  .css('height', resultsBox.height)
							  .css('top', resultsBox.margin.top)
							  .css('left', (appDisplay.width/2) - (resultsBox.width/2) - resultsBox.offsetLeft);
}
function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}


