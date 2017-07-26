VERSION=$(cat package.json | grep version | head -1 | awk -F: '{ print $2 }' | sed 's/[",]//g')

git tag $VERSION

git remote rm origin
git remote add origin https://rtrompier:${GITHUB_TOKEN}@github.com/DSI-HUG/dejajs-components.git

git push --tags