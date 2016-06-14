var fs = require('fs');
// fetch the input geojson
var obj = JSON.parse(fs.readFileSync('./tr-test.geojson', 'utf8'));
var relID = []; // array to store unique relation ID

// iterate through geojson to store unique relation ID

obj.features.forEach(function(item){
	
 if(item.properties["@relations"]!==undefined){
 	for(i=0; i<item.properties["@relations"].length; i++)
 	{
 	  if (relID.indexOf(item.properties["@relations"][i].rel) < 0)
		{
		  relID.push(item.properties["@relations"][i].rel);
					 			
		}
 	}
 	
 }

});

relID.forEach(function(item){

});

// console.log(relID);