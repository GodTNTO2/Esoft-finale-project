import session from "express-session";
const RedisStore = require("connect-redis").default;
import {createClient} from "redis";

const redisClient = createClient({
  // url: 'redis://default:oClLTpSHF9glSnLo5ZUw2ILk8Ehinb4n@redis-13604.c276.us-east-1-2.ec2.redns.redis-cloud.com:13604',
  url: 'redis://localhost:6379',
  socket: {
    connectTimeout: 15000
  }
})

// const redisClient = redis.createClient({
//   port: 6379,
//   host: 'localhost'
// })
redisClient.on('error', (err) => {
  console.log('Redis error:', err);
});

async() => {
  await redisClient.connect()
    .then(() => console.log("Ридис конект"))
    .catch(console.error)
}

redisClient.connect()
  .then(() => console.log("Ридис конект"))
  .catch(console.error)





const redisStore = new RedisStore({
  client: redisClient,
  prefix: "sess:",
  ttl: 86400,
  disableTouch: false,
});


const expressSession = session({
  store: redisStore,
  secret: "very-very-very-strong",
  name: "sessionUser",
  resave: false,
  saveUninitialized: true,
  cookie: {
    httpOnly: true,
    sameSite: "lax",
    secure: false,
    maxAge: 1000 * 60 * 60 * 24,
  },
});

export default expressSession