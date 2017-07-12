### Group - relations

This utility works on an input feature collection of [turn restrictions](http://wiki.openstreetmap.org/wiki/Relation:restriction) from [OSM](http://www.openstreetmap.org/) and re-group them into features based on unique relations IDs. So the number of features in the output geojson will be equal to the number of unique relation IDs present in your input collection. 

### Usage:

`group-relations --filename <source.geojson>`

This will give the restructured geojson output to `stdout`.

`group-relations --filename <source.geojson> > <output.geojson>`

This saves the restructured geojson to a file named `output.geojson`

### TO DO

- [x] Remove indexing by `from` role
- [x] Add all properties from `reltags`
- [x] Ordering members within properties


