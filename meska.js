const fs = require("fs")
const Meska = require('meska.js');
const Logger = new Meska.Logger({ basePath: "logs"})
const request = require('request');

fs.readFile("tokens/input/input.txt", { encoding: "utf8", flag: "r" }, async  function(error, data) {
    if (error) {
        Logger.error("FILE", error, true);
    } else if(data == "") {
        Logger.error("FILE", "input.txt file is empty!", true);
    } else {
        let tokens = data.split("\n")

        tokens.forEach(async token => {
            let invaild = 0
            let unverified = 0
            let verified = 0
            let total = 0

            request.get({ url: "https://discordapp.com/api/v7/users/@me", headers: { authorization: token }}, async function(error, response, body) {
                if(error) {
                    Logger.error("REQUEST", error, true)
                } else if(body) {
                    let json = JSON.parse((body))

                    if(!json.id) {
                        fs.writeFileSync("tokens/output/invaild.txt", token + "\n", { encoding: "utf-8", flag: "a+"}, async function(error) {
                            Logger.error("FILE", error, true)
                        })
                        invaild += 1;
                    }
                else if(!json.verified) {
                        fs.writeFileSync("tokens/output/unverified.txt", token + "\n", { encoding: "utf-8", flag: "a+"}, async function(error) {
                            Logger.error("FILE", error, true)
                        })
                        unverified += 1;
                    }
                else {
                        fs.writeFileSync("tokens/output/verified.txt", token + "\n", { encoding: "utf-8", flag: "a+"}, async function(error) {
                            Logger.error("FILE", error, true)
                        })
                        verified += 1;
                    }
                }
            })
            total += 1;
            if(total == tokens.length) {
                Logger.success("CHECKER", verified + " out of " + total + " tokens work.", true);
            }
        })
    }
})
