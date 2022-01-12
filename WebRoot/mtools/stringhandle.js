function format(source, params) {
	if (arguments.length === 1) {
		return function () {
			var args = $.makeArray(arguments);
			args.unshift(source);
			return $.validator.format.apply(this, args);
		};
	}
	if (arguments.length > 2 && params.constructor !== Array) {
		params = $.makeArray(arguments).slice(1);
	}
	if (params.constructor !== Array) {
		params = [params];
	}
	$.each(params, function (i, n) {
		source = source.replace(new RegExp("\\{" + i + "\\}", "g"), function () {
			return n;
		});
	});
	return source;
};

function replaceFirst(str, substr,replacestr) {
	return str.replace(substr,replacestr);
};

function replaceAll(str,regstr,replacestr) {
	return str.replace(eval("/"+regstr+"/g"),replacestr);
};

function getRegStrs(str,regstr) {
	var reg=eval("/"+regstr+"/g");
	var resulta=[]
	while((result=reg.exec(str))!=null)
	{
		resulta.push(result);
	}
	return resulta;
};

function isSuitReg(str,regstr) {
	var reg=eval("/^"+regstr+"$/");
	return reg.test(str);
};
