
//	1.每一轮找最小值，放在前面

var selectSort = function (arr) {

	var len = arr.length;

	if (len == 1) {
		return arr;
	}

	var iMin = arr[0];
	var iIndex = 0;
	var i;
	for (i = 1; i < len; i++) {
		if (arr[i] < iMin) {
			iMin = arr[i];
			iIndex = i;
		}
	}

	var minValue = arr.splice(iIndex,1);	//找到最小值，splice返回被删除的arr

	return minValue.concat( arguments.callee(arr));

}

selectSort([4, 5, 2, 1, 7]);	// [1,2,4,5,7]