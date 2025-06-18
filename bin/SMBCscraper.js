import axios from "axios";
import * as cheerio from "cheerio";
import fs from "fs";

function cacheGet(name) {
    if (fs.existsSync(`./cache/${name}.html`)) {
        return fs.readFileSync(`./cache/${name}.html`);
    }
    return false;
}

function cacheSet(name, value) {
    if (!fs.existsSync(`./cache`)) {
        fs.mkdirSync(`./cache`);
    }
    fs.writeFileSync(`./cache/${name}.html`, value);
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

let baseUrl = 'https://www.smbc-comics.com';
let url = baseUrl + '/comic';

(async () => {
    for (let i = 0; i < 10; i++) {
        let name = url.replaceAll('/', '').replaceAll(':', '');
        let data = cacheGet(name);
        if (!data) {
            console.log('LIVE REQUEST!!!');
            await sleep(1000);
            let res = await axios.get(url);
            data = res.data;
            cacheSet(name, data);
        }
        const $ = cheerio.load(data);
        let img = $('#cc-comic').attr('src');
        let title = $('#cc-comic').attr('title');
        let comicUrl = img.startsWith('http') ? img : baseUrl + img;
        let pageUrl = url;

        console.log(comicUrl);
        console.log(pageUrl);

        let prev = $('a.cc-prev').attr('href');
        if (!prev) break;
        url = prev.startsWith('http') ? prev : baseUrl + prev;
    }
})();