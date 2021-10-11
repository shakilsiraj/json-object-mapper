### Release : 1.7.1
Fixes:
* Fix issue with npm publish github action 

### Release : 1.7
Features added:
* Updated libraries
* Merged [pr/64](https://github.com/shakilsiraj/json-object-mapper/pull/64). Thanks [DSI-HUG](https://github.com/DSI-HUG)
* Merged [pr/64](https://github.com/shakilsiraj/json-object-mapper/pull/65). Thanks [DSI-HUG](https://github.com/DSI-HUG)
* Integrated Github actions.

Fixes:
* Fixed issue with jest setup in general.

Others:
* Updated README.md

### Release : 1.6
Features added: 
* Jest integration
* Upgraded libraries
* Upgraded typescript version


### Release 1.5.1
Defect fix:
* null values throwing exception during serialization [issue 22](http://github.com/shakilsiraj/json-object-mapper/issues/22)

### Release 1.5
Features added:
* Ignore serialization and deserialization with @JsonIgnore decorator - thanks [@devpreview](https://github.com/devpreview).
* Removed ```reflect-metadata``` from  required dependencies list - thanks [@devpreview](https://github.com/devpreview).
* Serialize / deserialize array keeping the order - thanks [@vapkse](https://github.com/vapkse)

Defect fixes:
* [Enable String Serializer to support strings with special characters](https://github.com/shakilsiraj/json-object-mapper/pull/6). Thanks [@ironchimp](https://github.com/ironchimp)
* [deserializeArray returns undefined when called on an empty array](https://github.com/shakilsiraj/json-object-mapper/pull/19). Thanks [@devpreview](https://github.com/devpreview) 
* [nested array is undefined](https://github.com/shakilsiraj/json-object-mapper/pull/21). Thanks [@devpreview](https://github.com/devpreview) 
* Finally fixed travis build with linting fix.
