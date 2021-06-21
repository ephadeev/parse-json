const fs = require('fs');


/**
 * Серверы из списка который скидывал Женя Капешко (мануально удалены серверы которых нет Entwicklungumgebung
 * и в Hambach
 * */
let neededServersWithoutVersion = fs
    .readFileSync('S00U08_servers.txt', 'utf8')
    .split('\n'); // neededServersWithoutVersion.length = 315 шт

// console.log(neededServersWithoutVersion);


/**
 * looksce.txt лог выведенный из OutsideView. Сделан был поиск файлов начинающихся на S* в SCE всех продуктов в PG3.
 * Мануально удалены несколько серверов из 98 продукта.
 * sces  - массив массивов, в каждом первый элемент - имя сервака в pg3 (c версией), есть копии (старые и новые версии).
 * */
let sces = fs
    .readFileSync('looksce.txt', 'utf8')
    .split('\n')
    .map(line => line.split(' '))
    .filter(sce => {
        // фильтруем чтобы остались только сервера:
        if (sce[0].charAt(0) === 'S' && sce[0].charAt(3) === 'S') {
            return sce;
        }
    });

// console.log(sces);// [ [], [], [] ]   [][0] - имя с версией, [][6] - 'NCNC' или 'N---'


/**
 * servers - JSON выведенный из Entwicklungumgebung Эрнста. Таблица plus-server.
 * */
let servers = require('./plus_server');

let sqlStrings = servers
    .map(server => {
        let serverNameWithoutVersion = server['server'].substring(0, 6);

        for (let i = 0; i < neededServersWithoutVersion.length; i++) {

            (function (i_local) {
                return (function () {
                    //console.log(i_local, 'elem: ', neededServersWithoutVersion[i_local], 'serverNameWithoutVersion: ', serverNameWithoutVersion);
                })()
            })(i);

        }

        neededServersWithoutVersion.forEach(elem => {

            if (elem === serverNameWithoutVersion) {
                console.log(elem === serverNameWithoutVersion);
                console.log(server);
                return server;
            }
        });

        // return neededServersWithoutVersion.includes(server['server'].substring(0, 6));
        /*if (
            server['server'].charAt(0) === 'S' &&
            server.server.charAt(3) === 'S'
        ) {
            console.log(server['server'], neededServersWithoutVersion.includes(server['server'].substring(0, 6)), server['server'].substring(0, 6));
            return server; // почему только последний оставил?
        }*/
    }); // [{}, {}, {}]

// console.log(sqlStrings);