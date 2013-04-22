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
	bandsToBeKept = [];
//initialize the app
(function () {
	makeDisplay();
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

function aboutAnimationCallback(oldIndex, newIndex, band) {
	console.log('the shift is done')
	if(newIndex == 4) {
		band.animate({borderBottomWidth: "0px"}, 200)
	} else {
		band.animate({borderBottomWidth: "1px"}, 200)
	}
	resultsBox.currentResult ++;
	if(bandsToBeKept[resultsBox.currentResult]) {
		console.log('calling shift again ' + newIndex);
		shiftBand($('#MRResultNumber' + bandsToBeKept[resultsBox.currentResult].previousIndex), 'about');
	} else {
		console.log('no more shifts ' + newIndex);
		//then we can move on, unless the remaining value is zero and needs to shift, then this fucks up
		//we need to wait until the last about animation is done before we move on
		buildCurrentBands();
		//shiftBands(currentResults, 'in');
		app.stop();
	}
}
function buildCurrentBands() {
	console.log('build called')
	var oldIndex,
		newIndex;
	//we can change the class names and ids here
	for (i = 0; i < appDisplay.numOfResults; i++) {
		oldIndex = isItInTheKeepers(i);
		//if it's in the keepers, don't build it, just change the classes and the ids
		if(oldIndex >= 0) {
			newIndex = i;
			
			//console.log('changing classes and ids' + ' MRResultNumber'+ newIndex);
			$('#MRResultNumber' + oldIndex).attr('id', ('MRResultNumberOld'+ newIndex))
										   .attr('class', ('MRResult OldBand' + oldIndex + ' MRResultNumber' + newIndex))
		//if it isn't in the keepers, build it

		} else {
			console.log('appending new nodes ' + i);
			$('.MRAppResults').append('<div id="MRResultNumber' + i + '" class="MRResult NewBand MRResultNumber' + i + '"><span class="bandName">' + currentResults[i].name + '</span><span class="mentions"><span class="number">' + currentResults[i].count + '</span><span class="numberLabel">Mentions</span></span></div>')
						  	 // .css('clip', 'rect(0, ' + resultsBox.width + 'px, ' + resultsBox.height + 'px, 0)')
			$('#MRResultNumber' + i).css('left', ((resultsBox.width + resultsBox.offsetLeft) *  -1))
							    	.css('top', (i * resultsBox.height/appDisplay.numOfResults));

		}
		
		
	}


}

//THIS FUNCTION IS FLAWED SOMEHOW
function bandIsToBeRemoved(num){
	//if it's in kept, return false
	var i;
	for (i = 0; i < bandsToBeKept.length; i++){
		if(bandsToBeKept[i].previousIndex == num) {
			console.log('keep ' + currentResults[num].name );
			return false;
		} 
	}
	return true;
}
function changeNumber(num){}




function getBandsToBeRemovedAndKept(cur, prev){
	var i, 
		j;

	for(i = 0; i < prev.length; i++) {
		for (j = 0; j < cur.length; j++){
			if(prev[i].name == cur[j].name) {
				bandsToBeKept.push({name : cur[j].name, count : cur[j].count, previousIndex : i, currentIndex : j});
			} 
		}
	}

	console.log('who we are keeping');
	console.log(bandsToBeKept);
	return indicesToBeRemoved;
}

function isItInTheKeepers(num) {
	var i;
	for (i = 0; i < bandsToBeKept.length; i++) {
		if (bandsToBeKept[i].currentIndex == num) {
			console.log('is it in keepers? ' + bandsToBeKept[i].previousIndex + ' new index is ' + bandsToBeKept[i].currentIndex)
			return bandsToBeKept[i].previousIndex;
		}
	}
	return -1;
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
	resultsBox.currentResult = 0;
	shiftBand($('#MRResultNumber' + bandsToBeKept[0].previousIndex), 'about');
}

function removeOldResults() {
	resultsBox.currentResult = 0;
	shiftBand($('#MRResultNumber0'), 'out');
}
function setResults(object, array, numResults){

}
function shiftBand(band, direction){
	var oldIndex,
		newIndex
	if (direction == 'about') {
		if(resultsBox.currentResult < bandsToBeKept.length) {
			oldIndex = bandsToBeKept[resultsBox.currentResult].previousIndex;
			newIndex = bandsToBeKept[resultsBox.currentResult].currentIndex;
			$('#MRResultNumber' + oldIndex + ' .number').text(bandsToBeKept[resultsBox.currentResult].count);
			band.animate({ top: (newIndex * resultsBox.height / appDisplay.numOfResults)}, 100, aboutAnimationCallback(oldIndex, newIndex, band));
		}
	}

	if (direction == 'in') {
		if(bandsToBeKept.length == 0) {
			band.animate({ left: '0'}, 300, function() {
				resultsBox.currentResult ++;
				if($('#MRResultNumber' + resultsBox.currentResult)) {
					shiftBand($('#MRResultNumber' + resultsBox.currentResult), 'in');
				}
			});
		} else {
			if($('#MRResultNumber' + resultsBox.currentResult).css('left') == 0){
				console.log('at ' + resultsBox.currentResult + 'not moving anything, skipping to next')
				resultsBox.currentResult ++;
				if($('#MRResultNumber' + resultsBox.currentResult)) {
					shiftBand($('#MRResultNumber' + resultsBox.currentResult), 'in');
				}
			} else {
				band.animate({ left: '0'}, 300, function() {
					resultsBox.currentResult ++;
					if($('#MRResultNumber' + resultsBox.currentResult)) {
						shiftBand($('#MRResultNumber' + resultsBox.currentResult), 'in');
					}
				});
			}
			
		}

	} 

	if (direction == 'out') {
		if (resultsBox.currentResult < (appDisplay.numOfResults-1)) {
			if(bandIsToBeRemoved(resultsBox.currentResult)) {
				console.log('removing ' + band.text);
				band.animate({ left: (resultsBox.width + resultsBox.offsetLeft)}, 300, function() {
					$('#MRResultNumber' + (resultsBox.currentResult)).remove();
					resultsBox.currentResult ++;
					if($('#MRResultNumber' + resultsBox.currentResult)) {
						shiftBand($('#MRResultNumber' + resultsBox.currentResult), 'out');
					}
				});
			} else {

				resultsBox.currentResult ++;
				if($('#MRResultNumber' + resultsBox.currentResult)) {
					shiftBand($('#MRResultNumber' + resultsBox.currentResult), 'out');
				}
			}
		} else {
			if(bandIsToBeRemoved(resultsBox.currentResult)) {
				console.log('removing ' + currentResults[resultsBox.currentResult].name);
				band.animate({ left: (resultsBox.width + resultsBox.offsetLeft)}, 300, function() {
					$('#MRResultNumber' + (resultsBox.currentResult)).remove();
					$('#MRResultNumber' + (indicesToBeRemoved[resultsBox.currentResult])).remove();
					//moveExistingBandsToNewPositions();
					buildCurrentBands();
					//shiftBands(currentResults, 'in');
					app.stop();
				});
			} else {
				//moveExistingBandsToNewPositions();
				buildCurrentBands();
				//shiftBands(currentResults, 'in');
				app.stop();
			} 
		}
		
	}

	
	
}

function shiftBands(data, direction) {
	resultsBox.currentResult = 0;
	shiftBand($('#MRResultNumber' + 0), direction);
}
function siftResults(prev, current){}
	//grab the first <numResults> from the array


