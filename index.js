var fs = require('fs');
// fetch the input geojson
var obj = JSON.parse(fs.readFileSync('./tr-test.geojson', 'utf8'));
var relID = []; // array to store unique relation ID
var fromFeatureJSON;
var relGroup ={
 'type': 'FeatureCollection',
 'features': []
 };


function constructJSON(fromFeature, trType, trID){
 var featureJSON = {
  "type": "Feature",
  "properties": {},
  "geometry": {
      "coordinates": [],
      "type": "LineString"
   }

 };

 featureJSON.geometry.coordinates.push(fromFeature.geometry.coordinates);
 featureJSON.properties = fromFeature.properties;
 featureJSON.properties["TRtype"] = trType;
 featureJSON.properties["relID"] = trID;
 return featureJSON;
}

// iterate through geojson to store unique relation ID

obj.features.forEach(function(item){
	
if(item.properties["@relations"]!==undefined){
 for(i=0; i<item.properties["@relations"].length; i++)
 {
   if (relID.indexOf(item.properties["@relations"][i].rel) < 0)
   {
     relID.push(item.properties["@relations"][i].rel);
     if(relID.indexOf(item.properties["@relations"][i].role == 'from')){
     	
     	fromFeatureJSON = constructJSON(item, item.properties["@relations"][i].reltags["restriction"], item.properties["@relations"][i].rel);
     	relGroup.features.push(item);


      }
     else{

     }
					 			
	}
	else
	{
		relGroup.features.forEach(function(relItem){

		 if(item.properties["@relations"][i].rel == relItem.properties.relID){
		 	relItem.properties["relations"] = item;

		 }

		});
	}
 }
 	
}

});

console.log(relGroup.features.length);


// console.log(relID);