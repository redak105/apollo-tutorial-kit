import express from 'express';
import { graphqlExpress, graphiqlExpress } from 'apollo-server-express';
import bodyParser from 'body-parser';
// import schema from './data/schema';
import { makeExecutableSchema, addMockFunctionsToSchema } from 'graphql-tools';

const GRAPHQL_PORT = 3000;

const graphQLServer = express();




const typeDefs = `
schema {
  query: Query
}

type Query {
  trips: [Trip]
  stations: [Station]
  trips( stationId: Int): [Trip]
}

type Trip {
  tripduration: Int
  starttime: String
  stoptime: String
  startStationId: Int
  startStationName: String
  startStationLatitude: Float
  startStationLongitude: Float
  endStationId: Int
  endStationName: String
  endStationLatitude: Float
  endStationLongitude: Float
  bikeid: Int
  name_localizedValue0: String
  usertype: String
  birthYear: Int
  gender: Int
}

type Station {
  startStationId: Int
  startStationName: String
  startStationLatitude: Float
  startStationLongitude: Float
}
`;

const csvFilePath='./201801_citibikenyc_tripdata.csv'
const csv=require('csvtojson')


const schema = csv()
.fromFile(csvFilePath)
.then((jsonObj)=>{
  console.log("<< Started >>")
  console.log("<< Updated fields >>")

  jsonObj = JSON.parse(JSON.stringify(jsonObj).split('"start station id":').join('"startStationId":'));
  jsonObj = JSON.parse(JSON.stringify(jsonObj).split('"start station name":').join('"startStationName":'));
  jsonObj = JSON.parse(JSON.stringify(jsonObj).split('"start station latitude":').join('"startStationLatitude":'));
  jsonObj = JSON.parse(JSON.stringify(jsonObj).split('"start station longitude":').join('"startStationLongitude":'));
  jsonObj = JSON.parse(JSON.stringify(jsonObj).split('"end station id":').join('"endStationId":'));
  jsonObj = JSON.parse(JSON.stringify(jsonObj).split('"end station name":').join('"endStationName":'));
  jsonObj = JSON.parse(JSON.stringify(jsonObj).split('"end station latitude":').join('"endStationLatitude":'));
  jsonObj = JSON.parse(JSON.stringify(jsonObj).split('"end station longitude":').join('"endStationLongitude":'));
  jsonObj = JSON.parse(JSON.stringify(jsonObj).split('"birth year":').join('"birthYear":'));

  console.log("<< Parse data >>")

  var stations = [];
  var stations2 = {};
  jsonObj.forEach(function(value, index){
    if (stations2[value.startStationId] == null) {
      stations2[value.startStationId] = [value]
      stations.push({
        startStationId: value.startStationId,
        startStationName: value.startStationName,
        startStationLatitude: value.startStationLatitude,
        startStationLongitude: value.startStationLongitude,
      });
    } else {
      stations2[value.startStationId].push(value)
    }
  });

  console.log("<< Create resolvers >>")

  const resolvers = {
      Query: {
        trips: (root) => jsonObj,
        stations: (root) => stations,
        trips: (root, { stationId }) => stations2[stationId],
      },
  };

  console.log("<< Init GraphiQL >>")
  const schema = makeExecutableSchema({
    typeDefs,
    resolvers,
  })
  graphQLServer.use('/graphql', bodyParser.json(), graphqlExpress({ schema }));
  graphQLServer.use('/graphiql', graphiqlExpress({ endpointURL: '/graphql' }));

  graphQLServer.listen(GRAPHQL_PORT, () =>
    console.log(`GraphiQL is now running on http://localhost:${GRAPHQL_PORT}/graphiql`)
  );
})






