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

        console.log("Push (post) to Postman");

        axios
            .post(createCollectionUrl, this.getFileAsJson(postmanFile), config)
            .then(res => {
                console.log(`statusCode: ${res.statusCode}`)
                console.log(res)
            })
            .catch(error => {
                throw error;
            })

    }

    updateCollection(postmanFile, collectionId) {

        const updateCollectionUrl = URL + "/" + collectionId;

        const config = {
            headers: {
                'Content-Type': 'application/json',
                'X-API-Key': this.postmanApiKey,
            },
        };

        console.log("Push (put) to Postman");

        axios
            .put(updateCollectionUrl, this.getFileAsJson(postmanFile), config)
            .then(res => {
                console.log(`statusCode: ${res.statusCode}`)
                console.log(res)
            })
            .catch(error => {
                throw error;
            })

    }

    getFileAsJson(postmanFile) {
        const collection = JSON.parse(fs.readFileSync(postmanFile, 'utf8'));
        return JSON.stringify({
            "collection": collection,
        });

    }
}

