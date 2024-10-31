import fastify, { FastifyRequest } from "fastify";


// This is a web server that should only accept requests from the front-end microservice and not any other application.
export const server = fastify({
    logger: true
});

server.get("/update", (req, res) => {
    console.log("Got update")
})