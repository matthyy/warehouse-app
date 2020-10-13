const axios = require('axios');

// eslint-disable-next-line import/no-dynamic-require
const db = require('./../models');

const apiAndroid = "https://sensortower.com/api/android/rankings/get_category_rankings?category=all&country=US&date=2020-10-06T00%3A00%3A00.000Z&device=MOBILE&limit=300&offset=0";
const apiAppStore = "https://sensortower.com/api/ios/rankings/get_category_rankings?category=0&country=US&date=2020-10-06T00%3A00%3A00.000Z&device=IPHONE&limit=300&offset=0";

exports.getTop100Games = async () => {
    const [bestAndroidGames, bestIosGames] = await Promise.all(getAndroidAndIosGames())
    console.log('laa', bestAndroidGames, bestIosGames)
    const hashMapOfDownloadByGames = new Map()

    buildHasMap(bestAndroidGames.data || [], hashMapOfDownloadByGames)
    buildHasMap(bestIosGames.data || [], hashMapOfDownloadByGames)

    const orderedGames = new Map([...hashMapOfDownloadByGames].sort((a,b) => {
        return b[1]['nbDownloads'] - a[1]['nbDownloads']
    }))

    const top100orderedGames = extractTop100(orderedGames)

    return db.Game.bulkCreate(top100orderedGames)
}

const buildHasMap = (gamesOfGames, hashMap) => {
    for(const gamesOfGame of gamesOfGames) {
        if (Array.isArray(gamesOfGame)) {
            for(const game of gamesOfGame) {
                if (game && game.humanized_worldwide_last_month_downloads && game.humanized_worldwide_last_month_downloads.downloads) {
                    const {publisher_id, name, bundle_id, humanized_worldwide_last_month_downloads} = game
                    const key = `${game.os}-${name}`
                    hashMap.set(key, {
                        publisherId: publisher_id,
                        name,
                        platform: game.os,
                        bundleId: bundle_id,
                        appVersion: game.version,
                        isPublished: true,
                        createdAt: new Date().toDateString(),
                        updatedAt: new Date().toDateString(),
                        nbDownloads: humanized_worldwide_last_month_downloads.downloads
                    })
                }
            }
        }
    }
}

exports.getAndroidAndIosGames = () => {
    const promiseAndroid = axios.get(apiAndroid).catch((e) => {
        console.log(`error when fetching android results ${JSON.stringify(e)}`)
        return Promise.resolve([])
    })
    const promiseIos = axios.get(apiAppStore).catch((e) => {
        console.log(`error when fetching android results ${JSON.stringify(e)}`)
        return Promise.resolve([])
    })

    return [promiseAndroid, promiseIos]
}

const extractTop100 = (orderedGames) => {
    const top100orderedGames = []
    let i = 0
    for(const orderedGame of orderedGames.values()) {
        if (i === 100) return top100orderedGames
        const {nbDownloads, ...game} = orderedGame
        top100orderedGames.push(game)
        i++
    }

    return top100orderedGames
}