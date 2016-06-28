var fs = require('fs');
// fetch the input geojson
var data = JSON.parse(fs.readFileSync('./conditionalTR.geojson', 'utf8'));
var relID = []; // array to store unique relation ID
var fromFeatureJSON;
var relGroup ={
 'type': 'FeatureCollection',
 'features': []
 };

function constructJSON(fromFeature, trType, trID){
   var featureJSON = {
    // "type": "Feature",
    // "id":"",
    // "properties": {},
    // "geometry": {}
   };

   // featureJSON.geometry.coordinates.push(fromFeature.geometry.coordinates);
   featureJSON = fromFeature;
   // featureJSON.properties = fromFeature.properties;
   // featureJSON.geometry = fromFeature.geometry;
   featureJSON.properties["TRtype"] = trType;
   featureJSON.properties["relID"] = trID;
   featureJSON.properties["relations"] =[];
   return featureJSON;
  

}

// iterate through geojson to store unique relation ID

data.features.forEach(function(item){
  if(item.properties["@relations"] !== undefined){
    var i;
    for(i=0; i<item.properties["@relations"].length; i++){
      if (item.properties["@relations"][i].role === 'from')
      {
        if(relID.indexOf(item.properties["@relations"][i].rel) < 0){
             relID.push(item.properties["@relations"][i].rel);
             fromFeatureJSON = constructJSON(item, item.properties["@relations"][i].reltags["restriction"], item.properties["@relations"][i].rel);
             relGroup.features.push(fromFeatureJSON);
           }
           else{
           
           }


      }
      else if(item.properties["@relations"][i].role !== 'from')
      {
        relGroup.features.forEach(function(relItem){
          if(item.properties["@relations"][i].rel === relItem.properties.relID){
              
            //push the object to 'relations' property of the 'from' feature
            relItem.properties.relations.push(JSON.parse(JSON.stringify(item)));
            }

        });
      }

    }
  }


});

// console.log("relID array length: "+ relID.length);
// console.log("relGroup array length: "+ relGroup.features.length);

console.log(JSON.stringify(relGroup));


