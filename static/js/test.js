function sort(arr){
	for(var i=0; i<arr.length; i++){
		for(var j=0; j<=arr.length-i; j++){
			if( arr[j]>arr[j+1] ){
				var sum = arr[j] + arr[j+1];
				arr[j] = sum - arr[j];
				arr[j+1] = sum - arr[j+1];
			}
		}
	}
	console.log(arr);
}
var arr = [2,3,10,3,6,4];
sort(arr);
var a = 1,b = 2;
console.log(++a==b);

