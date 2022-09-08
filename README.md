# AY22/23 CS3219 OTOT Assignment Task B

## Assignment Details
[CS3219_Assignment_OTOT_Task B.pdf](OTOT_Task_B%20e069206f6a6f49198e3b2b0f9a2a7888/CS3219_Assignment_OTOT_Task_B.pdf)

## Tasks

| Task | GitHub URL |
| --- | --- |
| Task B1 | https://github.com/laughingkid-sg/OTOT-CS3219/tree/task-b1 |
| Task B2.1 | https://github.com/laughingkid-sg/OTOT-CS3219/tree/task-b2-1 |
| Task B2.2 | https://github.com/laughingkid-sg/OTOT-CS3219/tree/task-b2-2 |
| Task B3 | https://github.com/laughingkid-sg/OTOT-CS3219/tree/task-b3 |
| Task B4 | https://github.com/laughingkid-sg/OTOT-CS3219/tree/task-b4 |
| main | https://github.com/laughingkid-sg/OTOT-CS3219/tree/main |

→ Each individual task is branch out to complete to specific task(s) as per the assignment

→ All task are merged into `main` as to showcase Task B

## Tech Stack

**Backend:** Node.js and Express

**Node version:** 16.15.0

**Frontend:** React with Chakra UI

**Database:** Microsoft SQL on Azure via TypeORM

**Testing:** Mocha & Chai

**CI/CD:** GitHub Actions

**Cloud Deployment:** Azure Web App, Azure Functions

**External API:** [CoinGecko](https://www.coingecko.com/en/api/documentation)

## Environment Variables

### Backend

| Key | Type | Description |
| --- | --- | --- |
| DATABASE_DBHOST | Required | MSSQL Database Host |
| DATABASE_USERNAME | Required | MSSQL Database Username |
| DATABASE_PASSWORD | Required | MSSQL Database Password |
| DATABASE_NAME | Required | MSSQL Database Name |
| PORT | Optional | Port number for express server |
| BASIC_USERNAME | Required | Basic Authentication Username  |
| BASIC_PASSWORD | Required | Basic Authentication Password |

### Frontend

| Key | Type | Description | Default Values |
| --- | --- | --- | --- |
| REACT_APP_API_URI | Required | Webserver URI | https://cs3219.azurewebsites.net |
| REACT_APP_SERVERLESS_URI | Required | Serverless function URI | https://trending-crypto.azurewebsites.net |
| REACT_APP_BASIC_USERNAME | Required | Basic Authentication Username  | demo@cs3219.com |
| REACT_APP_BASIC_PASSWORD | Required | Basic Authentication Password | 123456 |

→ Basic auth was not fully implmented as it was not required, was add for future extension.

## Additional References

| Task | Link | Notes |
| --- | --- | --- |
| Task B2.1 | https://docs.github.com/en/actions/automating-builds-and-tests/building-and-testing-nodejs | Setup GitHub CI for Node.js app |
| Task B2.1 | https://docs.github.com/en/actions/security-guides/encrypted-secrets | Configure encrypted secrets for an environment |
| Task B2.1 | https://dev.to/saniadsouza/how-to-use-environment-variables-at-build-using-github-actions-jha | Configure environment variables for workflow |
| Task B2.2 | https://docs.microsoft.com/en-us/azure/app-service/deploy-github-actions?tabs=applevel | Continuous Deployment to Azure App Service  |
| Task B2.2 | https://bytelanguage.net/2020/12/26/deploy-github-sub-directory-to-azure/ | Deploying a subdirectory in GitHub Repo |
| Task B4 | https://docs.microsoft.com/en-us/azure/azure-functions/create-first-function-cli-typescript?tabs=azure-cli%2Cbrowser | Creating Azure function locally using command line |
