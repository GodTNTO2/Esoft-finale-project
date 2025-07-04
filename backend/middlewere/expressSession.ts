import session from "express-session";
import connectRedis  from "connect-redis"
import { createClient } from "redis"

const redisClient = createClient({
  socket: {
    host: "127.0.0.1",
    port: 6379,
    connectTimeout: 15000
  }
})

const RedisStore = connectRedis(session);

redisClient.connect()
  .then(() => console.log("Ридис конект"))
  .catch(console.error)


const expressSession = session({
  store: new RedisStore({ 
    client: redisClient,
    prefix: "sess:"
  }),
  secret: process.env.SESSION_SECRET as string,
  resave: false,
  saveUninitialized: true,
  cookie: {
    httpOnly: true,
    secure: false,
    maxAge: 1000 * 60 * 60 * 24 * 7
  },
})

export default expressSession