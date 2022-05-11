// utils/appwrite.js

import { Appwrite } from 'appwrite'

export const server = {
    collectionID: process.env.NEXT_PUBLIC_APPWRITE_COLLECTION_ID,
    endpoint: process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT,
    batScoreCollectionID: process.env.NEXT_PUBLIC_APPWRITE_BATSCORE_COLLECTION_ID,
    matchesCollectionID: process.env.NEXT_PUBLIC_APPWRITE_MATCHES_COLLECTION_ID,
    oversCollectionID: process.env.NEXT_PUBLIC_APPWRITE_OVERS_COLLECTION_ID,
    project: process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID
}

export const appwrite = new Appwrite()
    .setEndpoint(server.endpoint)
    .setProject(server.project)

export const getUser = async() => {
    let promise = appwrite.account.get()
    await promise.then(res => res, err => (err.message)).catch(err => err)
}

export const getPlayers = async(docID) => {
    let promise = await appwrite.database.getDocument(server.collectionID, docID)
    promise.then( res => res.players, err => err.message, p => {console.log(p)} )
}