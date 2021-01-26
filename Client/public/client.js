function setValue(val, input){
	var aux = input.value.split('\\');
	$(val).html(aux[aux.length - 1])
}