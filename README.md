# Zoomeasy


## Installation

```bash
# Clone this project
$ git clone git@github.com:MarquisG/Zoomeasy.git
$ cd Zoomeasy

# Install, configure and start Backend
$ cd apps/api
$ cp .env.example .env  <-- Modify the .env file with given values
$ npm install
$ npm run serve

# Install Frontend and start
$ cd apps/front
$ npm install
$ npm run sart

# The followig services should start on these ports:
# - 3000: front
# - 4000: api
```