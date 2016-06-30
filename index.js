var fs = require('fs');
var argv = require('minimist')(process.argv.slice(2));
// fetch the input geojson
var data = JSON.parse(fs.readFileSync('./'+ argv.filename, 'utf8'));
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

function setProperties(copyTo, copyFrom, relInfo){

  copyTo.id = copyFrom.id;
  copyTo.properties['label'] = relInfo.role;
  copyTo.geometry.coordinates = copyFrom.geometry.coordinates;
  copyTo.geometry.type = copyFrom.geometry.type;

  if (relInfo.role === 'from') {
    
    copyTo.properties['restriction:type'] = getRestriction(relInfo.reltags);
    copyTo.properties['user'] = copyFrom.properties['@user'];
    copyTo.properties['changeset'] = copyFrom.properties['@changeset'];
    copyTo.properties['restriction:id'] = relInfo.rel;
    copyTo.properties['relations'] =[];

  }
  return copyTo;
}

function constructJSON(fromFeature, relDetail){

  var featureJSON = {
    'type': 'Feature',
    'id': '',
    'properties': {},
    'geometry': {
      'coordinates': [],
      'type': ''
    }
  };
    
  featureJSON = setProperties(featureJSON, fromFeature, relDetail);
  return featureJSON;
  
}

// iterate through geojson to store unique relation ID

data.features.forEach(function(item){
  var i;
  
  if (item.properties['@relations'] !== undefined) {

    for (i=0; i<item.properties['@relations'].length; i++) {
      if (item.properties['@relations'][i].role === 'from') {
        if (relID.indexOf(item.properties['@relations'][i].rel) < 0) {
          relID.push(item.properties['@relations'][i].rel);
          fromFeatureJSON = constructJSON(item, item.properties['@relations'][i]);
          relGroup.features.push(fromFeatureJSON);
        } 
      } else if (item.properties['@relations'][i].role !== 'from') {
        relGroup.features.forEach(function(relItem){
          if (item.properties['@relations'][i].rel === relItem.properties['restriction:id']) {

            fromFeatureJSON = constructJSON(item, item.properties['@relations'][i]);
            //push the object to 'relations' property of the 'from' feature
            relItem.properties.relations.push(fromFeatureJSON);
          }
        });
      }
    }
  }

});


relGroup.features.forEach(function(eachRel){
  delete eachRel.properties['@relations'];
  delete eachRel.properties['@id'];

});

console.log(JSON.stringify(relGroup));


