const { BitbucketCLI }  = require('./bitbucket-cli.js');

async function main() {
    try {
    const bitBucketCLI = new BitbucketCLI();
    bitBucketCLI.run();
    } catch(e){
        console.error('Error:', e);
    }
}

main();

