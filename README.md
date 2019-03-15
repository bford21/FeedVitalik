# FeedVitalik
I noticed a trend among most blockchain transaction visualizers out there and that's that they are almost all static. While it's nice to see all the fancy animations fly by on screen there's only so much time a user can spend siting idle. I wanted to create a transaction visualizer for Ethereum that was interactive and would keep people coming back. This led me to think of FeedVitalik.

![](screenshot.png)

FeedVitalik is an Ethereum blockchain transaction visualizer with a twist. The ether you see falling from the sky are real time transactions happening on the Ethereum blockchain. The size and value of each ether is determined by the size of the transaction. The speed at which the ether falls is tied to the amount of gas paid for the transactions. Eat the Eth to help feed a starving Vitalik as well as increase your score.

## Run Localy

FeedVitalik is currently only available to be run locally. Look for it to be available on the web soon @ feedvitalik.com

#### Create an account with Infura

Signup for an account at https://infura.io

Create a new project and set the project id and project secret as envirnment variables with the following names

`infuraAPIKey` 
`infuraAPIScret`

#### Clone repo, install and run

`git clone git@github.com:bford21/FeedVitalik.git`

`npm install`

`node app.js`
