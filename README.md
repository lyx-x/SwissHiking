# Hiking routes in Switzerland

Frontend app for displaying hiking routes in Switzerland on a OpenStreetMap. The content is fetched from SchweizMobil website.

## Installation

### Project

```
git clone git@github.com:lyx-x/SwissHiking.git
```

### Dependencies

```
curl -sL https://deb.nodesource.com/setup_10.x | sudo -E bash -
sudo apt-get install -y nodejs
sudo npm install npm --global
cd SwissHiking
npm install
```

You'll also need to setup authentication for Google Cloud in order to access Datastore.

### Launch

The default port is at 3000, this is defined in `bin/www`.

```
npm run start
```

## How to setup GCP App Engine (GAE)

This project is currently deployed to Google App Engine via Cloud Build. The config are located in `app.yaml` and `cloudbuild.yaml`. Just push to the master branch, the app will be deployed to https://swiss-hiking.appspot.com. This section writes down some of the important steps when configuring the stack.

### App Engine



### Cloud Build

We use Cloud Build and Cloud Source Repositories to update our app after each push to the master branch. The config is written in `cloudbuild.yaml` which contains 3 tasks: installing dependencies, deploying the app and deploying the cron job. The Cloud Build service account needs 2 permissions for deploying the app and the cron job. The first is given by App Engine Admin role and the second by Cloud Scheduler Admin role.
