# Hiking routes in Switzerland

## Installation

### Project

```
git clone git@github.com:lyx-x/SwissHiking.git
```

### Dependencies

```
curl -sL https://deb.nodesource.com/setup_8.x | sudo -E bash -
sudo apt-get install -y nodejs
sudo npm install npm --global
cd SwissHiking
npm install
```

### Launch

The default port is at 3000, this is defined in `bin/www`.

```
npm run start
```

### Deployment

This project is currently deployed to Google App Engine via Cloud Build. The config are located in `app.yaml` and `cloudbuild.yaml`. Just push to the master branch, the app will be deployed to [https://swisshiking.herokuapp.com/](https://swisshiking.herokuapp.com/).
