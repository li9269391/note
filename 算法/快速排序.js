// （1）在数据集之中，选择一个元素作为"基准"（pivot）。

// （2）所有小于"基准"的元素，都移到"基准"的左边；所有大于"基准"的元素，都移到"基准"的右边。

// （3）对"基准"左边和右边的两个子集，不断重复第一步和第二步，直到所有子集只剩下一个元素为止。


function quickSort(list) {

    if (list.length <= 1) {
        return list;
    }

    var left = [];
    var right = [];
    var pivot = list[0];

    for (var i = 1; i < list.length; i++) {
        if(list[i] < pivot){
            left.push(list[i]);
        } else {
            right.push(list[i]);
        }
    }
    return quickSort(left).concat(pivot,quickSort(right));
}

alert(quickSort([5,3,9,1,4,6,8]));
