var fs = require('fs');
// fetch the input geojson
var data = JSON.parse(fs.readFileSync('./tr-test.geojson', 'utf8'));
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
 featureJSON.properties["relations"] =[];
 return featureJSON;
}

// iterate through geojson to store unique relation ID

data.features.forEach(function(item){
	
if(item.properties["@relations"]!==undefined){
 for(i=0; i<item.properties["@relations"].length; i++)
 {
   if (relID.indexOf(item.properties["@relations"][i].rel) < 0)
   {
   	 // if the relation ID is unique, store it to an array and check for the role
     relID.push(item.properties["@relations"][i].rel);
     if(relID.indexOf(item.properties["@relations"][i].role == 'from')){
     	//construct a feature for 'from' object and push it to the relation Group
     	fromFeatureJSON = constructJSON(item, item.properties["@relations"][i].reltags["restriction"], item.properties["@relations"][i].rel);
     	relGroup.features.push(item);


      }
     else{

     }
					 			
	}
   else // if the relation ID is not unique
   {
		//iterate through the relation Group to find the matching 'from' feature
		relGroup.features.forEach(function(relItem){

		 if(item.properties["@relations"][i].rel == relItem.properties.relID){
		 	//push the object to 'relations' property of the 'from' feature
		 	relItem.properties.relations.push(JSON.parse(JSON.stringify(item)));

		 }

		});
	}
 }
 	
}

});

console.log(JSON.stringify(relGroup));


// console.log(relID);