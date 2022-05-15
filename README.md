This is a cricket scoring fun web app made with NextJS and Appwrite, developed for the [Appwrite Hackathon at dev.to](https://dev.to/devteam/announcing-the-appwrite-hackathon-on-dev-1oc0)

It uses the authentication and database functionalities of appwrite. Once a user is authenticated, they can create matches add scores for their matches and save those in the database. Please note that no caching mechanisms or local storage is used. The state is managed with React context and the data is stored in the database at regular intervals such as after an over, or when there is a wicket. 

The env variable names are give at `env.sample` for reference.