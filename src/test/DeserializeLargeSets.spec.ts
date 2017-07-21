/// <reference path="../../typings/main.d.ts"/>
import { JsonProperty, JsonPropertyDecoratorMetadata, AccessType } from "../main/DecoratorMetadata";
import { ObjectMapper } from "../main/index";
import { isArrayType } from "../main/ReflectHelper";

describe("Testing deserialize function with large datasets", () => {

  class JsonGeneratorFriendDataObject {
    id: number = undefined;
    name: string = undefined;
  }
  class JsonGeneratorDataObject {
    _id: string = undefined;
    index: number = undefined;
    guid: string = undefined;
    isActive: boolean = undefined;
    balance: string = undefined;
    picture: string = undefined;
    age: string = undefined;
    eyeColor: string = undefined;
    name: string = undefined;
    gender: string = undefined;
    company: string = undefined;
    email: string = undefined;
    phone: string = undefined;
    address: string = undefined;
    about: string = undefined;
    @JsonProperty({ type: Date })
    registered: Date = undefined;
    @JsonProperty({access:AccessType.READ_ONLY})
    latitude: Number = undefined;
    longitude: number = undefined;
    @JsonProperty({ type: String })
    tags: string[] = undefined;
    @JsonProperty({ type: JsonGeneratorFriendDataObject })
    friends: JsonGeneratorFriendDataObject[] = undefined;
    greeting: string = undefined;
    favoriteFruit: string = undefined;

  }
  class JsonGeneratorData {
    @JsonProperty({ name: "DATA", type: JsonGeneratorDataObject, access:AccessType.READ_ONLY })
    data: JsonGeneratorDataObject[] = undefined;
  }

  it("Testing json data from http://www.json-generator.com/", () => {

    let testData: JsonGeneratorData = ObjectMapper.deserialize(JsonGeneratorData, largeDataSet1);
    expect(testData.data.length).toBe(6);
    Object.keys(testData.data).forEach((key: string) => {
      let jsonGeneratorDataObject = testData.data[key];
      Object.keys(jsonGeneratorDataObject).forEach((key1: string) => {
        if (isArrayType(jsonGeneratorDataObject, key1)) {
          expect((jsonGeneratorDataObject[key1] as Array<any>).length > 0).toBe(true);
        } else {
          expect(jsonGeneratorDataObject[key1] === undefined).toBe(false);
        }
      });

    });

  });

});


