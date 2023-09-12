import core from '@actions/core';

import {Postman} from './postman.js'

init()

async function init () {

    try {

        const goal = core.getInput('goal');
        if(!goal) {
            throw new Error("Missing input goal");
        }
        console.log("goal->" + goal)

        if (goal !== "create" && goal !== "update" && goal !== "createOrUpdate") {
            throw new Error("Unsupported goal: " + goal);
        }

        const postmanApiKey = core.getInput('postman-key');
        if(!postmanApiKey) {
            throw new Error("Missing input postman-key");
        }

        const postmanFile = core.getInput('postman-file');
        console.log("Postman file(s): " + postmanFile);
        if(!postmanFile) {
            core.info('No Postman file(s) provided');
            core.setOutput('message', 'No Postman file(s) provided');
            core.setOutput('status', 'success');

            return;
        }

        const workspaceId = core.getInput('workspace-id');
        const collectionId = core.getInput('collection-id');

        if(goal == 'createOrUpdate' && !workspaceId) {
            throw new Error("Goal <createOrUpdate> requires workspace-id");
        }

        if(goal == 'create' && !workspaceId) {
            throw new Error("Goal <create> requires workspace-id");
        }

        if(goal == 'update' && !collectionId) {
            throw new Error("Goal <update> requires collection-id");
        }

        if(goal == 'create') {
            createCollection(postmanApiKey, postmanFile, workspaceId);
        } else if (goal == 'update') {
            updateCollection(postmanApiKey, postmanFile, collectionId);
        } else if (goal == 'createOrUpdate') {
            createOrUpdateCollection(postmanApiKey, postmanFile, collectionId);
        } else {
            throw new Error("Unrecognised goal " + goal);
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

async function createOrUpdateCollection(postmanApiKey, postmanFile, workspaceId) {
    new Postman(postmanApiKey).createOrUpdateCollection(postmanFile, workspaceId);
}
