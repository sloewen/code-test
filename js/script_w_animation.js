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
		offsetTop: 5,
		currentResult: 0,
		animationTime: 300,
	}
	deltaArray = [],
	prevResults = [],
	currentResults = [],
	indicesToBeRemoved = [],
	bandsToBeKept = [],
	newBandsToBuild = [];
(function () {
	makeDisplay();
	app.start()
})();
function update (data) {
	resetArrays();
	currentResults = data;
	if(currentResults.length == prevResults.length) {
		findIndexesToShiftOut(currentResults, prevResults);
	} else {
		buildCurrentBands();
	}
	prevResults = data;
}
function buildCurrentBands() {
	if (bandsToBeKept.length == 0) {
		for (i = 0; i < appDisplay.numOfResults; i++) {
			$('.MRAppResults').append(makeBandDiv(i, currentResults[i].name, currentResults[i].count))
						  	 .css('clip', 'rect(0, ' + resultsBox.width + 'px, ' + resultsBox.height + 'px, 0)')
			$('#MRResultNumber' + i).css('left', ((resultsBox.width + resultsBox.offsetLeft) *  -1))
							    	.css('top', (i * resultsBox.height/appDisplay.numOfResults));
		}
		shiftBand(0, 'in', currentResults);
	} else {
		for (i = 0; i < newBandsToBuild.length; i++) {
			$('.MRAppResults').append(makeBandDiv(newBandsToBuild[i].rank , newBandsToBuild[i].name, newBandsToBuild[i].count))
						  	 .css('clip', 'rect(0, ' + resultsBox.width + 'px, ' + resultsBox.height + 'px, 0)')
			$('#MRResultNumber' + newBandsToBuild[i].rank).css('left', ((resultsBox.width + resultsBox.offsetLeft) *  -1))
							    	.css('top', (newBandsToBuild[i].rank * resultsBox.height/appDisplay.numOfResults));
		}
	}
	if (newBandsToBuild.length > 0){
		shiftBand(newBandsToBuild[0].rank, 'in', currentResults);
	} else {
		shiftBand(0, 'in', currentResults);
	}
}
function replaceRemainingBandsWithNewDomElements() {
	var i, topValue, leftValue = 0;
	for(i = 0; i < bandsToBeKept.length; i++){
		topValue = bandsToBeKept[i].previousIndex * resultsBox.height/appDisplay.numOfResults;
		$('#MRResultNumber' + bandsToBeKept[i].previousIndex).remove();
		$('.MRAppResults').append(makeBandDiv(bandsToBeKept[i].currentIndex, currentResults[bandsToBeKept[i].currentIndex].name, currentResults[bandsToBeKept[i].currentIndex].count))
						  	 .css('clip', 'rect(0, ' + resultsBox.width + 'px, ' + resultsBox.height + 'px, 0)');
		$('#MRResultNumber' + bandsToBeKept[i].currentIndex).css({'left': leftValue, 'top': topValue});
	}
	shiftBand(bandsToBeKept[0].currentIndex, 'about');
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
function makeBandDiv(orderNum, name, counts) {
	return '<div id="MRResultNumber' + orderNum + '" class="MRResult MRResultNumber' 
									 + orderNum + '"><span class="bandName">' 
									 + name + '</span><span class="mentions"><span class="number">' 
									 + counts + '</span><span class="numberLabel">Mentions</span></span></div>';
}
function resetArrays() {
	indicesToBeRemoved = [];
	bandsToBeKept = [];
	deltaArray = [];
	newBandsToBuild = [];
}
function shiftBand(index, direction, array){
	var thisBand = $('#MRResultNumber' + index),
		nextBandIndex;
	if (direction == 'in') {
		if (index >=0) {
			thisBand.animate({ left: '0'}, resultsBox.animationTime, function() {
				nextBandIndex = findNextIndexToShiftIn(index);
				shiftBand(nextBandIndex, 'in', array);
			});
		} else {
			thisBand.animate({ left: '0'}, resultsBox.animationTime);
		}
		
	} else if (direction == 'out') {
		nextBandIndex = findNextIndex(index, array);
		if (nextBandIndex >= 0) {
			thisBand.animate({ left: appDisplay.width }, resultsBox.animationTime, function() {
				thisBand.remove();
				shiftBand(nextBandIndex, 'out', array);
			});
		} else {
			thisBand.animate({ left: appDisplay.width }, resultsBox.animationTime, function () {
				thisBand.remove();
				replaceRemainingBandsWithNewDomElements();
			});
		}
	} else if (direction == 'about') {
		nextBandIndex = findNextAboutIndex(index, bandsToBeKept);
		$('#MRResultNumber' + index + ' .number').text(currentResults[index].count);
		if(index == 4) {
			thisBand.animate({borderBottomWidth: "0px"}, 100)
		} else {
			thisBand.animate({borderBottomWidth: "1px"}, 100)
		}
		if (nextBandIndex >= 0) {
			thisBand.animate({ top: (index * resultsBox.height / appDisplay.numOfResults) }, resultsBox.animationTime, 'swing', function () {
				shiftBand(nextBandIndex, 'about');
			});
		} else {
			thisBand.animate({ top: (index * resultsBox.height / appDisplay.numOfResults) }, resultsBox.animationTime, 'swing', function () {
					buildCurrentBands();
			});
		}
	}
	
}

function findIndexesToShiftOut(current, previous){
	var i, j, isInBoth;
	for(i = 0; i < previous.length; i++){
		isInBoth = false;
		for (j=0; j < current.length; j++){
			if (previous[i].name == current[j].name){
				isInBoth = true;
				bandsToBeKept.push({'previousIndex' : i, 'currentIndex' : j});
			}
		}
		if (!isInBoth) {
			deltaArray.push(i);
		}
	}
	findNewBandsToBuild(currentResults, prevResults);
	shiftBand(deltaArray[0], 'out', deltaArray);
}
function findNextIndex(value, array) {
	var nextIndex = (jQuery.inArray(value, array)+1);
	if (deltaArray[nextIndex]) {
		return deltaArray[nextIndex];
	} 
	return -1;
}
function findNextAboutIndex(value, array) {
	var i;
	for (i=0; i < array.length; i++){
		if (value == array[i].currentIndex){
			if(i == (array.length - 1)){
				return -1;
			} else {
				return array[(i +	1)].currentIndex;	
			}
		} 
	}
	return -1;
}
function findNextIndexToShiftIn(index) {
	var i, nextIndex;
	if (newBandsToBuild.length == 0) {
		if(index < appDisplay.numOfResults){
			return index + 1;
		} else {
			return -1;
		}
	} else {
		for (i=0; i < newBandsToBuild.length; i++){
			
			if (index == newBandsToBuild[i].rank){
				if(i == (newBandsToBuild.length - 1)){
					return -1;
				} else {
					return newBandsToBuild[(i +	1)].rank;	
				}
			} 
		}
		return -1;
	}
}
function findNewBandsToBuild(current, previous) {
	var i, j, isInBoth;
	for(i = 0; i < current.length; i++){
		isInBoth = false;
		for (j=0; j < previous.length; j++){
			if (current[i].name == previous[j].name){
				isInBoth = true;
			}
		}
		if (!isInBoth) {
			newBand = {
				name : current[i].name,
				count : current[i].count,
				rank : i,
			}
			newBandsToBuild.push(newBand);
		}
	}
	return newBandsToBuild;
}