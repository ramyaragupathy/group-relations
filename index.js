var fs = require('fs');
// fetch the input geojson
var data = JSON.parse(fs.readFileSync('./grpTest.geojson', 'utf8'));
var relID = []; // array to store unique relation ID
var fromFeatureJSON;
// var roleColor = { 'roles': {'from':'#FF5733','to': '#FFC300','via': '#DAF7A6'}};
var relGroup ={
 'type': 'FeatureCollection',
 'features': []
 };

function setProperties(copyTo, copyFrom, relInfo){
  // copyTo.properties["color"] = roleColor.roles[relInfo.role];
  copyTo.id = copyFrom.id;
  copyTo.properties["label"] = relInfo.role;
  // copyTo.properties["relID"] = relInfo.rel;
  copyTo.geometry.coordinates = copyFrom.geometry.coordinates;
  copyTo.geometry.type = copyFrom.geometry.type;
  return copyTo;
}

function constructJSON(fromFeature, relDetail){

   var featureJSON;

   if(relDetail.role === 'from'){
   
    featureJSON = fromFeature;
    // featureJSON.properties["color"] = roleColor.roles[relInfo.role];
    featureJSON.properties["TRtype"] = relDetail.reltags["restriction"];
    featureJSON.properties["label"] = relDetail.role;
    featureJSON.properties["relID"] = relDetail.rel;
    featureJSON.properties["relations"] =[];
    
   }
   else{
    featureJSON = {
    "type": "Feature",
    "id": "",
    "properties": {},
    "geometry": {
     "coordinates": [],
     "type": ""
     }
    };
    if (relDetail.role === 'to'){

    featureJSON = setProperties(featureJSON, fromFeature, relDetail);
    }
    else if (relDetail.role === 'via'){
    
    featureJSON = setProperties(featureJSON, fromFeature, relDetail);

    }

   }

  return featureJSON;
  

}

// iterate through geojson to store unique relation ID

data.features.forEach(function(item){
  var i;
  
  if(item.properties["@relations"] !== undefined){

    for(i=0; i<item.properties["@relations"].length; i++){
      if (item.properties["@relations"][i].role === 'from')
      {
        if(relID.indexOf(item.properties["@relations"][i].rel) < 0){
             relID.push(item.properties["@relations"][i].rel);
             fromFeatureJSON = constructJSON(item, item.properties["@relations"][i]);
             relGroup.features.push(fromFeatureJSON);
           }
           else{
           
           }


      }
      else if(item.properties["@relations"][i].role !== 'from')
      {
        relGroup.features.forEach(function(relItem){
          if(item.properties["@relations"][i].rel === relItem.properties.relID){

            fromFeatureJSON = constructJSON(item, item.properties["@relations"][i]);
            //push the object to 'relations' property of the 'from' feature
            // relItem.properties.relations.push(JSON.parse(JSON.stringify(item)));
            relItem.properties.relations.push(fromFeatureJSON);
            }
         });
      }

    }
  }


});


relGroup.features.forEach(function(eachRel){
  delete eachRel.properties["@relations"];
  delete eachRel.properties["@id"];

});
// console.log("relID array length: "+ relID.length);
// console.log("relGroup array length: "+ relGroup.features.length);

console.log(JSON.stringify(relGroup));


