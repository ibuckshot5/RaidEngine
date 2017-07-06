import * as express from "express";
import * as pogobuf from "pogobuf-vnext";

var app = express();

app.get('/', (req,res)=>{
    var gymid = req.params.get("id");
    var gymlat = req.params.get("lat");
    var gymlng = req.params.get("lng");
    var resp = ScanGym("username", "password", "hsjdgjvksdnmgvksdmgsdg", gymid, gymlat, gymlng);
    res.json(resp);
});

async function ScanGym(username,password,hashkey,id,lat,lng){
    return new Promise(async (resolve, reject) => {
        let client = new pogobuf.Client({
            authType: 'ptc',
            username: username,
            password: password,
            hashingKey: hashkey,
            useHashingServer: true
        });

        client.setPosition(lat, lng);

        await client.init(false);
        await client.batchStart().batchCall();
        await client.getPlayer('US', 'en', 'America/New_York');

        // This is where the fun begins
        var cells = pogobuf.Utils.getCellIDs(lat, lng, 5, 17);
        var tss = [];
        cells.forEach(cell => {
            tss.push(0)
        });
        var response = null;
        await client.getMapObjects(cells, tss).then(res => {
            let forts = response[0].map_cells.reduce((all, c) => all.concat(c.forts), []);
            let gym = forts.filter(f => f.type === 0).filter(g => g.id === id);
            response = gym[0];
        });

        client.cleanUp();
        resolve(response);
    });
}

app.listen(3000);
