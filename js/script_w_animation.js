var options = {'limit': 5, 'frequency': 5},
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
		offsetTop: 5,
		currentResult: 0
	}
	prevResults = [],
	currentResults = [],
	indicesToBeRemoved = [],
	bandsToBeKept = [],
	indicesToBeBuilt = [];
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
	indicesToBeRemoved = [];
	bandsToBeKept = [];
	currentResults = data;
	if(currentResults.length == prevResults.length) {
		indicesToBeRemoved = getBandsToBeRemovedAndKept(currentResults, prevResults);
		removeOldResults();
	} else {
		buildCurrentBands();
		shiftBands(currentResults, 'in');
	}
	prevResults = data;
	
	
}
function buildCurrentBands() {
	for (i = 0; i < appDisplay.numOfResults; i++) {
		$('.MRAppResults').append('<div id="MRResultNumber' + i + '" class="MRResult MRResultNumber' + i + '">' + currentResults[i].name + ' <span class="mentions"><span class="number">' + currentResults[i].count + '</span><span class="numberLabel">Mentions</span></span></div>')
						  .css('clip', 'rect(0, ' + resultsBox.width + 'px, ' + resultsBox.height + 'px, 0)')
						  
		$('#MRResultNumber' + i).css('left', ((resultsBox.width + resultsBox.offsetLeft) *  -1))
							    .css('top', (i * resultsBox.height/appDisplay.numOfResults));
	}
}
function changeNumber(num){}

function getBandsToBeRemovedAndKept(cur, prev){
	var i, 
		j;

	for(i = 0; i < prev.length; i++) {
		for (j = 0; j < cur.length; j++){
			if(prev[i].name == cur[j].name) {
				bandsToBeKept.push(i);
			} 
		}
	}

	console.log('removed ' + indicesToBeRemoved + ' kept ' + bandsToBeKept);
	return indicesToBeRemoved;
}
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
	$('.MRLeaderBoardBorder').append('<div class="MRAppResults"></div>');
}

function moveExistingBandsToNewPositions() {
	//get the new position
}

function removeOldResults() {
	resultsBox.currentResult = 0;
	shiftBand($('#MRResultNumber' + indicesToBeRemoved[0]), 'out');
}
function setResults(object, array, numResults){

}
function shiftBand(band, direction){
	
	if (direction == 'about') {

	}

	if (direction == 'in') {
		console.log(direction);
		band.animate({ left: '0'}, 300, function() {
			resultsBox.currentResult ++;
			if($('#MRResultNumber' + resultsBox.currentResult)) {
				shiftBand($('#MRResultNumber' + resultsBox.currentResult), 'in');
			}
		});
	} 

	if (direction == 'out') {
		if (resultsBox.currentResult < (indicesToBeRemoved.length)) {
			band.animate({ left: (resultsBox.width + resultsBox.offsetLeft)}, 300, function() {
				$('#MRResultNumber' + (indicesToBeRemoved[resultsBox.currentResult])).remove();
				resultsBox.currentResult ++;
				if($('#MRResultNumber' + indicesToBeRemoved[resultsBox.currentResult])) {
					shiftBand($('#MRResultNumber' + indicesToBeRemoved[resultsBox.currentResult]), 'out');
				}
			});
		} else {
			//last time!
			band.animate({ left: (resultsBox.width + resultsBox.offsetLeft)}, 300, function() {
				$('#MRResultNumber' + (indicesToBeRemoved[resultsBox.currentResult])).remove();
				moveExistingBandsToNewPositions();
				buildCurrentBands();
				shiftBands(currentResults, 'in');
			});
		}
		
	}

	
	
}
function shiftBands(data, direction) {
	resultsBox.currentResult = 0;
	shiftBand($('#MRResultNumber' + 0), direction);
}
function siftResults(prev, current){}
	//grab the first <numResults> from the array


