

/**
 * 对后端返回的列表数据进行相同数据整合处理
 */
oldList = [
    {
        id: 111,
        date: '05-25',
        list: [1, 2, 3]
    },
    {
        id: 222,
        date: '05-26',
        list: [4, 5]
    },
    {
        id: 111,
        date: '05-25',
        list: [4, 5]
    }
]
function formatList() {
    let newList = Array.from(
        oldList.reduce((dict, item) => {
            if (dict.has(item.id)) {
                dict.get(item.id).list.push(...item.list);
            } else {
                dict.set(item.id, {
                    id: item.id,
                    date: item.date,
                    list: [...item.list]
                });
            }
            return dict
        }, new Map())
    ).map(item => ({
        date: item[1].date,
        id: item[1].id,
        list: item[1].list
    }));

    console.log(newList)
    // [
    //     {
    //         id: 111,
    //         date: '05-25',
    //         list: [1, 2, 3, 4, 5]
    //     },
    //     {
    //         id: 222,
    //         date: '05-26',
    //         list: [4, 5]
    //     }
    // ]
}
