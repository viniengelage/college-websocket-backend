import { MongoClient, Collection } from "mongodb";
import { ICoordinateProps } from ".";

const uri =
  "mongodb+srv://uniamerica:uniamerica@cluster0.nbu3e.mongodb.net/?retryWrites=true&w=majority";


const getColletion = async (): Promise<Collection<ICoordinateProps>> => {
    const client = new MongoClient(uri);

    await client.connect();

    return client.db('coordinantes').collection('coordinantes')
}

export { getColletion }