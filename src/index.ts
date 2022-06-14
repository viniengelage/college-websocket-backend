import { createServer } from "http";
import { Server, Socket } from "socket.io";
import { getColletion } from "./database";

export interface ICoordinateProps {
  hash:string;
  lat:number;
  lng:number;
  description:string;
}

const httpServer = createServer();

const io = new Server(httpServer, {
  cors: {
    origin: "*"
  }
});

const listCoordinates = async (clientId:string) => {
  const collection = await getColletion();

  const coordinates = await collection.find({}).toArray();

  return io.to(clientId).emit("listCoordinates", coordinates)
}

const addCoordinates = async (data: ICoordinateProps, clientID: string) => {
  const { hash, lat, lng, description } = data;

  const collection = await getColletion()

  const coordsExists = await collection.findOne({
    hash
  });

  if(coordsExists){
    return io.to(clientID).emit("error", "Coordenada já adicionada")
  }

  await collection.insertOne({
    hash,
    lat,
    lng,
    description
  })

  io.to(clientID).emit("addedCoordinates", 'Coordenada adicionada')

  const coordinates = await collection.find({}).toArray();
  
  io.to(clientID).emit("listCoordinates", coordinates)
}

io.on("connection", (socket: Socket) => {
  socket.on("listCoordinates", () => listCoordinates(socket.id));

  socket.on("addCoordinates", (data) => addCoordinates(data, socket.id));

  socket.to(socket.id).emit("connected", { message: "Socket conectado" });
});

io.on("disconnect", () => console.log("Alguem desconectou"))

httpServer.listen(8080, () => console.log("Servidor iniciado!"));