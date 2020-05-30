# Fragments

Collect and organise your articles into beautiful boards. Fragments is build with Meteor, so please refer to its official documentation about the development with such technology.

[https://fragments.me](https://fragments.me)

## Development

First, you have to copy the default `settings` file and put all your API keys in it.

```
cp settings.example.json settings.json
```

Then just run meteor as described here below.

## Run

```
$ meteor --settings settings.json
```

## Build for release

```
$ meteor build path/to/dir
```

---

## Troubleshooting

You may need to install the following packages:

```
meteor npm install --save babel-runtime
```

```
meteor npm install --save babel-runtime jquery hammerjs desandro-get-style-property eventie doc-ready desandro-matches-selector wolfy87-eventemitter get-size fizzy-ui-utils outlayer
```

---

## Deployment script for Unix machines

```
. ~/.nvm/nvm.sh
. ~/.profile
. ~/.bashrc

nvm use 4
cd source
git pull
meteor build ../build
cd ../build
tar -xzvf source.tar.gz
mv bundle/ ../release
cd ../release/programs/server/
npm install
cd ../../../
rm -rf build
rm -rf past-release
mv current past-release
mv release current

export MONGO_URL=mongodb://username:password@localhost:27017/fragments
export ROOT_URL=https://fragments.me
export METEOR_SETTINGS=$(cat env.json)
export PORT=1234
forever stop fragments-production || true
forever start -a --uid fragments-production current/main.js
```