import axios from 'axios';
import { create } from 'domain';
import fs from "fs";

const URL = "https://api.getpostman.com/collections";

export class Postman {

    constructor(postmanApiKey) {
        this.postmanApiKey = postmanApiKey;
    }

    createCollection(postmanFile, workspaceId) {

        console.log("Pushing (post) to Postman..");

        const createCollectionUrl = URL + "?workspace=" + workspaceId;

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
                    .post(createCollectionUrl, this.getFileAsJson(file), config)
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

        const updateCollectionUrl = URL + "/" + collectionId;

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
                    .put(updateCollectionUrl, this.getFileAsJson(file), config)
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

    createOrUpdateCollection(postmanFile, workspaceId) {

        // get title
        const json = this.loadJson(postmanFile);

        const title = json.info.name;
        console.log("Collection title: " + title)

        // get collections
        const getCollectionsUrl = URL + "?workspace=" + workspaceId;

        const headers = {
            'X-API-Key': this.postmanApiKey
        };

        const files = postmanFile.split(' ');

        for (const file of files) {

            if (this.isJsonFile(file)) {

                var create = true;
                let collectionId = -1;

                axios
                    .get(getCollectionsUrl, { headers })
                    .then((response) => {
                        if (response.status === 200) {
                            const collections = response.data.collections;
                            collections.forEach((collection) => {
                                if(collection.name == title) {
                                    create = false;
                                    collectionId = collection.uid
                                }
                                console.log(`Collection Name: ${collection.name}`);
                                console.log(`Collection ID: ${collection.uid}`);
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

        console.log(create)
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

