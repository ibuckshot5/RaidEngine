import * as express from "express";
import * as pogobuf from "pogobuf-vnext";

var app = express();

app.get('/', (req,res)=>{
    var gymid = req.param("id");
    var gymlat = req.param("lat");
    var gymlng = req.param("lng");
    let client = new pogobuf.Client({
        authType: 'ptc',
        username: "Username",
        password: "Password",
        hashingKey: "HashKey",
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
    res.json(resp);
});

app.listen(3000);
