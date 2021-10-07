## Introduction
`json-object-mapper` is a `typescript` library designed to serialize and 
de-serialize DTO objects from and to JSON objects. Using the library, you would 
be able to load the JSON data from `Http`/`File`/`Stream` stright 
into an object graph of your DTO classes as well as serialize a DTO object graph 
so that it can be sent to an output stream. 

The idea behind this is that you do not need to add serialization and 
de-serialization methods to each of your DTO classes - thus keeping them clean 
and simple.

![Build Status](https://github.com/shakilsiraj/json-object-mapper/actions/workflows/test.yml/badge.svg?branch=release/1.7)

## Usage

The core of the library is the `ObjectMapper` class which essentially serializes and
de-serializes object graph.

It has the following methods:


1. `serialize(Object) => String` : will serialize a class instance into JSON string.
2. `deserialize(Type, Object) => Type` : will take a class type and a JSON object
and create a new instance of the class type based on the JSON data model.
3. `deserializeArray(Type, Object) => Type[]` : will take a JSON array and convert that to an array of class type.

There is also the `@JsonProperty` decorator which has additional metadata about
how the class properties needs to be processed. This decorator comes handy when
you do want to deserialize a non-primitive type object to a instance property
(see [JS primitive types](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Primitive_values)).
It's the same when declaring arrays even though the array can be of a primitive date type.
For non-primitive types if this property decorator is not present, raw JSON data
will be assinged as the property value.

The decorator takes the following optional values:
* name : name of the JSON property to map to. This name will also be used during serialization
* required: is this field required in the JSON object that is being deserialized
* access: is this serializable and de-serializable
* type: the type of Object that should be assigned to this property

Lets have a look at an example:

```typescript
class SimpleRoster {
    @JsonProperty()
    private name: String;
    @JsonProperty()
    private worksOnWeekend: Boolean;
    @JsonProperty()
    private numberOfHours: Number;
    @JsonProperty({type:Date})
    private systemDate: Date;

    public isAvailableToday(): Boolean {
        if (this.systemDate.getDay() % 6 == 0 && this.worksOnWeekend == false) {
            return false;
        }
        return true;
    }

}
let json = {
    'name': 'John Doe',
    'worksOnWeekend' : false,
    'numberOfHours': 8,
    'systemDate' : 1483142400000 // Sat Dec 31, 2016
};

let testInstance: SimpleRoster = ObjectMapper.deserialize(SimpleRoster, json);
expect(testInstance.isAvailableToday()).toBeFalsy();
```

First lets talk about the property `systemDate` and the `@JsonProperty` property decorator assinged 
to it. As the `Date` type is not a primitive data type, you will need to explicitly mention that 
to the processor that we need to create a new instance of `Date` object with the supplied value and
assign it to the `systemDate` property.

When the `deserialize` method runs, it will first create a new instance of 'SimpleRoster' class.
Then it will parse the keys of the instance and assign the correct values to 
each keys. While doing that, it will make sure that the right property types are maintained -
meaning that `name` field will be assinged a `String` object with the value 'John Doe', `numberOfHours` will be assigned
a `Number` object and the `systemDate` field will be assinged a `Date` object with the value
`Sat Dec 31, 2016`. The method will also make sure that all the nested object graphs has been
created based on the JSON model.

The `serialize` method will serialize an object graph into JSON string (similar to what `JSON.stringrify()`
method would do) while honoring the decorator metadata. Following is an example of serialization:

```typescript
class SimpleClass {
    firstName: string = "John";
    middleName: string = "P";
    lastName: string = "Doe";
    @JsonIgnore()
    password: string = "mypwd";
    @JsonProperty({ type: String, name: "AKA" })
    knownAs: String[] = ["John", "Doe", "JohnDoe", "JohnPDoe"]
};


let instance: SimpleClass = new SimpleClass();

let stringrified: String = ObjectMapper.serialize(instance);
expect(stringrified).toBe('{"firstName":"John","middleName":"P","lastName":"Doe","AKA":["John","Doe","JohnDoe","JohnPDoe"]}');
```

From the example above, the `knownAs` property is serialized as `AKA` as defined in the `@JsonProperty` 
decorator. The `password` property does not serialized as defined in the `@JsonIgnore` 
decorator.

The library uses non-recursive iterations to process data. That means you can 
serialize and de-serialize large amount of data quickly and efficiently using any 
modern browser as well as native applications (such as nodejs, electron, 
nativescript, etc.). Please have a look at the `test` folder to see few examples
of using large dataset as well as how to use the library in general. 


## Inspiration
The library is inspired by the popular [jackson library](http://wiki.fasterxml.com/JacksonHome).
As with the `java` version, it uses `typescript` decorators to decorate properties with additional metadata.
I will try to stick as close as possible to the `jackson` annotations so that the transition can be simple.

## Installation
The project is hosted on [github.com](https://github.com/shakilsiraj/json-object-mapper). You can either download it from there or from npmjs.com with the `npm` command:
```
npm install json-object-mapper --save
```
## Depedency
The library depends on [reflect-metadata](https://www.npmjs.com/package/reflect-metadata) library. 
Originally, I thought of not having to force a dependency on another library.
But when you look the geneated JS code for a `typescript` decorator, 
it is always trying to check for the variable `Reflect`. So, until such time when
`typescript` decorators can be de-coupled from `Reflect` library, I am sticking with it.
You can either download `reflect-metadata` from there or from npmjs.com with the `npm` command:
```
npm install reflect-metadata --save
```
and make sure to import it in a global place, like app.ts:
```typescript
import "reflect-metadata";
```
If you are using Angular 2 you should already have this shim installed.
## Things to remember
### Enum serialization and de-serialization
You can use `enum` data type by specifying the `type` property of @JsonProperty decorator.
You will need to use `Serializer` and `Deserializer` to make the enum work correctly.

Following is an example of `enum` serialization and de-serialization:

```typescript
@CacheKey("DaysEnumSerializerDeserializer")
class DaysEnumSerializerDeserializer implements Deserializer, Serializer{
    deserialize = (value: string): Days => {
        return Days[value];
    }
    serialize = (value: Days): string => {
        return '"' + Days[value] + '"';
    }
}

enum Days{
    Sun, Mon, Tues, Wed, Thurs, Fri, Sat
}  

class Workday{
    @JsonProperty({ type: Days, deserializer: DaysEnumSerializerDeserializer, serializer: DaysEnumSerializerDeserializer})
    today: Days;
}        

let json = { "today": 'Tues' };

let testInstance: Workday = ObjectMapper.deserialize(Workday, json);
expect(testInstance.today == Days.Tues).toBeTruthy();
testInstance.today = Days.Fri;
let serialized: String = ObjectMapper.serialize(testInstance);
expect(serialized).toBe('{"today":"Fri"}');

```

### Map objects serialization and de-serialization
This can be achieved by using implementations of `Serializer` and `Deserializer`. For example:

```typescript
class MapDeserializer implements Deserializer {
    deserialize = (value: any): any => {
        let mapToReturn: Map<String, String> = new Map<String, String>();
        if (value) {
            Object.keys(value).forEach((key: String) => {
                mapToReturn.set(key, value['' + key]);
            });
        }
        return mapToReturn;
    }
}

```

### A special thing about Date object
It's very hard to get a `Date` instance right across all browsers - 
have a look at the [stackoverflow discussion](http://stackoverflow.com/questions/2587345/why-does-date-parse-give-incorrect-results).
The best way to manage this complexitiy I have found so far is to use the 
`new Date(value)` constructor which takes the number of milliseconds since 
1st January 1970 UTC. So, to best use this library, make sure that the date is 
passed on as the number of milliseconds during deserializition:
```json
jsonTest["dateType"] : 1333065600000;
```
even though it will take the date as string without guranting the accuracy of time:
```json
jsonTest["dateType"] : '05/08/2013';
```
For serialization, it will only print out the milliseconds:
```json
{"test":1457096400000}
```
Also, you will need to use the `DateSerializer` or your own implementation for serializing `Date` objects. 
```typescript
@JsonProperty({type: Date, name:'dateOfBirth', serializer: DateSerializer})
dob: Date = new Date(1483142400000)
```

## Contributors
A special thanks to all who have contributed to this project.

<a href="https://github.com/shakilsiraj/json-object-mapper/graphs/contributors">
<img src="https://contrib.rocks/image?repo=shakilsiraj/json-object-mapper" />
</a>