import {
    fetch
} from 'undici';

class ShortLink {
    constructor(private apiKeys: { [key: string]: string } = {}) {}

    private async getService(service: string) {
        switch (service) {
            case 'tinyurl':
                return this.tinyurl;
            case 'linkpoi':
                return this.linkpoi;
            case 'bitly':
                return this.bitly;
            case 'ouo':
                return this.ouo;
            case 'onept':
                return this.onept;
            case 'cleanuri':
                return this.cleanuri;
            case 'gotiny':
                return this.gotiny;
            case 'isgd':
                return this.isgd;
            case 'vgd':
                return this.vgd;
            case 'tnyim':
                return this.tnyim;
            case 'kutt':
                return this.kutt;
            case 'rebrandly':
                return this.rebrandly;
            case 'multishort':
                return this.multishort;
            case 'shrtco':
                return this.shrtco;
            case 'vurl':
                return this.vurl;
            case 'cuttly':
                return this.cuttly;
            case 'shorte':
                return this.shorte;
            case 'adfoc':
                return this.adfoc;
            case 'dxyz':
                return this.dxyz;
            case 'shorturl':
                return this.shorturl;
            case 'ssur':
                return this.ssur;
            case 'adfly':
                return this.adfly;
            default:
                throw new Error(`Unsupported service: ${service}`);
        }
    }

    private async tinyurl(url: string) {
        return this.shortenUrl(`https://tinyurl.com/api-create.php?url=${url}`);
    }

    private async linkpoi(url: string) {
        return this.shortenUrl(`https://linkpoi.me/api.php?url=${url}`);
    }

    private async bitly(url: string) {
        return this.shortenUrl('https://api-ssl.bitly.com/v4/shorten', {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${this.apiKeys.bitly}`,
        }, { long_url: url });
    }

    private async ouo(url: string) {
        return this.shortenUrl(`http://ouo.io/api/KzDtJCvY?s=${url}`);
    }

    private async onept(url: string) {
        return this.shortenUrl(`https://csclub.uwaterloo.ca/~phthakka/1pt/addURL.php?url=${encodeURIComponent(url)}`);
    }

    private async cleanuri(url: string) {
        return this.shortenUrl("https://cleanuri.com/api/v1/shorten", {
            method: "POST",
        }, { url });
    }

    private async gotiny(url: string) {
        return this.shortenUrl("https://gotiny.cc/api", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
        }, { input: url });
    }

    private async isgd(url: string) {
        return this.shortenUrl(`https://is.gd/create.php?format=json&url=${url}`);
    }

    private async vgd(url: string) {
        return this.shortenUrl(`https://v.gd/create.php?format=json&url=${url}`);
    }

    private async tnyim(url: string) {
        return this.shortenUrl(`https://tny.im/yourls-api.php?format=json&action=shorturl&url=${url}`);
    }

    private async kutt(url: string) {
        const config = {
            headers: {
                "X-API-KEY": this.apiKeys.kutt,
                "Content-Type": "application/json",
            },
        };
        const jsonBody = {
            target: url,
        };
        return this.shortenUrl("https://kutt.it/api/v2/links", {
            method: "POST",
            headers: config.headers,
        }, jsonBody);
    }

    private async rebrandly(url: string) {
        const encoded = encodeURIComponent(url);
        return this.shortenUrl(`https://api.rebrandly.com/v1/links/new?destination=${encoded}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json; charset=utf-8",
                apikey: this.apiKeys.rebrandly,
                Host: "api.rebrandly.com",
            },
        });
    }

    private async multishort(url: string) {
        return this.shortenUrl("https://short-link-api.vercel.app/?query=" + url);
    }

    private async shrtco(url: string) {
        return this.shortenUrl(`https://api.shrtco.de/v2/shorten?url=${url}`)
            .then(result => result.
