import axios from 'axios';
import fs from "fs";

const URL = "https://api.getpostman.com/collections";

export class Postman {

    constructor(postmanApiKey) {
        this.postmanApiKey = postmanApiKey;
    }

    createCollection(postmanFile, workspaceId) {

        console.log("Pushing (post) to Postman..");

        const config = {
            params: {
                'workspace': workspaceId,
            },
            headers: {
                'Content-Type': 'application/json',
                'X-API-Key': this.postmanApiKey,
            },
        };

        const files = postmanFile.split(' ');

        for (const file of files) {

            if (this.isJsonFile(file)) {
                axios
                    .post(URL, this.getFileAsJson(file), config)
                    .then(res => {
                        console.log(res.data)
                    })
                    .catch(error => {
                        throw error;
                    })
            } else {
                console.log("Skip " + file);
            }
        }

    }

    updateCollection(postmanFile, collectionId) {

        console.log("Pushing (put) to Postman..");

        const config = {
            headers: {
                'Content-Type': 'application/json',
                'X-API-Key': this.postmanApiKey,
            },
        };

        const files = postmanFile.split(' ');

        for (const file of files) {

            if (this.isJsonFile(file)) {
                axios
                    .put(URL + "/" + collectionId, this.getFileAsJson(file), config)
                    .then(res => {
                        console.log(res.data)
                    })
                    .catch(error => {
                        throw error;
                    })
            } else {
                console.log("Skip " + file);
            }

        }

    }

    async createOrUpdateCollection(postmanFile, workspaceId) {

        // get title
        const json = this.loadJson(postmanFile);

        const title = json.info.name;
        console.log("Collection title: " + title)

        // get all collections

        const config = {
            params: {
                'workspace': workspaceId,
            },
            headers: {
                'X-API-Key': this.postmanApiKey,
            },
        };


        const files = postmanFile.split(' ');

        for (const file of files) {

            if (this.isJsonFile(file)) {

                var create = true;
                var collectionId = -1;

                await axios
                    .get(URL, config)
                    .then((response) => {
                        if (response.status === 200) {
                            const collections = response.data.collections;
                            collections.forEach((collection) => {
                                if(collection.name === title) {
                                    create = false;
                                    collectionId = collection.uid
                                }
                            });
                        } else {
                            throw error('Error retrieving collections:', response.statusText);
                        }
                    })
                    .catch((error) => {
                        throw error;
                    });
            }
        }

        if(create) {
            this.createCollection(postmanFile, workspaceId);
        } else {
            this.updateCollection(postmanFile, collectionId);
        }

    }


    isJsonFile(file) {
        return file.endsWith(".json");
    }

    getFileAsJson(postmanFile) {
        const collection = this.loadJson(postmanFile);
        return JSON.stringify({
            "collection": collection,
        });

    }

    loadJson(postmanFile) {
        return JSON.parse(fs.readFileSync(postmanFile, 'utf8'));
    }
}

