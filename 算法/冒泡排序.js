
//	1.通过在无序区的2个相邻元素的比较和替换，使最大的的元素浮到最上面。

var bubbleSort = function (arr) {

	var len = arr.length;
	var i, j;

	for (i = 0; i < len; i++) {
		for (j = 0; j < len - i; j++) {
			toCon(j, j+1);
		}
	}

	function toCon(prev, next) {
		var temp = '';
		if (arr[prev] > arr[next]) {
			temp = arr[prev];
			arr[prev] = arr[next]
			arr[next] = temp;
		}
	}

	return arr;

}

bubbleSort([4, 5, 2, 1, 7]);	// [1,2,4,5,7]