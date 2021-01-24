import { MongoClient, Collection } from 'mongodb'
import { response } from 'express';

const url = 'mongodb+srv://dima:12345@cluster0.pglaf.mongodb.net/?retryWrites=true&w=majority';

const dbName = 'todos';
const collectionName = 'newusers'

type UserType = {
    login: string,
    password: string,
    history: any[]
}

const getMongoInstance = async () => {
    const client = await MongoClient.connect(url);
        
    return client.db(dbName);
}

const getMongoCollection = async (): Promise<Collection> => {
    const db = await getMongoInstance();

    return db.collection(collectionName);
} 

const getAllUsers = async (login?: string) => {
    if (login) {
        const collection = await getMongoCollection();
        return collection.find({ login }).toArray();
    } else {
    const collection = await getMongoCollection();
    return collection.find({ }).toArray();
    }
}

const getUser = async (login: string) => {
    const collection = await getMongoCollection();
    return collection.findOne({ 'login' : `${login}` });
};

const createUser = async (user: UserType) => {
    const collection = await getMongoCollection();

    const response =  await collection.insertOne(user);
    return response.ops[0];
};

const updateUser = async (login: string, history: any) => {
    const collection = await getMongoCollection();
    return collection.updateOne(
        { login }, 
        {$set: { ...history }},
        { upsert: false });
};

const getUserHistory = async (login: string) => {
    const collection = await getMongoCollection();
    return collection.findOne({ login });
}

const getUserByKey = async (login: string, password: string) => {
    const collection = await getMongoCollection();
    return collection.findOne({ login, password });
}


export {
    getAllUsers,
    getUser,
    createUser,
    updateUser,
    getUserHistory,
    getUserByKey,
}