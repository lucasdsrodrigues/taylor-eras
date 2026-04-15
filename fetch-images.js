const https = require('https');

const options = {
    hostname: 'commons.wikimedia.org',
    path: '/w/api.php?action=query&list=search&srsearch="Reputation%20Stadium%20Tour"%20"Taylor%20Swift"&srnamespace=6&srlimit=50&format=json',
    headers: { 'User-Agent': 'ReactErasSiteScript/1.0 (coolapp@example.com)' }
};

https.get(options, (res) => {
    let raw = '';
    res.on('data', chunk => raw += chunk);
    res.on('end', () => {
        const data = JSON.parse(raw);
        const files = data.query.search;
        
        const jpgs = files
            .map(img => img.title)
            .filter(t => t.toLowerCase().endsWith('.jpg') || t.toLowerCase().endsWith('.png'))
            .slice(0, 30);
            
        console.log(JSON.stringify(jpgs, null, 2));
    });
});
