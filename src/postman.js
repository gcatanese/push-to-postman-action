import axios from 'axios';
import fs from "fs";

const URL = "https://api.getpostman.com/collections";

export class Postman {

    constructor(postmanApiKey) {
        this.postmanApiKey = postmanApiKey;
    }

    createCollection(postmanFile, workspaceId) {

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
                console.log("Pushing (post) " + file);
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
                console.log("Pushing (put) " + file);            
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

    isJsonFile(file) {
        return file.endsWith(".json");
    }

    getFileAsJson(postmanFile) {
        const collection = JSON.parse(fs.readFileSync(postmanFile, 'utf8'));
        return JSON.stringify({
            "collection": collection,
        });

    }
}

