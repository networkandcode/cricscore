/*const apiUserState = selector({
    key: "apiUser",
    get: async ({ get }) => {
        try {
            const res = await appwrite.account.get()
            return res || null
        } catch (err) { 
            return null
        }
    }
});

const apiPlayersState = selector({
    key: "apiPlayers",
    get: async ({ get }) => {
        try {
            const user = get(userState)
            const res = await appwrite.database.getDocument(server.collectionID, user.$id)
            console.log('players', res.players)
            return res.players || []
        } catch (err) { 
            return []
        }
    }
});

const userState = atom({
    default: apiUserState,
    key: 'user'
})

const playersState = atom({
    default: apiPlayersState,
    key: 'players'
})*/
