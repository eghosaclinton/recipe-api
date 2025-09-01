import { FastifyInstance } from "fastify";
import FastifyApp from "../app";

describe("GET /ping", ()=>{
  let app: FastifyInstance;

  beforeAll(()=>{
    app = FastifyApp()
  })

  afterAll(()=>app.close)

  it("should return pong", async ()=>{
    const res = await app.inject({
      method: "GET",
      url: '/ping'
    })

    expect(res.statusCode).toBe(200)
    expect(res.json()).toEqual({message: 'pong'})
  })  
})


