import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@apollo/server/express4";
import bodyParser from "body-parser";
import express from "express";
import { prismaClient } from "../clients/db";


export async function initServer() {
    const app = express();

    app.use(bodyParser.json())

    prismaClient.user.create({
        data: {
            firstName: 'Hemant',
            lastName: 'Ranoliya',
            email: 'hemant.is.there@gmail.com',
            profileImageURL: 'https://cdn.pixabay.com/photo/2015/04/23/22/00/tree-736885__480.jpg',
        }
    })


    const graphqlServer = new ApolloServer({
        typeDefs: `
            type Query {
                hello: String
            }
        `,
        resolvers: {
            Query: {
                hello: () => 'Hello World!'
            },
        }
    })

    await graphqlServer.start()

    app.use('/graphql', expressMiddleware(graphqlServer))

    return app
}