var largeDataSet1: any = {
  "DATA": [
    {
      "_id": "584171b525e650f837438e9b",
      "index": 0,
      "guid": "98c9a688-e352-4283-bef6-fbe8943a0e6a",
      "isActive": true,
      "balance": "$3,167.06",
      "picture": "http://placehold.it/32x32",
      "age": 23,
      "eyeColor": "green",
      "name": "Earline Cain",
      "gender": "female",
      "company": "COMTOURS",
      "email": "earlinecain@comtours.com",
      "phone": "+1 (984) 409-3687",
      "address": "190 Kaufman Place, Broadlands, Arkansas, 7927",
      "about": "Cillum aliqua veniam eiusmod culpa tempor occaecat laboris ad cupidatat voluptate eu minim. Deserunt cupidatat tempor nostrud incididunt ex incididunt non exercitation aute sint aute reprehenderit Lorem. Nostrud voluptate anim Lorem ullamco quis eiusmod anim ullamco.\r\n",
      "registered": "2014-10-05T11:38:26 -11:00",
      "latitude": 21.266703,
      "longitude": -114.43165,
      "tags": [
        "magna",
        "cillum",
        "magna",
        "est",
        "enim",
        "cillum",
        "mollit"
      ],
      "friends": [
        {
          "id": 0,
          "name": "Murray Fowler"
        },
        {
          "id": 1,
          "name": "Stein Banks"
        },
        {
          "id": 2,
          "name": "Erma Hickman"
        }
      ],
      "greeting": "Hello, Earline Cain! You have 6 unread messages.",
      "favoriteFruit": "apple"
    },
    {
      "_id": "584171b5dd25d24f8515adb1",
      "index": 1,
      "guid": "e332e394-0a14-4dc3-b9aa-83f1842e8dbd",
      "isActive": false,
      "balance": "$1,716.26",
      "picture": "http://placehold.it/32x32",
      "age": 25,
      "eyeColor": "blue",
      "name": "Sims Hughes",
      "gender": "male",
      "company": "ANOCHA",
      "email": "simshughes@anocha.com",
      "phone": "+1 (973) 467-3135",
      "address": "967 Clarkson Avenue, Northridge, Federated States Of Micronesia, 3687",
      "about": "Voluptate sit culpa laborum cillum veniam dolor laboris nisi consequat. Duis aute mollit adipisicing culpa ad voluptate aliqua dolore cillum adipisicing enim. Pariatur laborum voluptate et commodo adipisicing qui adipisicing excepteur anim.\r\n",
      "registered": "2014-04-29T02:20:25 -10:00",
      "latitude": 36.790537,
      "longitude": -176.946569,
      "tags": [
        "ex",
        "laboris",
        "dolor",
        "incididunt",
        "consectetur",
        "nostrud",
        "dolor"
      ],
      "friends": [
        {
          "id": 0,
          "name": "Angeline Noble"
        },
        {
          "id": 1,
          "name": "Parks Osborne"
        },
        {
          "id": 2,
          "name": "Bishop Contreras"
        }
      ],
      "greeting": "Hello, Sims Hughes! You have 5 unread messages.",
      "favoriteFruit": "apple"
    },
    {
      "_id": "584171b5cd39bc2679d91c9a",
      "index": 2,
      "guid": "fdde3ce5-9ad7-4a4b-b2ef-7488ea8b0ec0",
      "isActive": true,
      "balance": "$3,138.98",
      "picture": "http://placehold.it/32x32",
      "age": 32,
      "eyeColor": "brown",
      "name": "Jones Peterson",
      "gender": "male",
      "company": "KRAGGLE",
      "email": "jonespeterson@kraggle.com",
      "phone": "+1 (960) 552-3087",
      "address": "260 Dobbin Street, Richmond, Pennsylvania, 1010",
      "about": "Laborum Lorem mollit Lorem laborum nostrud adipisicing. Lorem ea aliqua aliqua dolor veniam Lorem. Aliquip nostrud do nisi minim magna ea in. Irure qui nostrud anim id id quis sint nulla enim elit ipsum ut. Nostrud est commodo exercitation qui ad.\r\n",
      "registered": "2014-01-26T12:23:19 -11:00",
      "latitude": 19.709352,
      "longitude": -149.650546,
      "tags": [
        "ex",
        "veniam",
        "deserunt",
        "cupidatat",
        "sunt",
        "nisi",
        "eu"
      ],
      "friends": [
        {
          "id": 0,
          "name": "Arnold Walter"
        },
        {
          "id": 1,
          "name": "Jayne Mclean"
        },
        {
          "id": 2,
          "name": "Noble Baxter"
        }
      ],
      "greeting": "Hello, Jones Peterson! You have 2 unread messages.",
      "favoriteFruit": "apple"
    },
    {
      "_id": "584171b50e8c0e1de69e9876",
      "index": 3,
      "guid": "b26f226e-0882-4678-a49b-169a7f341938",
      "isActive": false,
      "balance": "$1,523.28",
      "picture": "http://placehold.it/32x32",
      "age": 21,
      "eyeColor": "brown",
      "name": "Burris Rodriquez",
      "gender": "male",
      "company": "MARTGO",
      "email": "burrisrodriquez@martgo.com",
      "phone": "+1 (845) 458-2680",
      "address": "369 Henderson Walk, Bendon, South Carolina, 6531",
      "about": "Nisi cillum qui consectetur est non amet. Mollit dolore et quis cupidatat. Laboris incididunt eiusmod tempor consequat pariatur exercitation ex laborum consectetur do nostrud. Deserunt exercitation do ex duis ad ad anim ullamco minim duis eiusmod.\r\n",
      "registered": "2014-11-02T08:35:17 -11:00",
      "latitude": 53.545622,
      "longitude": -22.614628,
      "tags": [
        "aliqua",
        "ipsum",
        "est",
        "magna",
        "tempor",
        "enim",
        "eiusmod"
      ],
      "friends": [
        {
          "id": 0,
          "name": "Tanner Noel"
        },
        {
          "id": 1,
          "name": "Salazar Hardy"
        },
        {
          "id": 2,
          "name": "Conner Hayes"
        }
      ],
      "greeting": "Hello, Burris Rodriquez! You have 10 unread messages.",
      "favoriteFruit": "strawberry"
    },
    {
      "_id": "584171b5ef38c99bb51ff2d8",
      "index": 4,
      "guid": "7dbd6d05-a4db-4607-83f6-cd958799abb1",
      "isActive": true,
      "balance": "$1,047.18",
      "picture": "http://placehold.it/32x32",
      "age": 30,
      "eyeColor": "blue",
      "name": "Tracey Russell",
      "gender": "female",
      "company": "FORTEAN",
      "email": "traceyrussell@fortean.com",
      "phone": "+1 (816) 499-2891",
      "address": "681 Strauss Street, Stewartville, Idaho, 2404",
      "about": "Incididunt voluptate tempor aliqua adipisicing minim ullamco mollit irure. Anim nulla veniam ullamco exercitation consequat in nostrud et mollit. Id exercitation magna irure occaecat voluptate.\r\n",
      "registered": "2015-03-31T01:13:47 -11:00",
      "latitude": -39.106514,
      "longitude": -124.233,
      "tags": [
        "mollit",
        "ipsum",
        "eiusmod",
        "exercitation",
        "nostrud",
        "duis",
        "magna"
      ],
      "friends": [
        {
          "id": 0,
          "name": "Letitia Turner"
        },
        {
          "id": 1,
          "name": "Webster Rosario"
        },
        {
          "id": 2,
          "name": "Dunn Byers"
        }
      ],
      "greeting": "Hello, Tracey Russell! You have 3 unread messages.",
      "favoriteFruit": "banana"
    },
    {
      "_id": "584171b5ab9ea729045012f8",
      "index": 5,
      "guid": "db8f7b0d-5b60-4747-8b33-28a2986a18fe",
      "isActive": true,
      "balance": "$1,101.93",
      "picture": "http://placehold.it/32x32",
      "age": 26,
      "eyeColor": "brown",
      "name": "Helena Clayton",
      "gender": "female",
      "company": "TERAPRENE",
      "email": "helenaclayton@teraprene.com",
      "phone": "+1 (874) 408-2609",
      "address": "285 Horace Court, Rosedale, Wyoming, 3942",
      "about": "Ullamco tempor minim id incididunt sit. Labore ut amet irure nostrud ipsum cillum et nisi tempor duis eiusmod quis aliqua et. Deserunt nostrud duis eu ipsum eiusmod.\r\n",
      "registered": "2014-05-13T04:58:10 -10:00",
      "latitude": -29.284472,
      "longitude": -128.943055,
      "tags": [
        "anim",
        "commodo",
        "aliqua",
        "consectetur",
        "tempor",
        "nulla",
        "amet"
      ],
      "friends": [
        {
          "id": 0,
          "name": "Brady Chan"
        },
        {
          "id": 1,
          "name": "Roth Hoover"
        },
        {
          "id": 2,
          "name": "Duncan Cooke"
        }
      ],
      "greeting": "Hello, Helena Clayton! You have 9 unread messages.",
      "favoriteFruit": "apple"
    }
  ]
}