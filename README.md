## IonRev Baseline Template for a New Project

### Instructions:
- Clone this project

- Install the following prerequisite OS packages:
  - Mac OSX: webstorm, xcode, brew ... use brew to install: nodejs/npm, yarn
  - Windows: nodejs/npm, yarn
  - Linux: nodejs/npm, yarn
  
- Install the following prerequisite NPM global packages:

    `npm install -g @vue/cli @feathersjs/cli @feathers-plus/cli @quasar/cli`
    
- Generate an ssh private key:

    `ssh-keygen -t rsa -b 4096`
    
    Note: you should password protect your public key `cat ~/.ssh/id_rsa.pub`
    
- Convert your `openssh` private key to an `rsa` private `pem`

    `cp -p ~/.ssh/id_rsa  ~/.ssh/id_rsa.pem && ssh-keygen -p -m pem -f ~/.ssh/id_rsa.pem`
    
- Open this projects code inside `WebStorm`

- Inside WebStorm click `ADD CONFIGURATION` at the top of the page ...

    ![ADD CONFIGURATION](webstorm-add-config.png)
    
    Note: You need to add 2 configurations (`server run dev`, `client run dev`)
    
    ![ADD CONFIGURATION DETAIL](webstorm-add-config-detail.png)

    Note: You will need `Environment` variables for the server as follows:
    
    ```NODE_ENV=development;HOST=0.0.0.0;PORT=3030;APP_SECRET=<generate secret via: feathers-plus generate secret> ;TUNNEL_MONGO=true;MONGO_DB_HOST=localhost;MONGO_DB_PORT=27018;MONGO_DB_USERNAME=training-todo-<name>;MONGO_DB_PASSWORD=training-todo-<name>;MONGO_DB_DATABASE=training-todo-<name>;MONGO_DB_KEEPALIVE=true;SSH_USERNAME=ec2-user;SSH_HOST=54.212.240.247;SSH_PORT=22;SSH_DST_HOST=10.0.1.66;SSH_DST_PORT=27017;SSH_KEY_PASSPHRASE=<passphrase>;SSH_PRIVATE_KEY=<path to id_rsa.pem>;TUNNEL_REDIS=true;REDIS_DB=1;REDIS_PASSWORD=<ask for redis password>;REDIS_PORT=6380```

    Note: Update your environment variables with specifics for your situation `< stuff >`, you will also need a database setup and give you id_rsa.pub to IT for access to the development environment.
    
- Generate a new secret for `APP_SECRET`

    `feathers-plus generate secret`
    
- In the `client` folder add a file `.quasar.env.json`

    ```{
       "development": {
         "ENV_TYPE": "Running Development",
         "ENV_DEV": "Development",
         "VUE_APP_FEATHERS_URL": "http://localhost:3030"
       },
       "demo": {
         "ENV_TYPE": "Running Demo",
         "ENV_DEV": "Demo",
         "VUE_APP_FEATHERS_URL": "https://something.demo.ionrev.com"
       },
       "production": {
         "ENV_TYPE": "Running Production",
         "ENV_PROD": "Production",
         "VUE_APP_FEATHERS_URL": "https://something.ionrev.com"
       },
       "test": {
         "ENV_TYPE": "Running Test",
         "ENV_Test": "Test",
         "VUE_APP_FEATHERS_URL": "http://localhost:3030"
       }
     }```
