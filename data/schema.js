import { makeExecutableSchema, addMockFunctionsToSchema } from 'graphql-tools';
import mocks from './mocks';

// const typeDefs = `
// type Query {
//   data: String
// }

// `;

const typeDefs = `
schema {
  query: Query
}

type Query {
  trips: Trip
}

type Trip {
  id: String
  tripuration: String
  starttime: String
  stoptime: String
  startStationId: String
  startStationName: String
  startStationLatitude: String
  startStationLongitude: String
  endStationId: String
  endStationName: String
  endStationLatitude: String
  endStationLongitude: String
  bikeid: String
  name_localizedValue0: String
  usertype: String
  birthYear: String
  gender: String
}
`;

// id: Int
//   tripuration: Int
//   starttime: String
//   stoptime: String
//   startStationId: Int
//   startStationName: Int
//   startStationLatitude: Float
//   startStationLongitude: Float
//   endStationId: Int
//   endStationName: Int
//   endStationLatitude: Float
//   endStationLongitude: Float
//   bikeid: Int
//   name_localizedValue0: String
//   usertype: String
//   birthYear: Int
//   gender: Int

const csvFilePath='./201801_citibikenyc_tripdata.csv'
const csv=require('csvtojson')



const schema = csv()
.fromFile(csvFilePath)
.then((jsonObj)=>{
  console.log(jsonObj[0])

  jsonObj = JSON.parse(JSON.stringify(jsonObj).split('"start station id":').join('"startStationId":'));
  jsonObj = JSON.parse(JSON.stringify(jsonObj).split('"start station name":').join('"startStationName":'));
  jsonObj = JSON.parse(JSON.stringify(jsonObj).split('"start station latitude":').join('"startStationLatitude":'));
  jsonObj = JSON.parse(JSON.stringify(jsonObj).split('"start station longitude":').join('"startStationLongitude":'));
  jsonObj = JSON.parse(JSON.stringify(jsonObj).split('"end station id":').join('"endStationId":'));
  jsonObj = JSON.parse(JSON.stringify(jsonObj).split('"end station name":').join('"endStationName":'));
  jsonObj = JSON.parse(JSON.stringify(jsonObj).split('"end station latitude":').join('"endStationLatitude":'));
  jsonObj = JSON.parse(JSON.stringify(jsonObj).split('"end station longitude":').join('"endStationLongitude":'));
  jsonObj = JSON.parse(JSON.stringify(jsonObj).split('"birth year":').join('"birthYear":'));


  let object = jsonObj[0]
  object['id'] = "1"

  console.log(object)

    const resolvers = {
        Query: {
          trips: (root) => object,
        },
    };

    return makeExecutableSchema({
        typeDefs,
        resolvers,
    });
})


// addMockFunctionsToSchema({ schema, mocks });

export default schema;
