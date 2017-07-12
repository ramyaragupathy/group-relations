var fs = require('fs');
var argv = require('minimist')(process.argv.slice(2));
// fetch the input geojson
var data = JSON.parse(fs.readFileSync('./'+ argv.filename, 'utf8'));
var streetName = argv.streetname;
var relID = []; // array to store unique relation ID
var fromFeatureJSON;
var relGroup ={
  'type': 'FeatureCollection',
  'features': []
};

function getRestriction(obj){
  if(obj.hasOwnProperty('restriction')) {
    return obj['restriction'];
  } else {
    return obj['restriction:conditional'];
  }

}





// iterate through geojson to store unique relation ID

function groupRelation (item) {
    for (i=0; i<item.properties['@relations'].length; i++) {
        if (relID.indexOf(item.properties['@relations'][i].rel) < 0) { //ID already encountered
          relID.push(item.properties['@relations'][i].rel);
           var featureJSON = {
                'type': 'Feature',
                'properties': {'members':[]},
                'geometry': {
                  "type": "GeometryCollection",
                  "geometries": []
                }
            };
          featureJSON.properties['restriction:id'] = item.properties['@relations'][i].rel;
          for (var property in item.properties['@relations'][i].reltags){
            featureJSON.properties[property] = item.properties['@relations'][i].reltags[property];
          }
          relGroup.features.push(featureJSON);
          relGroup.features.forEach(function(relItem){  //push the from item
            if(item.properties['@relations'][i].rel === relItem.properties['restriction:id']){
               relItem.geometry.geometries.push(item.geometry);
               var memberProperties ={}
               memberProperties.id = item.id;
               memberProperties.label = item.properties['@relations'][i].role;
               relItem.properties.members.push(memberProperties);

            }
          });
        } else { //ID already present
          relGroup.features.forEach(function(relItem){  //push the from item
            if(item.properties['@relations'][i].rel === relItem.properties['restriction:id']){
               relItem.geometry.geometries.push(item.geometry);
               var memberProperties ={}
               memberProperties.id = item.id;
               memberProperties.label = item.properties['@relations'][i].role;
               relItem.properties.members.push(memberProperties);
            }
          });

        }
      } 
    //}
  }



data.features.forEach(function(item){
  var i;
  if (streetName === undefined){
    if (item.properties['@relations'] !== undefined) {
    groupRelation(item);
  }
} else {
    if (item.properties['@relations'] !== undefined && item.properties.name == streetName) {
      groupRelation(item);
}
}
});


console.log(JSON.stringify(relGroup));
