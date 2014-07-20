MathJax.Hub.Config({
	  showProcessingMessages: false
});

var app = angular.module("pastemath", []);

app.controller("PasteMathController", function($scope) {
  const HOMEPAGE = "http://pastemath.varokas.com/"
  const VIEW = "view";
  const EDIT = "edit";

  $scope.mode = VIEW;
  $scope.instructionText = "Click to edit numeric values";

  $scope.formulaName = valOrDefault(getParameterByName("t"), "Your Formula Name Here");
  $scope.expr = valOrDefault(getParameterByName("e"), "y = (pas+te)/math");
  $scope.params = valOrDefault(unpackParams(getParameterByName("p")), [
    {"name": "pas", "val": 123, "desc": "enter variable"},
    {"name": "te", "val": 45, "desc": "description and"},
    {"name": "math", "val": 67, "desc": "default values"}
  ]);

  $scope.result = valOrDefault(
		unpackResult(getParameterByName("r")),
		{"name": "y", "desc": "with result description"}
	);
  setInitialPrettyPrint($scope.expr);
  refreshEvalValue();

  $scope.removeParam = function(index) {
    $scope.params.splice(index,1);
  }

  $scope.addParam = function() {
    $scope.params.push({"name": "", "val": "", "desc": ""});
  }

  $scope.isView = function() {
    return $scope.mode == VIEW;
  }

  $scope.isEdit = function() {
    return $scope.mode == EDIT;
  }

  $scope.getModeText = function() {
    if($scope.isView()) {
      return "Edit";
    } else {
      return "Finish Editing"
    }
  }

  $scope.toggleMode = function() {
    if($scope.isView()) {
      $scope.mode = EDIT;
    } else {
      $scope.mode = VIEW;
    }
  }

  $scope.updateInstr = function() {
    $scope.instructionText = " ";
  }

  $scope.$watch('expr', function(newValue, oldValue) {
    var node = null;

    try {
      node = math.parse(newValue);
    }
    catch (err) {
      $scope.result.val = err.toString();
    }

    refreshEvalValue();

    try {
      var latex = node ? node.toTex() : '';

      var elem = MathJax.Hub.getAllJax('pretty')[0];
      MathJax.Hub.Queue(['Text', elem, latex]);
    }
    catch (err) {}
  });

  $scope.refreshEvalValue = function() {
    refreshEvalValue();
  }

  $scope.openShareDialog = function() {
    var queryString = $.param({
      "t": $scope.formulaName,
      "e": $scope.expr,
      "p": packParams($scope.params),
      "r": packResult($scope.result)
    });

    Modal.open({
      hideClose: true,
      width: "80%",
      content: '<strong>Copy and paste this link to share</strong><textarea onclick="this.focus();this.select()" style="width:100%; height:4em">'
      + HOMEPAGE + '?' + queryString
      + '</textarea>'
    });
  }

  function packParams(params) {
    return params.map(function(item) {
      return item.name + "," + item.val + "," + item.desc
    }).reduce(function(previousValue, currentValue) {
      return previousValue + "\n" + currentValue;
    });
  }

	function unpackParams(paramsTxt) {
		if(paramsTxt == undefined) return undefined;

		var lines = paramsTxt.split("\n");
		return lines.map( function(l) {
	    var tokens = l.split(",");

	    return { name: tokens[0], val: parseFloat(tokens[1]), desc: tokens[2] };
	  });
	}

  function packResult(resultParams) {
    return resultParams.name + "," + resultParams.desc
  }

	function unpackResult(resultTxt) {
		if(resultTxt == undefined) return undefined;

    var tokens = resultTxt.split(",");

    return { name: tokens[0], desc: tokens[1] };
  }

  function refreshEvalValue() {
    var mathScope = {};
    $scope.params.forEach(function(item) {
      mathScope[item.name] = item.val;
    });

    try {
      var node = math.parse($scope.expr);
      var calculatedResult = node.compile(math).eval(mathScope);

      $scope.result.val = calculatedResult.toFixed(3);
    } catch (err) {
      $scope.result.val = "Error";
    }
  }

	function valOrDefault(val, def) {
		return val ? val : def;
	}

  function setInitialPrettyPrint(exprToSet) {
    document.getElementById('pretty').innerHTML = '$$' + math.parse(exprToSet).toTex() + '$$';
  }

  function getParameterByName(name) {
    name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
    var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
      results = regex.exec(location.search);
    return results == null ? undefined : decodeURIComponent(results[1].replace(/\+/g, " "));
  }
});
