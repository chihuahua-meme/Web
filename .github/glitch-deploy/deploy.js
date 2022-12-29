const upload_Md = require('./git-push.js');
const createNew_Md = require('./newCreate.js')
const shell = require('shelljs')
const queryString = require('query-string');
const axios = require("axios").default;
const axiosRetry = require('axios-retry');

setTimeout(() => {
  console.log('force exit');
  process.exit(0)
}, 30 * 60 * 1000);

axiosRetry(axios, {
  retries: 100,
  retryDelay: (retryCount) => {
    // console.log(`retry attempt: ${retryCount}`);
    return 3000 || retryCount * 1000;
  },
  retryCondition: (error) => {
    return error.response.status === 502;
  },
});


const listProject = `https://a15d4323-399b-4565-845e-91f2c9b29c08@api.glitch.com/git/pushy-exultant-fibula|https://a15d4323-399b-4565-845e-91f2c9b29c08@api.glitch.com/git/determined-quirky-piranha|https://a15d4323-399b-4565-845e-91f2c9b29c08@api.glitch.com/git/brief-jasper-hibiscus|https://a15d4323-399b-4565-845e-91f2c9b29c08@api.glitch.com/git/sour-circular-ceiling|https://a15d4323-399b-4565-845e-91f2c9b29c08@api.glitch.com/git/horse-humble-weaver|https://a15d4323-399b-4565-845e-91f2c9b29c08@api.glitch.com/git/bitter-curvy-truffle|https://a15d4323-399b-4565-845e-91f2c9b29c08@api.glitch.com/git/coal-spiky-radish|https://a15d4323-399b-4565-845e-91f2c9b29c08@api.glitch.com/git/icy-viridian-lettuce|https://a15d4323-399b-4565-845e-91f2c9b29c08@api.glitch.com/git/cuboid-sugary-scene|https://a15d4323-399b-4565-845e-91f2c9b29c08@api.glitch.com/git/polyester-stripe-celsius|https://a15d4323-399b-4565-845e-91f2c9b29c08@api.glitch.com/git/actually-cat-fly|https://a15d4323-399b-4565-845e-91f2c9b29c08@api.glitch.com/git/actually-bedecked-princess|https://a15d4323-399b-4565-845e-91f2c9b29c08@api.glitch.com/git/fish-hospitable-governor|https://a15d4323-399b-4565-845e-91f2c9b29c08@api.glitch.com/git/robust-melted-stygimoloch`.trim().split('|');

const delay = t => {
  return new Promise(function(resolve) {
    setTimeout(function() {
      resolve(true);
    }, t);
  });
};

(async () => {
  try {
    let accountNumber = 0;

    for (let i = 0; i < listProject.length; i++) {
      accountNumber = i + 1;
      try {
        const nameProject = listProject[i].split('/')[4]
        console.log('deploy', nameProject);
        createNew_Md.run(nameProject)
        await upload_Md.upload2Git(listProject[i].trim(), 'code4Delpoy');
        console.log(`account ${accountNumber} upload success ^_^`);

        axios
          .get(`https://eager-profuse-python.glitch.me/deploy?${queryString.stringify({
            email: listProject[i].trim() + ' true'
          })}`)
          .then((response) => {
            console.log(response.data);
          })
          .catch((error) => {
            if (error.response) {
              console.log(error.response.data);
            } else {
              console.log('Loi');
            }
          });

        if (i + 1 < listProject.length) await delay(1.8 * 60 * 1000);
      } catch (error) {
        console.log(`account ${accountNumber} upload fail ^_^`);
        axios
          .get(`https://eager-profuse-python.glitch.me/deploy?${queryString.stringify({
            email: listProject[i].trim() + ' false'
          })}`)
          .then((response) => {
            console.log(response.data);
          })
          .catch((error) => {
            if (error.response) {
              console.log(error.response.data);
            } else {
              console.log('Loi');
            }
          });
      }

      if (process.cwd().includes('code4Delpoy')) shell.cd('../', { silent: true });

    }

    await delay(20000)
    console.log('Done! exit')
    process.exit(0)

  } catch (err) {
    console.log(`error: ${err}`);
  }
})();