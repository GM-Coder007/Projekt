// PRETVORJENA KODA IZ JEZIKA C V JAVASCRIPT
// VIR ORIGINALNE C KODE: https://github.com/GamalOthman/Ride-Quality-Analyzer



#define _GNU_SOURCE					// for function getline()
#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <ctype.h>
#include <math.h>

#define LINEMAX 150
#define MAX(a, b) ( (a > b)? a : b )
#define SAMPMAX	(int) 200e+3		// initial number of samples
#define PRINT_ERROR { perror(NULL); exit(EXIT_FAILURE);}

int nsamples;		// number of samples
int totalTime;		// total time of samples in msec
float avgTime; 		// average time of samples in msec

char **lineptr;
int nlines;

// errors function
void
printAndExit(char *s)
{
	puts(s);
	exit(EXIT_FAILURE);
}

// read lines until reach EOF
// or error occurs
void
readLines(FILE *fp)
{
	char *line;
	size_t bufsize = 0;				// getline will set the required value
	int alloc = 100e+3;
	lineptr = malloc(alloc * sizeof(char *));
	if( lineptr == NULL )
		PRINT_ERROR;
	
	for( nlines = 0; ; nlines++ )
	{
		line = NULL;		// getline will allocate for it
		if( getline(&line, &bufsize, fp) == -1 )  
			break;			// if EOF reached or error occured

		// reallocate if needed:
		if( nlines > alloc )
		{
			alloc *= 2;
			lineptr = realloc(lineptr, alloc * sizeof(char *));
			if( lineptr == NULL )
				PRINT_ERROR;
		}

		// store the line:
		lineptr[nlines] = line;
	}
}



void readFile() {
	var fileName = prompt("Enter name of file");
	var fp = fopen(fileName, "r");
	if(fp == NULL) {
		console.log("PRINT_ERROR");
	}
	readLines(fp);
	if(fclose(fp) == EOF) {
		console.log("PRINT_ERROR");
	}
}

function isComment(s) {
	if(s[0] == '#' || isspace(s)) {
		return true;
	}
	else {
		return false;
	}
}

function analyzeFile(xp, yp, zp, tp) {
	console.log("Analyzing File...");
	var lnptr = lineptr;
	while( isComment(lnptr[0]) ) {
		lnptr++;
	}
	var samp = 0;
	for(; !isComment(lnptr[0]); lnptr++, samp++) {
		sscanf(lnptr[0], "%f%f%f%d", xp++, yp++, zp++, tp++);
	}
	free(lineptr);
	nsamples = samp;
}

function calcTime(tp) {
	var i = nsamples;
	var tot = 0;
	for(; i-- > 0; tp++ )
		tot += *tp;

	totalTime = tot;		// total time in msec
	avgTime = (float) totalTime / nsamples;
}

function dismissSeconds(pxval, pyval, pzval, ptval) {
	var c;
	puts("Dismiss 5 seconds at beginning and end? (y/n)?");
	if( (c = getchar()) == EOF )
		printAndExit("error: input error!");
	else if( c == 'n' || c == 'N' )
		return;
	else if( c != 'y' && c != 'Y' )
		printAndExit("error: undefined input!");

	var t = 5 * 1000;		// time to skip in msec

	// skip begining:
	var i = t;
	while( i > 0 )
	{
		i -= **ptval;
		nsamples--, ++*pxval, ++*pyval, ++*pzval, ++*ptval;
	}

	// skip ending:
	var tp = *ptval;
	i = t;
	while( i > 0 )
	{
		i -= *(tp + nsamples);
		nsamples--;
	}

	// recalculate time:
	calcTime(*ptval);
}

// covert to javascript

function constructVectors(vp, xp, yp, zp) {
	let i;
	for( i = 0; i <= nsamples; i++ ) {
		// v = cuberoot( (x^3) + (y^3) + (z^3) )
		vp = cbrtf(pow(xp, 3) + pow(yp, 3) + pow(zp, 3));
		vp++, xp++, yp++, zp++;
	}
}

// old function
function findVal(val, mode) {
	let i = nsamples;

	if( !mode ) {
		let valmax = val;
		for(; i-- > 0; val++)
			valmax = MAX(valmax, fabsf(val));

		return valmax;
	} else {
		for(; i-- > 0; val++)
			if( fabsf(val) >= mode )
				document.write(`${nsamples-i}: ${fabsf(val)} <br>`);
	}
	return 0;
}

// old function
function printMax(val, s) {
	document.write(`${s} = ${findVal(val, 0)} <br>`);
}

