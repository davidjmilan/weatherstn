cd ..
npm run build -- --dest server/public > /dev/null
cd server
node src/app.js