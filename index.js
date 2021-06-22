const fs = require('fs');

/**
 * looksce.txt лог выведенный из OutsideView. Сделан был поиск файлов начинающихся на S* в SCE всех продуктов в PG3.
 * Мануально удалены несколько серверов из 98 продукта.
 * sces  - массив массивов, в каждом первый элемент - имя сервака в pg3 (c версией), есть копии (старые и новые версии).
 * */
async function getSceData() {
    let sces = await fs
        .readFileSync('looksce.txt', 'utf8')
        .split('\n')
        .map(line => line.split(' '));

    return sces.filter((element, index, array) => element[0].charAt(0) === 'S' && element[0].charAt(3) === 'S');
}


/**
 * servers - JSON выведенный из Entwicklungumgebung Эрнста. Таблица plus-server.
 * */
async function getPlusServerData(product) {
    let servers = await require('./plus_server');
    return servers.filter(server => server['server'].substring(1, 3) === `${product > 9 ? `${product}` : `0${product}`}` && server['server'].substring(0, 1) === 'S' && server['server'].substring(3, 4) === 'S');
}


/**
 * Серверы из списка который скидывал Женя Капешко (мануально удалены серверы которых нет Entwicklungumgebung
 * и в Hambach
 * */
async function getNeededServers(product) {
    let neededServersWithoutVersion = await fs
        .readFileSync('S00U08_servers.txt', 'utf8')
        .split('\n'); // neededServersWithoutVersion.length = 315 шт
    return neededServersWithoutVersion.filter(neededServers => neededServers.substring(1, 3) === `${product > 9 ? `${product}` : `0${product}`}` && neededServers.substring(0, 1) === 'S' && neededServers.substring(3, 4) === 'S');
}

Promise.all([getPlusServerData(35), getNeededServers(35), getSceData()]).then(result => {
    // result[0]; // json из инеос со всей кашей
    // result[1]; // нужные нам серваки без расширения

    result[1].forEach(neededServer => {
        result[0].forEach(server => {
            let newVersion = +server['server'].substring(6, 8) + 1;
            let serverName = server['server'].substring(0, 6);
            if (serverName === neededServer.replace(/\r/g, '')) {
                console.log(`UPDATE plus_ineos.plus_server SET server = \"${server['server'].substring(0, 6)}${newVersion > 9 ? `${newVersion}` : `0${newVersion}`}\", server_path = \"${server['server_path'].substring(0, 22)}${newVersion > 9 ? `${newVersion}` : `0${newVersion}`}\", compile_status = \"NEW\" WHERE plus_server.server = \"${server['server']}\";`);
            }
        })
    });

    result[2].forEach((element, index, array) => {
        if (index > 1) {
            if (element[0].substring(0, 6) === array[index - 1][0].substring(0, 6) && element[0].substring(0, 6) === array[index - 2][0].substring(0, 6)) {
                // console.log(element[0], ' - ', array[index - 1][0], ' - ', array[index - 2][0]);
            }
        }
    });
});