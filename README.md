# push-to-postman action

The GitHub action to push your collections to Postman.com.

## Usage

Add the push-to-postman action and set the required inputs

* `goal`: create, update, createOrUpdate
* `postman-key`: your Postman API key
* `postman-file`: your Postman json file(s)
* `workspace-id`: your Postman workspace id. Required only for `create` goal
* `collection-id`: your Postman collection id. Required only for `update` goal

### Goals

`create` always creates a new collection (in a given workspace)
`update` updates an existing collection (given its id)
`createOrUpdate` update an existing collection when the title matches, otherwise it creates a new one

### Create new collection

Create new Postman collection using `workflow_dispatch`

```yaml
    - name: push-to-postman-action
      id: process
      uses: gcatanese/push-to-postman-action@main
      with:
        goal: create
        postman-key: ${{ secrets.POSTMAN_API_KEY }}
        postman-file: ${{ github.event.inputs.postmanFile }}
        workspace-id: ${{ github.event.inputs.workspaceId }}
```

### Update existing collection

Update existing Postman collection using `workflow_dispatch`

```yaml
    - name: push-to-postman-action
      id: process
      uses: gcatanese/push-to-postman-action@main
      with:
        goal: update
        postman-key: ${{ secrets.POSTMAN_API_KEY }}
        postman-file: ${{ github.event.inputs.postmanFile }}
        collection-id: ${{ github.event.inputs.collectionId }}
```

### Create new collection after git push

Create new Postman collection on `push`

```yaml
on: 
  push:
    branches:
      - main
    paths:
      - 'test/**'     # run on specific folder(s) only

jobs:
  test:
    runs-on: ubuntu-latest
    name: Test 
    steps:
      - uses: actions/checkout@v4
        with:
            fetch-depth: 0
      - name: Get changed JSON files in a given folder
        id: changed-json-files
        uses: tj-actions/changed-files@v39
        with:
          files: test/*.json
      - name: push-to-postman-action
        id: push-to-postman
        uses: gcatanese/push-to-postman-action@main
        with:
          goal: create
          postman-key: ${{ secrets.POSTMAN_API_KEY }}
          postman-file: ${{ steps.changed-json-files.outputs.all_changed_and_modified_files }}
          workspace-id: ${{ secrets.POSTMAN_WORKSPACE_ID }}
```
