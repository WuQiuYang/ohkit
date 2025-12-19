export function addSearchToUrl(url: string, params: Record<string, string | number | undefined> = {}) {
    if (url) {
        const arr = url.split('#');
        const main = arr[0].split('?');
        const preSearch = main[1];
        let newSearch = '';
        let addS = '';
        for (const [k, v] of Object.entries(params)) {
            if (v !== undefined && v !== null) {
                addS += `&${k}=${v}`;
            }
        }
        if (preSearch) {
            newSearch += preSearch + addS;
        } else {
            newSearch = addS.slice(1);
        }
        const mainUrl = `${main[0]}${newSearch ? '?' + newSearch : ''}`;
        if (arr[1]) {
            return `${mainUrl}#${arr[1]}`;
        } else {
            return mainUrl;
        }
    }
    return '';
}