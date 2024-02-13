const express = require("express");
const { ApolloServer } = require("@apollo/server");
const { expressMiddleware } = require("@apollo/server/express4");
const bodyParser = require("body-parser");
const cors = require("cors");
const { default: axios } = require("axios");

const { USERS } = require("./user");
const { TODOS } = require("./todo");

async function startServer() {
  const app = express();
  //ApolloServer ma aapde typeDefs ane resolvers pass karva pade ena vagar e error aapse 
  //typeDefs matlab e schema hoy like type User{} to aani andar user ni je field hoy e badhi lakhvani ane ema id:ID! aano matlab evo thay ke id ni value ID type ni hase ID type means anything 
  //username:String! matlab username che teni value String hase ane last ma ! aano matlab evo thay ke e field not null che matlab e field required field che 
  //ahi aapde graphql ma thi data fetch karie chie etle type Query ma badhi query lakhsu 
  //getTodos:[Todo] matlab getTodos kari ne query hase je array of Todo return karse 
  //ane resolvers ma aapde Query:{

  //} ma lakhsu getTodos:()=>TODOS matlab ke jyare pan getTodos vadi query execute thase tyare aa function execute karvanu ane e function ma aapde enu logic lakhsu
  const server = new ApolloServer({
    typeDefs: `
        type User {
            id: ID!
            name: String!
            username: String!
            email: String!
            phone: String!
            website: String!
        }

        type Todo {
            id: ID!
            title: String!
            completed: Boolean
            user: User
        }

        type Query {
            getTodos: [Todo]
            getAllUsers: [User]
            getUser(id: ID!): User
        }

    `,
    //resolvers ma Todo:{} aano matlab typeDef ma jya Todo che teni key user ne koi access karvani try kare to aa logic execute thai jay 
    //ane ema function ma je todo jay che te already aapde je Todo object mate execute karyu hoy e che e 
    resolvers: {
      Todo: {
        user: (todo) => USERS.find((e) => e.id === todo.id),
      },
      Query: {
        getTodos: () => TODOS,
        getAllUsers: () => USERS,
        //jyare aapde parameter pass karta hoie tyare first parameter parent aave e kem aave e hamna samjatu nathi
        getUser: async (parent, { id }) => USERS.find((e) => e.id === id),
      },
    },
  });

  app.use(bodyParser.json());
  app.use(cors());

  await server.start();

  //niche ni line no matlab evo thay ke koi pan request /graphql end point par aavse tene graphql server handle karse
  app.use("/graphql", expressMiddleware(server));

  app.listen(8000, () => console.log("Serevr Started at PORT 8000"));
}

startServer();
