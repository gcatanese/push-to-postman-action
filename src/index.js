import core from '@actions/core';

import {Postman} from './postman.js'

init()

async function init () {

    try {

        const postmanApiKey = core.getInput('postman-key');
        if(!postmanApiKey) {
            throw new Error("Missing input postman-key");
        }

        const postmanFile = core.getInput('postman-file');
        if(!postmanFile) {
            throw new Error("Missing input postman-file");
        }

        const workspaceId = core.getInput('workspace-id');
        const collectionId = core.getInput('collection-id');
        if(!workspaceId && !collectionId) {
            throw new Error("Provide either collection-id or workspace-id");
        }

        if(collectionId) {
            updateCollection(postmanApiKey, postmanFile, collectionId);
        } else if (workspaceId) {
            createCollection(postmanApiKey, postmanFile, workspaceId);
        }

    } catch (error) {
        core.setFailed(error.message)
    }
}

async function updateCollection(postmanApiKey, postmanFile, collectionId) {
    new Postman(postmanApiKey).updateCollection(postmanFile, collectionId);
}

async function createCollection(postmanApiKey, postmanFile, workspaceId) {
    new Postman(postmanApiKey).createCollection(postmanFile, workspaceId);
}

