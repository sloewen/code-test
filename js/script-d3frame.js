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
		margin : {'top' : 110}, //from the top of the app, not distance from logo
		offsetLeft: 6,
		offsetTop: 5
	}
	prevResults = [],
	currentResults = [];
//initialize the app
(function () {
	//get screen dimensions 
	//make the box
	makeDisplay();
	//start the app
	app.start()
})();





function update (data) {
	var i;
	console.log(data);

	$('.MRAppResults').remove();
	$('.MRLeaderBoardBorder').append('<div class="MRAppResults"></div>');
	for (i = 0; i < appDisplay.numOfResults; i++) {
		$('.MRAppResults').append('<div class="MRResult MRResultNumber' + i + '">' + data[i].name + ' <span class="mentions"><span class="number">' + data[i].count + '</span><span class="numberLabel">Mentions</span></span></div>');
	}
	//set current results
	//if we have previous results, loop through the current results. if prev is not in current, shift out. If prev is in a different position, change position
	//shift in new bands
	//set previous results
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

	//make an svg object
	//$('.MRApplicationDisplay').append('<svg width=' + resultsBox.width + ' height=' + resultsBox.height + '><rect fill=none width=' + resultsBox.width + ' height=' + resultsBox.height + ' rx='+ 15 +' /></svg>');						  
	//$('.MRApplicationDisplay svg').css('top', resultsBox.margin.top + 5)
							  	  //.css('left', (appDisplay.width/2) - (resultsBox.width/2) + 5);

}
function setResults(object, array, numResults){

}
function shiftBand(band, direction){}
function siftResults(prev, current){}
	//grab the first <numResults> from the array