function findVals(xp, lim) {
	let i = nsamples;
	let vals = 0;

	for(; i-- > 0; xp++)
		if( fabsf(xp) >= lim )
			vals++;

	return vals;
}


// vibration values struct:
var VibVals = {	
	level: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20],		// 20 levels starting from 1
	number: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20],		// number of vibrations above certain level
	percent: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20],		// percent of vibrations above certain level 
	avg: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20]			// average time of vibrations above certain level
};

// this function checks if the report applies to some rules
// and sets the ride quality according to these rules.
function calcRideQuality(vibp, maxLevel) {
	var quality = 0;
	// rules:
	
	// 1- vibration max rule: this rule checks if maximum 
		// vibration of the object is below a certain level.
	var vibMaxRule = [0, 2.0, 3.0, 4.0, 6.0, 7.0
		, 9.0, 10.0, 11.0, 13.0, 15.0];
	
	// 2- percent rule:  this rule checks if vibrations of the 
		// object under certain level is below a certain percent.
	var percentRule = [0, 0.02, 0.2, 2.0, 5.0, 9.0
		, 15.0, 25.0, 40.0, 50.0, 60.0];

	var stars = 0;	// number of stars in rating (of 10)
	var ri;			// rule index
	for(ri = 1; ri < 11; ri++)
		if( vibMaxRule[ri] >= maxLevel )
		{
			var j;
			for(j = ri-1; j >= 0; j--)
				// if one rule not apply, return to parent for
				if( vibp.percent[ri-j] > percentRule[j+1] )	
					break;

			// if all rules apply, set rating and exit loop.
			if( j < 0 )		
			{
				stars = 11 - ri;
				break;
			}
		}
	// starStr holds some '*'s equal to the number of stars
	var starStr = [];
	var p = starStr;
	while( p < starStr + stars )
	{
		*p++ = '*';
		*p = '\0';
	}

	console.log("\n" + starStr + " Your Ride Quality is " + stars + " of 10! " + starStr + "\n");
	free(starStr);	
};


generateReport = function(pval) {
	console.log("Generating Report...");
	var vibp = {
		level: new Array(21),
		number: new Array(21),
		percent: new Array(21),
		avg: new Array(21)
	};

	var nVals;
	var a, max = 20;
	for( a = 1; a <= max; a++ ) {
		nVals = findVals(pval, a);
		if( nVals ) {
			vibp.level[a] = a;
			vibp.number[a] = nVals;
			vibp.percent[a] = ((100 * nVals) / nsamples);
			vibp.avg[a] = (nVals * avgTime) /1000;
			var printed = console.log(
				"Vibrations more than %2.0f m/sec^2 represents %.3f%%\n"
				//", avg time %.3f sec\n"
				, vibp.level[a]
				, vibp.percent[a]
				);
			while( printed-- > 0 )
				console.log('-');

			console.log('\n');
		}
		else { 
			calcRideQuality(vibp, a);
			break;
		}
	}

	console.log("\nAdditional info:");
	console.log("Number of samples tested = %d\n", nsamples);
	console.log("Total time of samples= %.2f sec\n", (totalTime/1000));
	console.log("Average sample time = %.3f msec\n", avgTime);
};


function main() {
	puts("--* Welcome to Ride Quality Analyzer! *--\n");

	// read the file
	readFile();

	var xval, yval, zval;
	var tval;

	xval = malloc(nlines * sizeof(float));
	if( xval == NULL )
		{ PRINT_ERROR }
	yval = malloc(nlines * sizeof(float));
	if( yval == NULL )
		{ PRINT_ERROR }
	zval = malloc(nlines * sizeof(float));
	if( zval == NULL )
		{ PRINT_ERROR }
	tval = malloc(nlines * sizeof(int));
	if( tval == NULL )
		{ PRINT_ERROR }

	// extract information:
	analyzeFile(xval, yval, zval, tval);

	// calculate total and average time in msec:
	calcTime(tval);

	// skip boundary seconds:
	dismissSeconds(&xval, &yval, &zval, &tval);

	// construct vector data:
	var vval = malloc(nsamples * sizeof(float));
	if( vval == NULL )
		{PRINT_ERROR}
	else
		constructVectors(vval, xval, yval, zval);

	// analyze data and output a report & calculate ride quality
	generateReport(vval);

	if(0)
	{
		var i;
		for( i = 0; i <= nsamples; i++)
			printf("%d: %f, %f, %f, %d\n", i, *xval++, *yval++, *zval++, *tval++);
	}

	printf("\n");
	return 0;
}